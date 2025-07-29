const jwt = require('jsonwebtoken');
const userService = require('../services/UserService');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    console.log('No token found in request headers');
    return res.status(401).json({
      success: false,
      error: 'Non autorisé à accéder à cette ressource'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    req.user = await userService.getUserById(decoded.id);
    console.log('User fetched by ID:', req.user);

    next();
  } catch (err) {
    console.log('Token verification failed:', err.message);
    return res.status(401).json({
      success: false,
      error: 'Non autorisé à accéder à cette ressource'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Le rôle ${req.user.role} n'est pas autorisé à accéder à cette ressource`
      });
    }
    next();
  };
};