// sendOtp , signup , login ,  changePassword
const User = require('./../models/user');
const Profile = require('./../models/profile');
const optGenerator = require('otp-generator');
const OTP = require('../models/OTP')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cookie = require('cookie');
const mailSender = require('../utils/mailSender');
const otpTemplate = require('../mail/templates/emailVerificationTemplate');
const { passwordUpdated } = require("../mail/templates/passwordUpdate");

// ================ SEND-OTP For Email Verification ================
exports.sendOTP = async (req, res) => {
    try {
      const { email } = req.body;
  
      console.log('[sendOTP] Received request to send OTP to:', email);
  
      // Check if user already exists
      const checkUserPresent = await User.findOne({ email });
      console.log('[sendOTP] Result of User.findOne:', checkUserPresent);
  
      if (checkUserPresent) {
        console.log('[sendOTP] User already registered. Email:', email);
        return res.status(409).json({
          success: false,
          message: 'User is already registered',
        });
      }
  
      // Generate OTP
      const otp = optGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
  
      const name = email.split('@')[0].split('.').map(part => part.replace(/\d+/g, '')).join(' ');
      console.log('[sendOTP] Generated OTP:', otp);
      console.log('[sendOTP] Name from email:', name);
  
      // Send email
      const emailSent = await mailSender(email, 'OTP Verification Email', otpTemplate(otp, name));
      console.log('[sendOTP] Email send status:', emailSent ? 'Success' : 'Failed');
  
      // Store OTP in DB
      const savedOTP = await OTP.create({ email, otp });
      console.log('[sendOTP] OTP saved to DB:', savedOTP);
  
      // Success response
      return res.status(200).json({
        success: true,
        otp,
        message: 'OTP sent successfully',
      });
    } catch (error) {
      console.log('[sendOTP] Error occurred:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error while generating OTP',
        error: error.message,
      });
    }
  };
  

// ================ SIGNUP ================
exports.signup = async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp
      } = req.body;
  
      console.log("➡️ Signup Request Received");
      console.log("📩 Email:", email);
      console.log("🔢 OTP Entered:", otp);
  
      // Validation
      if (!firstName || !lastName || !email || !password || !confirmPassword || !accountType || !otp) {
        console.log("❌ Missing Fields");
        return res.status(401).json({
          success: false,
          message: 'All fields are required..!'
        });
      }
  
      // Password Match Check
      if (password !== confirmPassword) {
        console.log("❌ Password Mismatch");
        return res.status(400).json({
          success: false,
          message: 'Password & Confirm Password do not match'
        });
      }
  
      // Check if user already exists
      const checkUserAlreadyExists = await User.findOne({ email });
      if (checkUserAlreadyExists) {
        console.log("⚠️ User already registered:", email);
        return res.status(400).json({
          success: false,
          message: 'User already registered, go to Login Page'
        });
      }
  
      // Find most recent OTP
      const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });
      console.log("📦 OTP record from DB:", recentOtp);
  
      if (!recentOtp) {
        console.log("❌ No OTP found in DB");
        return res.status(400).json({
          success: false,
          message: 'OTP not found, please try again'
        });
      }
  
      if (otp !== recentOtp.otp) {
        console.log("❌ Invalid OTP entered");
        return res.status(400).json({
          success: false,
          message: 'Invalid OTP'
        });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("🔐 Password hashed");
  
      // Create profile
      const profileDetails = await Profile.create({
        gender: null,
        dateOfBirth: null,
        about: null,
        contactNumber: null
      });
      console.log("📄 Profile created:", profileDetails._id);
  
      // Instructor approval logic
      let approved = accountType === "Instructor" ? false : true;
  
      // Create user
      const userData = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        contactNumber,
        accountType,
        additionalDetails: profileDetails._id,
        loginType: 'normal', // ✅ FIXED
        approved: approved,
        image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
      });
  
      console.log("✅ User created:", userData.email);
  
      return res.status(200).json({
        success: true,
        message: 'User Registered Successfully'
      });
    }catch (error) {
      console.log('❌ Error during signup:', error.message);
      console.error('STACK TRACE:', error.stack);  // 👈 Add this
      return res.status(500).json({
        success: false,
        message: 'User cannot be registered, Please try again..!',
        error: error.message
      });
    }
    
  };
  


const admin = require('../config/firebaseAdmin'); // Firebase Admin SDK

exports.login = async (req, res) => {
    try {
        const { email, password, token } = req.body;
        console.log("🔥 Login route hit");
        console.log("📨 Request body:", req.body);

        // ========== Case 1: Google OAuth Login ==========
        if (token) {
          console.log("🔐 Google login path");
          console.log("📛 Token:", token);
            const decodedToken = await admin.auth().verifyIdToken(token);

            // Check token email matches request email
            if (decodedToken.email !== email) {
                return res.status(401).json({ success: false, message: "Email mismatch" });
            }

            // Check if user exists
            let user = await User.findOne({ email }).populate("additionalDetails");

            // If not, create the user
            if (!user) {
                const nameParts = decodedToken.name?.split(" ") || [];
                const firstName = nameParts[0] || "";
                const lastName = nameParts.slice(1).join(" ") || "";

                const profileDetails = await Profile.create({
                    gender: null, dateOfBirth: null, about: null, contactNumber: null
                });

                user = await User.create({
                    firstName,
                    lastName,
                    email,
                    contactNumber: null,
                    password: "", // No password for Google auth
                    accountType: "Student", // Default role
                    loginType: "google",     // ✅ add this line

                    additionalDetails: profileDetails._id,
                    approved: true,
                    image: decodedToken.picture || `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
                });
            }

            // Generate token
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            };

            const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "24h",
            });

            user = user.toObject();
            user.token = jwtToken;
            user.password = undefined;

            // Set cookie
            const cookieOptions = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
                sameSite: "None",
                secure: true,
            };

            return res.cookie("token", jwtToken, cookieOptions).status(200).json({
                success: true,
                user,
                token: jwtToken,
                message: "User logged in with Google successfully",
            });
        }

        // ========== Case 2: Traditional Email/Password Login ==========
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        let user = await User.findOne({ email }).populate("additionalDetails");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "You are not registered with us",
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Password not matched",
            });
        }

        const payload = {
            email: user.email,
            id: user._id,
            accountType: user.accountType,
        };

        const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "24h",
        });

        user = user.toObject();
        user.token = jwtToken;
        user.password = undefined;

        const cookieOptions = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            sameSite: "None",
            secure: true,
        };

        res.cookie("token", jwtToken, cookieOptions).status(200).json({
            success: true,
            user,
            token: jwtToken,
            message: "User logged in successfully",
        });

    } catch (error) {
        console.log("Error in login:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};



// ================ CHANGE PASSWORD ================
exports.changePassword = async (req, res) => {
    try {
        // extract data
        const { oldPassword, newPassword, confirmNewPassword } = req.body;

        // validation
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(403).json({
                success: false,
                message: 'All fileds are required'
            });
        }

        // get user
        const userDetails = await User.findById(req.user.id);

        // validate old passowrd entered correct or not
        const isPasswordMatch = await bcrypt.compare(
            oldPassword,
            userDetails.password
        )

        // if old password not match 
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false, message: "Old password is Incorrect"
            });
        }

        // check both passwords are matched
        if (newPassword !== confirmNewPassword) {
            return res.status(403).json({
                success: false,
                message: 'The password and confirm password do not match'
            })
        }


        // hash password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // update in DB
        const updatedUserDetails = await User.findByIdAndUpdate(req.user.id,
            { password: hashedPassword },
            { new: true });


        // send email
        try {
            const emailResponse = await mailSender(
                updatedUserDetails.email,
                'Password for your account has been updated',
                passwordUpdated(
                    updatedUserDetails.email,
                    `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                )
            );
            // console.log("Email sent successfully:", emailResponse);
        }
        catch (error) {
            console.error("Error occurred while sending email:", error);
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
                error: error.message,
            });
        }


        // return success response
        res.status(200).json({
            success: true,
            mesage: 'Password changed successfully'
        });
    }

    catch (error) {
        console.log('Error while changing passowrd');
        console.log(error)
        res.status(500).json({
            success: false,
            error: error.message,
            messgae: 'Error while changing passowrd'
        })
    }
}