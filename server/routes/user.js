const express = require('express');
const router = express.Router();
const admin = require("../firebaseAdmin"); // correct import


// Controllers
const {
    signup,
    login,
    sendOTP,
    changePassword
} = require('../controllers/auth');

// Resetpassword controllers
const {
    resetPasswordToken,
    resetPassword,
} = require('../controllers/resetPassword');


// Middleware
const { auth, isAdmin } = require('../middleware/auth');
const { getAllStudents, getAllInstructors } = require('../controllers/profile');


// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user signup
router.post('/signup', signup);

// Route for user login
router.post("/login", async (req, res) => {
    const { token, email, name, avatar } = req.body;
  
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
  
      // Optionally check that decoded email matches provided email
      if (decodedToken.email !== email) {
        return res.status(401).json({ success: false, message: "Email mismatch" });
      }
  
      return res.status(200).json({
        success: true,
        message: "Login successful",
        user: { email, name, avatar },
      });
    } catch (err) {
      console.error("Error verifying token:", err);
      return res.status(401).json({ success: false, message: "Invalid Google token" });
    }
  });

// Route for sending OTP to the user's email
router.post('/sendotp', sendOTP);

// Route for Changing the password
router.post('/changepassword', auth, changePassword);



// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
router.post('/reset-password-token', resetPasswordToken);

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)


// ********************************************************************************************************
//                                     Only for Admin - getAllStudents & getAllInstructors
// ********************************************************************************************************

router.get("/all-students", auth, isAdmin, getAllStudents)
router.get("/all-instructors", auth, isAdmin, getAllInstructors)



module.exports = router