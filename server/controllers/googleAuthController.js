const User = require("../models/user");
const Profile = require("../models/profile");
const jwt = require("jsonwebtoken");
const admin = require("../config/firebaseAdmin");

exports.googleLogin = async (req, res) => {
  try {
    const { token, accountType } = req.body;

    console.log("👉 Received Google Login Request");
    console.log("📨 Token:", token ? "[RECEIVED]" : "[MISSING]");
    console.log("🎓 Account Type (raw):", accountType);

    if (!token) {
      return res.status(400).json({ success: false, message: "Token missing" });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const { email, name, picture } = decodedToken;

    console.log("✅ Token Decoded:", { email, name });

    if (!email || !name) {
      return res.status(400).json({ success: false, message: "Invalid token payload" });
    }

    // Check if user exists
    let user = await User.findOne({ email })
    .populate("additionalDetails")
    .populate("courses", "courseName");
      console.log(user ? "👤 User already exists" : "🆕 Creating new user");

    if (!user) {
      const [firstName, ...rest] = name?.split(" ") || [];
      const lastName = rest.join(" ") || "";

      const profileDetails = await Profile.create({
        gender: null,
        dateOfBirth: null,
        about: null,
        contactNumber: null,
      });

      // Normalize accountType for enum
      const normalizedRole =
        accountType?.toLowerCase() === "instructor" ? "Instructor" :
        accountType?.toLowerCase() === "admin" ? "Admin" :
        "student";

      console.log("🧾 Normalized Account Type:", normalizedRole);

      user = await User.create({
        firstName,
        lastName,
        email,
        contactNumber: null,
        password: "", // No password for Google login
        accountType: normalizedRole,
        loginType: "google",
        additionalDetails: profileDetails._id,
        approved: true,
        image: picture || `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
      });

      console.log("✅ New User Created:", user._id);
    }

    // JWT & cookie
    const payload = {
      email: user.email,
      id: user._id,
      accountType: user.accountType,
    };

    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });

    user = user.toObject();
    user.token = jwtToken;
    user.password = undefined;

    const cookieOptions = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: "None",
      secure: true,
    };

    console.log("🍪 Setting cookie and returning response...");

    return res.cookie("token", jwtToken, cookieOptions).status(200).json({
      success: true,
      user,
      token: jwtToken,
      message: "Logged in with Google successfully",
    });

  } catch (error) {
    console.error("🔥 Google login error:", error.message);
    console.error("🔥 Full stack:", error.stack);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error during Google login",
      error: error.message,
    });
  }
};
