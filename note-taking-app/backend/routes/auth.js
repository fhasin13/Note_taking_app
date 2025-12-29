/**
 * Authentication Routes
 * 
 * Defines all routes related to user authentication.
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// POST /api/auth/signup - Create new user account
router.post('/signup', authController.signup);

// POST /api/auth/login - Login existing user
router.post('/login', authController.login);

// GET /api/auth/me - Get current user info (requires authentication)
router.get('/me', authenticate, authController.getCurrentUser);

module.exports = router;

