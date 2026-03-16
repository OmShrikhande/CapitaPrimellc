const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const { db, isFirebaseConfigured } = require('../config/firebase');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Check against environment variables (for demo purposes)
    // In production, you should store admin credentials securely in database
    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // For demo purposes, we're using plain text password comparison
    // In production, use bcrypt to hash and compare passwords
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = generateToken({
      email: email,
      role: 'admin',
      type: 'admin'
    });

    // Store login session in Firebase (optional)
    if (isFirebaseConfigured()) {
      try {
        await db.collection('admin_sessions').add({
          email: email,
          loginTime: new Date(),
          ip: req.ip,
          userAgent: req.get('User-Agent')
        });
      } catch (firebaseError) {
        console.warn('Failed to log session to Firebase:', firebaseError.message);
        // Don't fail the login if Firebase logging fails
      }
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token: token,
        user: {
          email: email,
          role: 'admin'
        }
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        email: req.user.email,
        role: req.user.role,
        type: req.user.type
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  login,
  getProfile
};