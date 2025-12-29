/**
 * Tag Model
 * 
 * This model represents a tag.
 * Tags have a many-to-many relationship with notes.
 * Multiple notes can have the same tag, and a note can have multiple tags.
 */

const mongoose = require('mongoose');

// Define the Tag schema
const tagSchema = new mongoose.Schema({
  // Primary key: unique identifier
  tag_id: {
    type: String,
    required: true,
    unique: true
  },
  
  // Tag name (e.g., "Important", "Work", "Personal")
  tag_name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true // Store in lowercase for consistency
  },
  
  // Notes that have this tag (for easy querying)
  notes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note'
  }]
}, {
  timestamps: true
});

// Create and export the Tag model
const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;

