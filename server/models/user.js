const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String, // Optional if Google user
    },
    accountType: {
      type: String,
      enum: ['Admin', 'Instructor', 'student'],
      required: true
    },
    active: {
      type: Boolean,
      default: true,
    },
    approved: {
      type: Boolean,
      default: true,
    },
    additionalDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      }
    ],
    image: {
      type: String,
    },
    loginType: {
      type: String,
      enum: ['normal', 'google'],
      required: true,
    },
    uid: {
      type: String, // Only for Google users
    },
    token: {
      type: String
    },
    resetPasswordTokenExpires: {
      type: Date
    },
    courseProgress: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CourseProgress'
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
