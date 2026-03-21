const { db, isFirebaseConfigured } = require('../config/firebase');

const getRoot = (req, res) => {
  res.json({
    success: true,
    message: 'CapitaPrimellc Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    config: {
      firebase_configured: isFirebaseConfigured(),
      jwt_secret_configured: !!process.env.JWT_SECRET,
      port: process.env.PORT || 3000
    }
  });
};

const getHealth = async (req, res) => {
  try {
    // Check Firebase connection
    let firebaseStatus = 'not_configured';
    if (isFirebaseConfigured()) {
      try {
        await db.collection('health_check').doc('test').set({
          timestamp: new Date(),
          status: 'ok'
        });
        firebaseStatus = 'healthy';
      } catch (firebaseError) {
        firebaseStatus = 'unhealthy';
        console.warn('Firebase health check failed:', firebaseError.message);
      }
    }

    const healthData = {
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      services: {
        firebase: firebaseStatus,
        database: firebaseStatus === 'healthy' ? 'healthy' : 'not_configured'
      },
      environment: {
        node_version: process.version,
        platform: process.platform,
        environment: process.env.NODE_ENV || 'development'
      }
    };

    // Return 200 if core services are healthy (Firebase is optional)
    const statusCode = 200;

    res.status(statusCode).json(healthData);

  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: process.env.NODE_ENV === 'development' ? error.message : 'Service unavailable'
    });
  }
};

module.exports = {
  getRoot,
  getHealth
};