/**
 * Authentication Middleware
 * 
 * This middleware verifies JWT tokens and attaches user information to requests.
 * It's used to protect routes that require authentication.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to verify JWT token
 * 
 * How it works:
 * 1. Extract token from request headers
 * 2. Verify token using JWT_SECRET
 * 3. Find user in database
 * 4. Attach user info to request object
 * 5. Call next() to continue to the route handler
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    // Format: "Bearer <token>"
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'No token provided. Please login first.' 
      });
    }
    
    // Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7);
    
    // Verify token and decode user information
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production');
    
    // Find user in database
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ 
        message: 'User not found. Token is invalid.' 
      });
    }
    
    // Attach user info to request object
    // Now route handlers can access req.user
    req.user = user;
    req.userId = user._id;
    
    // Continue to the next middleware or route handler
    next();
    
  } catch (error) {
    // Token is invalid or expired
    return res.status(401).json({ 
      message: 'Invalid or expired token. Please login again.' 
    });
  }
};

/**
 * Authorization Middleware
 * 
 * Checks if user has required role(s) to access a route.
 * 
 * @param {Array} allowedRoles - Array of roles that can access this route
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Authentication required.' 
      });
    }
    
    // Get user's roles
    const userRoles = req.user.roles || [];
    
    // Check if user has at least one of the allowed roles
    const hasPermission = allowedRoles.some(role => userRoles.includes(role));
    
    if (!hasPermission) {
      return res.status(403).json({ 
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}` 
      });
    }
    
    // User has permission, continue
    next();
  };
};

module.exports = {
  authenticate,
  authorize
};

