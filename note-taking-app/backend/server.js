/**
 * Main Server File
 * 
 * This file sets up and starts the Express server.
 * It connects to MongoDB and sets up all the API routes.
 */

// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import route handlers
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const noteRoutes = require('./routes/notes');
const notebookRoutes = require('./routes/notebooks');
const tagRoutes = require('./routes/tags');
const commentRoutes = require('./routes/comments');
const attachmentRoutes = require('./routes/attachments');
const groupRoutes = require('./routes/groups');

// Create Express app
const app = express();

// Middleware setup
// CORS allows frontend (running on different port) to communicate with backend
app.use(cors());

// Parse JSON request bodies (so we can read data from POST/PUT requests)
app.use(express.json());

// Parse URL-encoded data (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/note-taking-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1); // Exit the process if database connection fails
  });

// API Routes
// All routes are prefixed with /api
app.use('/api/auth', authRoutes);        // Authentication routes (login, signup)
app.use('/api/users', userRoutes);       // User management routes
app.use('/api/notes', noteRoutes);       // Note CRUD operations
app.use('/api/notebooks', notebookRoutes); // Notebook operations
app.use('/api/tags', tagRoutes);         // Tag operations
app.use('/api/comments', commentRoutes); // Comment operations
app.use('/api/attachments', attachmentRoutes); // Attachment operations
app.use('/api/groups', groupRoutes);     // Group management routes

// Health check route (to test if server is running)
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!', status: 'ok' });
});

// Error handling middleware
// This catches any errors that occur in routes
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}/api`);
});

