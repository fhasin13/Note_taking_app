/**
 * User Model
 * 
 * This model represents a user in the system.
 * Based on the ER diagram, a user can have multiple roles:
 * - Admin: Full access to everything
 * - Lead Editor: Can manage groups and notebooks
 * - Editor: Can create and edit notes
 * - Contributor: Can only add notes and comments
 * 
 * A user can have multiple roles (overlapping specialization from ER diagram).
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User schema (structure of user data in database)
const userSchema = new mongoose.Schema({
  // Primary key: unique identifier for each user
  user_id: {
    type: String,
    required: true,
    unique: true
  },
  
  // Username for login
  user_name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  
  // Composite attribute: name (first_name + last_name)
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  },
  
  // Contact information (composite attribute from ER diagram)
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  
  // Phone can be multivalued (array) as per ER diagram
  phone: [{
    type: String,
    trim: true
  }],
  
  // Additional field for institution
  institution: {
    type: String,
    trim: true
  },
  
  // Password (hashed, never stored in plain text)
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  
  // Roles: User can have multiple roles (overlapping specialization)
  // This is an array because a user can be both Editor and Contributor
  roles: [{
    type: String,
    enum: ['Admin', 'Lead Editor', 'Editor', 'Contributor'],
    default: 'Contributor'
  }],
  
  // Timestamps: automatically track when user was created/updated
}, {
  timestamps: true
});

// Before saving user, hash the password
// This runs automatically before saving to database
userSchema.pre('save', async function(next) {
  // Only hash password if it's new or has been modified
  if (!this.isModified('password')) {
    return next();
  }
  
  // Hash password with bcrypt (10 rounds of salting)
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare password during login
// This allows us to check if provided password matches stored hash
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get user's full name
userSchema.methods.getFullName = function() {
  return `${this.first_name} ${this.last_name}`;
};

// Create and export the User model
// This makes it available for use in other files
const User = mongoose.model('User', userSchema);

module.exports = User;

