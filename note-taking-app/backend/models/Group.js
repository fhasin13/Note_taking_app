/**
 * Group Model
 * 
 * This is a WEAK ENTITY (as per ER diagram).
 * Groups are formed by Lead Editors and can have:
 * - Multiple members (users)
 * - Access to notebooks
 * - Attachments
 */

const mongoose = require('mongoose');

// Define the Group schema
const groupSchema = new mongoose.Schema({
  // Partial key: group_id (weak entity identifier)
  group_id: {
    type: String,
    required: true
  },
  
  // Group name
  group_name: {
    type: String,
    required: true,
    trim: true
  },
  
  // Lead Editor who formed this group (identifying relationship)
  lead_editor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Members of the group (users who belong to this group)
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Notebooks this group has access to
  accessible_notebooks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notebook'
  }],
  
  // Attachments linked to this group
  attachments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attachment'
  }]
}, {
  timestamps: true
});

// Compound index to ensure uniqueness of group_id per lead_editor
// This makes group_id a partial key (unique within a lead editor's groups)
groupSchema.index({ group_id: 1, lead_editor: 1 }, { unique: true });

// Create and export the Group model
const Group = mongoose.model('Group', groupSchema);

module.exports = Group;

