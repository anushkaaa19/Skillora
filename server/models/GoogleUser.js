const mongoose = require('mongoose');

const GoogleUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  providerId: { type: String, default: 'google' },
  image: { type: String },
  uid: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('GoogleUser', GoogleUserSchema);