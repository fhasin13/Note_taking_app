/**
 * Comment Model
 * 
 * This is a WEAK ENTITY (as per ER diagram).
 * A comment depends on both a User (who wrote it) and a Note (where it's posted).
 * Comments can also have attachments.
 */

const mongoose = require('mongoose');

// Define the Comment schema
const commentSchema = new mongoose.Schema({
  // Partial key: comment_id (weak entity identifier)
  comment_id: {
    type: String,
    required: true
  },
  
  // User who wrote the comment (identifying relationship)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Note this comment belongs to (identifying relationship)
  note: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note',
    required: true
  },
  
  // Comment text content
  comment_text: {
    type: String,
    required: true,
    trim: true
  },
  
  // Time when comment was posted
  comment_time: {
    type: Date,
    default: Date.now
  },
  
  // Attachments linked to this comment
  attachments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attachment'
  }]
}, {
  timestamps: true
});

// Compound index to ensure uniqueness of comment_id per note
// This makes comment_id a partial key (unique within a note)
commentSchema.index({ comment_id: 1, note: 1 }, { unique: true });

// Create and export the Comment model
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;

