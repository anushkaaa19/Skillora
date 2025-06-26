const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
exports.resetPasswordToken = async (req, res) => {
    try {
      const { email } = req.body;
      console.log("Request received to reset password for:", email);
  
      const user = await User.findOne({ email });
      if (!user) {
        console.log("❌ Email not found:", email);
        return res.status(401).json({
          success: false,
          message: 'Your Email is not registered with us',
        });
      }
  
      console.log("✅ User found:", user.email);
  
      const rawToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  
      user.token = hashedToken;
      user.resetPasswordTokenExpires = Date.now() + 15 * 60 * 1000;
      await user.save();
      console.log("✅ Token saved to DB");
  
      const frontendURL = `http://localhost:3000/reset-password/${rawToken}`;
      const htmlContent = `<p>Reset link: <a href="${frontendURL}">${frontendURL}</a></p>`;
  
      await mailSender(user.email, "Reset Your Password", htmlContent);
      console.log("📧 Email sent to", user.email);
  
      res.status(200).json({
        success: true,
        message: 'Password reset email sent successfully.',
      });
    } catch (error) {
      console.error("❌ Error in resetPasswordToken:", error);
      res.status(500).json({
        success: false,
        message: 'Error while creating token for reset password',
        error: error.message,
      });
    }
  };
  

exports.resetPassword = async (req, res) => {
  try {
    const token = req.body.token || req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
    const { password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      token: hashedToken,
      resetPasswordTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.token = undefined;
    user.resetPasswordTokenExpires = undefined;
    await user.save();

    // Send confirmation email
    await mailSender(user.email, "Password Updated", passwordUpdated(user.email, user.firstName));

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error while resetting password:", error);
    res.status(500).json({
      success: false,
      message: "Error while resetting password",
      error: error.message,
    });
  }
};
