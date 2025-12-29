/**
 * Attachment Model
 * 
 * This is a WEAK ENTITY (as per ER diagram).
 * Attachments can belong to:
 * - Notes (identifying relationship)
 * - Comments (identifying relationship)
 * - Groups (identifying relationship)
 * 
 * The attachment_id is a partial key, unique within its parent entity.
 */

const mongoose = require('mongoose');

// Define the Attachment schema
const attachmentSchema = new mongoose.Schema({
  // Partial key: attachment_id (weak entity identifier)
  attachment_ID: {
    type: String,
    required: true
  },
  
  // File name
  file_name: {
    type: String,
    required: true,
    trim: true
  },
  
  // File type (e.g., 'image/png', 'application/pdf', etc.)
  file_type: {
    type: String,
    required: true
  },
  
  // URL where the file is stored (could be local path or cloud storage URL)
  URL: {
    type: String,
    required: true
  },
  
  // Parent entity: Can be a Note, Comment, or Group
  // We use a polymorphic reference pattern
  parent_type: {
    type: String,
    enum: ['Note', 'Comment', 'Group'],
    required: true
  },
  
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'parent_type'
  },
  
  // File size in bytes (optional but useful)
  file_size: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound index to ensure uniqueness of attachment_ID per parent
// This makes attachment_ID a partial key
attachmentSchema.index({ attachment_ID: 1, parent_type: 1, parent_id: 1 }, { unique: true });

// Create and export the Attachment model
const Attachment = mongoose.model('Attachment', attachmentSchema);

module.exports = Attachment;

