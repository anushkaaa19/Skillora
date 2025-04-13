const User = require('../models/user');
const mailSender = require('../utils/mailSender');
const crypto = require('crypto');



exports.resetPasswordToken = async (req, res) => {
    try {
        const { email } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Your Email is not registered with us'
            });
        }

        // Generate raw token (random string)
        const rawToken = crypto.randomBytes(20).toString("hex");
        console.log("Generated Raw Token:", rawToken); // Debugging log for raw token

        // Hash the raw token before saving to DB
        const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
        console.log("Hashed Token (to save in DB):", hashedToken); // Debugging log for hashed token

        // Set token and expiry time on user document
        user.token = hashedToken;
        user.resetPasswordTokenExpires = Date.now() + 5 * 60 * 1000;  // Expires in 5 minutes
        console.log("Token to Save:", user.token); // Debugging log for token before saving
        console.log("Expiry to Save:", user.resetPasswordTokenExpires); // Debugging log for expiry before saving

        // Save user document to database
        const savedUser = await user.save();  // Ensure save is awaited
        console.log("Saved User After Update:", savedUser); // Log the user document after save

        // Send email with the raw token for the user to reset their password
        const url = `https://your-frontend.com/update-password/${rawToken}`;
        // Send email (Implement your email sending here)

        res.status(200).json({
            success: true,
            message: 'Password reset email sent successfully.'
        });
    } catch (error) {
        console.error('Error while creating token for reset password:', error);
        res.status(500).json({
            success: false,
            message: 'Error while creating token for reset password',
            error: error.message
        });
    }
};


exports.resetPassword = async (req, res) => {
    try {
        const token = req.body?.token || req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');
        const { password, confirmPassword } = req.body;

        // Check for missing fields
        if (!token || !password || !confirmPassword) {
            return res.status(401).json({
                success: false,
                message: "All fields are required...!"
            });
        }

        // Check if the passwords match
        if (password !== confirmPassword) {
            return res.status(401).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

        // Hash the token sent by the user
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        // Find the user with the matching hashed token and valid expiration time
        const userDetails = await User.findOne({
            token: hashedToken,
            resetPasswordTokenExpires: { $gt: Date.now() }  // Check if token is valid
        });

        // If the token is invalid or expired
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        // Hash the new password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user's password and clear the reset token and expiration
        userDetails.password = hashedPassword;
        userDetails.token = undefined;  // Clear the reset token
        userDetails.resetPasswordTokenExpires = undefined;  // Clear expiration time

        // Save the updated user document
        await userDetails.save();

        // Respond with a success message
        return res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.error('Error while resetting password:', error);
        res.status(500).json({
            success: false,
            message: 'Error while resetting password',
            error: error.message
        });
    }
};
