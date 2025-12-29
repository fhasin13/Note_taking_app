/**
 * Notebook Model
 * 
 * This model represents a notebook (container for notes).
 * Notebooks can be nested (parent-child relationship).
 * A notebook can contain multiple notes.
 */

const mongoose = require('mongoose');

// Define the Notebook schema
const notebookSchema = new mongoose.Schema({
  // Primary key: unique identifier
  notebook_ID: {
    type: String,
    required: true,
    unique: true
  },
  
  // Notebook name
  notebook_name: {
    type: String,
    required: true,
    trim: true
  },
  
  // Self-referencing: Parent notebook (for nested notebooks)
  // If null, this is a top-level notebook
  parent_notebook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notebook',
    default: null
  },
  
  // Owner: User who created this notebook
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Notes contained in this notebook
  notes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note'
  }],
  
  // Groups that have access to this notebook
  accessible_groups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  }]
}, {
  timestamps: true
});

// Create and export the Notebook model
const Notebook = mongoose.model('Notebook', notebookSchema);

module.exports = Notebook;

