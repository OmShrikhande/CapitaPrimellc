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
        status: 'error',
        description: 'Email and password are required'
      });
    }

    // Check if Firebase is configured
    if (!isFirebaseConfigured()) {
      return res.status(500).json({
        success: false,
        status: 'error',
        description: 'Database not available'
      });
    }

    // Query admin credentials from database
    const adminQuery = await db.collection('admins').where('email', '==', email).limit(1).get();

    if (adminQuery.empty) {
      return res.status(401).json({
        success: false,
        status: 'unauthorized',
        description: 'Invalid credentials'
      });
    }

    const adminDoc = adminQuery.docs[0];
    const adminData = adminDoc.data();

    // Compare password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, adminData.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        status: 'unauthorized',
        description: 'Invalid credentials'
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
      status: 'success',
      description: 'Login successful',
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
      status: 'error',
      description: 'Internal server error',
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