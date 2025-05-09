// sendOtp , signup , login ,  changePassword
const User = require('./../models/user');
const Profile = require('./../models/profile');
const optGenerator = require('otp-generator');
const OTP = require('../models/OTP')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cookie = require('cookie-parser');
const mailSender = require('../utils/mailSender');
const otpTemplate = require('../mail/emailVerificationTemplate');
const { passwordUpdated } = require("../mail/passwordUpdate");

// ================ SEND-OTP For Email Verification ================
exports.sendOTP = async (req, res) => {
    try {

        // fetch email from re.body 
        const { email } = req.body;

        // check user already exist ?
        const checkUserPresent = await User.findOne({ email });

        // if exist then response
        if (checkUserPresent) {
            console.log('(when otp generate) User alreay registered')
            return res.status(401).json({
                success: false,
                message: 'User is Already Registered'
            })
        }

        // generate Otp
        const otp = optGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })
        // console.log('Your otp - ', otp);

        const name = email.split('@')[0].split('.').map(part => part.replace(/\d+/g, '')).join(' ');
        console.log(name);

        // send otp in mail
        await mailSender(email, 'OTP Verification Email', otpTemplate(otp, name));

        // create an entry for otp in DB
        const otpBody = await OTP.create({ email, otp });
        console.log("OTP saved to DB:", otpBody);
        


        // return response successfully
        res.status(500).json({
            success: true,
            otp,
            message: 'Otp sent successfully'
        });
    }

    catch (error) {
        console.log('Error while generating Otp - ', error);
        res.status(200).json({
            success: false,
            message: 'Error while generating Otp',
            error: error.mesage
        });
    }
}


// ================ SIGNUP ================
exports.signup = async (req, res) => {
    try {
        const { googleToken } = req.body;

        // If the user is signing up via Google, we use the Google token
        if (googleToken) {
            const ticket = await client.verifyIdToken({
                idToken: googleToken,
                audience: process.env.GOOGLE_CLIENT_ID,  // Google Client ID
            });

            const payload = ticket.getPayload();
            const { email } = payload;

            // Check if user already exists in DB
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User already registered, please login',
                });
            }

            // Create new user
            const newUser = await User.create({
                firstName: payload.given_name,
                lastName: payload.family_name,
                email,
                password: '',  // No password for Google Sign-In
                accountType: 'Student',  // Default to Student or set as per your requirement
                additionalDetails: await Profile.create({}),
                approved: true,  // Set approved as needed
                image: payload.picture, // Use Google's profile picture
            });

            // Generate JWT token
            const userPayload = {
                email: newUser.email,
                id: newUser._id,
                accountType: newUser.accountType,
            };

            const token = jwt.sign(userPayload, process.env.JWT_SECRET, {
                expiresIn: '24h',
            });

            return res.status(200).json({
                success: true,
                message: 'User registered and logged in successfully',
                token,
                user: newUser,
            });
        }

        // Normal signup flow (OTP, password, etc.) can go here
        // This is where your existing signup code will be used.
    } catch (error) {
        console.log('Error during signup:', error);
        res.status(500).json({
            success: false,
            message: 'Error while signing up user',
            error: error.message,
        });
    }
};


// ================ LOGIN ================
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);  // Google Client ID

exports.login = async (req, res) => {
    try {
        const { email, password, googleToken } = req.body;

        // If the user is signing in via Google, we use the Google token
        if (googleToken) {
            const ticket = await client.verifyIdToken({
                idToken: googleToken,
                audience: process.env.GOOGLE_CLIENT_ID,  // Google Client ID
            });

            const payload = ticket.getPayload();
            const { email } = payload;

            // Check if user already exists in DB
            let user = await User.findOne({ email }).populate('additionalDetails');
            console.log("Processing Google login for:", email);

            if (!user) {
                console.log("Creating new user...");
                // Create user logic here
                user = await User.create({
                    firstName: name.split(' ')[0],
                    lastName: name.split(' ')[1] || '',
                    email,
                    password: '', // No password for Google sign-in
                    accountType: 'Student', // Adjust based on your logic
                    approved: true,
                    image: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`,
                });
                console.log("User created:", user);
            }
            
            // Generate JWT token
            const userPayload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            };

            const token = jwt.sign(userPayload, process.env.JWT_SECRET, {
                expiresIn: '24h',
            });

            // Send token in the response
            return res.status(200).json({
                success: true,
                message: 'User logged in successfully',
                token,
                user,
            });
        }

        // Normal login flow for non-Google login (email & password)
        const checkUser = await User.findOne({ email }).populate('additionalDetails');
        if (!checkUser) {
            return res.status(401).json({
                success: false,
                message: 'You are not registered with us',
            });
        }

        // Compare passwords
        const isPasswordMatch = await bcrypt.compare(password, checkUser.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Password not matched',
            });
        }

        const payload = {
            email: checkUser.email,
            id: checkUser._id,
            accountType: checkUser.accountType,
        };

        // Generate JWT token
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '24h',
        });

        res.cookie('token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
        }).status(200).json({
            success: true,
            message: 'User logged in successfully',
            user: checkUser,
            token,
        });
    } catch (error) {
        console.log('Error during login:', error);
        res.status(500).json({
            success: false,
            message: 'Error while logging in user',
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