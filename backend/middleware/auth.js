const { verifyToken, extractToken } = require('../utils/jwt');

const authenticateToken = (req, res, next) => {
  try {
    const token = extractToken(req.headers.authorization);
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
};

/** Sets req.user when a valid Bearer token is present; never rejects (for public routes that redact data). */
const optionalAuthenticate = (req, res, next) => {
  const h = req.headers.authorization;
  if (!h || typeof h !== 'string' || !h.startsWith('Bearer ')) {
    return next();
  }
  const token = h.slice(7);
  if (!token) return next();
  try {
    req.user = verifyToken(token);
  } catch {
    // Invalid/expired token — treat as anonymous
  }
  next();
};

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    });
  }
};

module.exports = {
  authenticateToken,
  optionalAuthenticate,
  authorizeAdmin
};