/**
 * Admin Model
 * 
 * This model represents an admin user.
 * Based on the ER diagram, Admin is a separate entity with its own attributes.
 * However, in our implementation, we'll use the User model with Admin role.
 * This file is kept for reference but Admin functionality is handled through User roles.
 */

// Note: In our implementation, Admin is handled through the User model's roles array.
// A user with 'Admin' role has full access to everything.
// This file is kept for documentation purposes.

const mongoose = require('mongoose');

// If you want a separate Admin model, you can use this:
const adminSchema = new mongoose.Schema({
  admin_id: {
    type: String,
    required: true,
    unique: true
  },
  admin_name: {
    first_name: String,
    last_name: String
  },
  admin_contact: {
    phone: [String],
    email: String
  },
  // Reference to User
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;

