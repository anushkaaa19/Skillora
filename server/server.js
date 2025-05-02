const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const mongoose = require('mongoose');
const { connectDB } = require('./config/database');
const GoogleUser = require("./models/GoogleUser");
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

// Initialize Express app
const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parser middleware
app.use(bodyParser.json());

// Firebase Admin initialization
try {
  const serviceAccount = require('./skillora-adminsdk.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('Firebase Admin initialized successfully');
} catch (firebaseError) {
  console.error('Firebase Admin initialization failed:', firebaseError);
  process.exit(1);
}

// MongoDB connection with retry logic
const connectWithRetry = () => {
  connectDB();
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  });
};
connectWithRetry();

// JWT Generator
function generateJWT(user) {
  if (!user || !user._id || !user.email) {
    throw new Error('Invalid user object for JWT generation');
  }
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET || 'your-strong-secret-key',
    { expiresIn: '1h' }
  );
}

// Firebase Token Verification
async function verifyFirebaseToken(idToken) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Token verification failed:', error.message);
    throw new Error('Invalid or expired token');
  }
}
// ... (after all your other middleware and configurations)

// JWT Generator
function generateJWT(user) {
  if (!user || !user._id || !user.email) {
    throw new Error('Invalid user object for JWT generation');
  }
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET || 'your-strong-secret-key',
    { expiresIn: '1h' }
  );
}

// ===== ADD THE AUTH MIDDLEWARE HERE =====
const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

// ===== THEN ADD YOUR ROUTES AFTER =====
// Google Login Endpoint


// Google Login Endpoint
app.post('/api/auth/googlelogin', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token is required' 
      });
    }

    const decodedToken = await verifyFirebaseToken(token);
    let user = await GoogleUser.findOne({ email: decodedToken.email });

    if (!user) {
      user = await GoogleUser.create({
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.email.split('@')[0],
        providerId: 'google',
        image: decodedToken.picture || '',
        uid: decodedToken.uid
      });
    }

    const sessionToken = generateJWT(user);
    
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token: sessionToken,
      user: {
        email: user.email,
        name: user.name,
        image: user.image,
        id: user._id
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    firebase: admin.apps.length > 0 ? 'Initialized' : 'Not initialized'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// MongoDB Event Listeners
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
});