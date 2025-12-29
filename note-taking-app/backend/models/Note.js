/**
 * Note Model
 * 
 * This model represents a note in the system.
 * Notes are created by users and can be:
 * - Tagged with multiple tags
 * - Organized in notebooks
 * - Connected to other notes (self-referencing relationship)
 * - Have comments and attachments
 */

const mongoose = require('mongoose');

// Define the Note schema
const noteSchema = new mongoose.Schema({
  // Primary key: unique identifier
  note_id: {
    type: String,
    required: true,
    unique: true
  },
  
  // UID: User ID of the creator (references User)
  UID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Note title
  title: {
    type: String,
    required: true,
    trim: true
  },
  
  // Note content (can be rich text or markdown)
  content: {
    type: String,
    default: ''
  },
  
  // Type of note (e.g., 'text', 'markdown', 'todo', etc.)
  type: {
    type: String,
    default: 'text',
    enum: ['text', 'markdown', 'todo', 'code']
  },
  
  // Creation time (automatically set)
  creation_time: {
    type: Date,
    default: Date.now
  },
  
  // Tags: Many-to-many relationship (array of tag references)
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  
  // Notebooks: Many-to-many relationship (a note can be in multiple notebooks)
  notebooks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notebook'
  }],
  
  // Self-referencing: Notes can be connected to other notes
  // This creates a link/connection between notes
  connected_notes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note'
  }],
  
  // Attachments: One-to-many relationship
  attachments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attachment'
  }],
  
  // Comments: One-to-many relationship
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  
  // View type and posted time (from USER - posts - NOTE relationship)
  view_type: {
    type: String,
    enum: ['public', 'private', 'shared'],
    default: 'private'
  },
  
  posted_time: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Create and export the Note model
const Note = mongoose.model('Note', noteSchema);

module.exports = Note;

