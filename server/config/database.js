const mongoose = require('mongoose');
require('dotenv').config();

exports.connectDB = () => {
    mongoose.connect(process.env.DATABASE_URL, {  // Added missing comma after DATABASE_URL
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));
    
    // Add event listeners
    mongoose.connection.on('connected', () => {
        console.log('Mongoose connected to DB');
    });
    
    mongoose.connection.on('error', (err) => {
        console.error('Mongoose connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose disconnected');
    });
};