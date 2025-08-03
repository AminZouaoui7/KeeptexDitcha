const jwt = require('jsonwebtoken');
const userService = require('../services/UserService');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  console.log('=== Auth Middleware ===');
  console.log('Headers:', JSON.stringify(req.headers));
  console.log('JWT_SECRET:', process.env.JWT_SECRET);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
    console.log('Token extracted from Authorization header:', token);
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
    console.log('Attempting to verify token with JWT_SECRET:', process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    console.log('Fetching user with ID:', decoded.id);
    req.user = await userService.getUserById(decoded.id);
    console.log('User fetched by ID:', req.user);

    if (!req.user) {
      console.log('User not found with ID:', decoded.id);
      return res.status(401).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    next();
  } catch (err) {
    console.log('Token verification failed:', err.message);
    console.log('Error details:', err);
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