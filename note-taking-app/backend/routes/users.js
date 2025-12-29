/**
 * User Routes
 * 
 * Routes for user management (if needed beyond auth routes)
 */

const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const User = require('../models/User');

// All routes require authentication
router.use(authenticate);

/**
 * Get all users
 * GET /api/users
 * Access: Admin only
 */
router.get('/', authorize('Admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      message: 'Users retrieved successfully',
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching users',
      error: error.message 
    });
  }
});

/**
 * Get user by ID
 * GET /api/users/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching user',
      error: error.message 
    });
  }
});

module.exports = router;

