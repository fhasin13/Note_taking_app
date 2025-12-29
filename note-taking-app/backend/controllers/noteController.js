/**
 * Note Controller
 * 
 * Handles all operations related to notes:
 * - Create, read, update, delete notes
 * - Add tags, attachments, comments
 * - Connect notes to notebooks
 */

const Note = require('../models/Note');
const Tag = require('../models/Tag');
const Notebook = require('../models/Notebook');
const Comment = require('../models/Comment');
const Attachment = require('../models/Attachment');
const { authorize } = require('../middleware/auth');

/**
 * Create a new note
 * POST /api/notes
 * 
 * Access: Editor, Contributor, Lead Editor, Admin
 */
const createNote = async (req, res) => {
  try {
    const { title, content, type, tags, notebook_ids, connected_note_ids } = req.body;
    const userId = req.userId;
    
    // Validate required fields
    if (!title) {
      return res.status(400).json({ 
        message: 'Note title is required' 
      });
    }
    
    // Generate unique note_id
    const note_id = `NOTE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create new note
    const note = new Note({
      note_id,
      UID: userId,
      title,
      content: content || '',
      type: type || 'text',
      tags: tags || [],
      notebooks: notebook_ids || [],
      connected_notes: connected_note_ids || []
    });
    
    // Save note
    await note.save();
    
    // Populate related data for response
    await note.populate('tags notebooks UID');
    
    res.status(201).json({
      message: 'Note created successfully',
      note
    });
    
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ 
      message: 'Error creating note',
      error: error.message 
    });
  }
};

/**
 * Get all notes (with filters)
 * GET /api/notes
 * 
 * Query parameters:
 * - notebook_id: Filter by notebook
 * - tag_id: Filter by tag
 * - user_id: Filter by creator
 */
const getNotes = async (req, res) => {
  try {
    const { notebook_id, tag_id, user_id } = req.query;
    const userId = req.userId;
    const userRoles = req.user.roles || [];
    
    // Build query
    let query = {};
    
    // If not admin, only show user's own notes or shared notes
    if (!userRoles.includes('Admin')) {
      query.$or = [
        { UID: userId },
        { view_type: 'public' },
        { view_type: 'shared' }
      ];
    }
    
    // Apply filters
    if (notebook_id) {
      query.notebooks = notebook_id;
    }
    if (tag_id) {
      query.tags = tag_id;
    }
    if (user_id && userRoles.includes('Admin')) {
      query.UID = user_id;
    }
    
    // Find notes
    const notes = await Note.find(query)
      .populate('UID', 'user_name first_name last_name')
      .populate('tags', 'tag_name')
      .populate('notebooks', 'notebook_name')
      .populate('connected_notes', 'title note_id')
      .sort({ creation_time: -1 }); // Newest first
    
    res.json({
      message: 'Notes retrieved successfully',
      count: notes.length,
      notes
    });
    
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ 
      message: 'Error fetching notes',
      error: error.message 
    });
  }
};

/**
 * Get a single note by ID
 * GET /api/notes/:id
 */
const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const userRoles = req.user.roles || [];
    
    // Find note
    const note = await Note.findById(id)
      .populate('UID', 'user_name first_name last_name')
      .populate('tags', 'tag_name')
      .populate('notebooks', 'notebook_name')
      .populate('connected_notes', 'title note_id')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'user_name first_name last_name'
        }
      })
      .populate('attachments');
    
    if (!note) {
      return res.status(404).json({ 
        message: 'Note not found' 
      });
    }
    
    // Check access permission
    if (!userRoles.includes('Admin') && 
        note.UID._id.toString() !== userId.toString() && 
        note.view_type === 'private') {
      return res.status(403).json({ 
        message: 'Access denied to this note' 
      });
    }
    
    res.json({
      message: 'Note retrieved successfully',
      note
    });
    
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ 
      message: 'Error fetching note',
      error: error.message 
    });
  }
};

/**
 * Update a note
 * PUT /api/notes/:id
 * 
 * Access: Editor, Lead Editor, Admin (or note owner)
 */
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const userRoles = req.user.roles || [];
    const { title, content, type, tags, notebook_ids, view_type } = req.body;
    
    // Find note
    const note = await Note.findById(id);
    
    if (!note) {
      return res.status(404).json({ 
        message: 'Note not found' 
      });
    }
    
    // Check permission: Only owner, Editor, Lead Editor, or Admin can edit
    const canEdit = userRoles.includes('Admin') || 
                    userRoles.includes('Editor') || 
                    userRoles.includes('Lead Editor') ||
                    note.UID.toString() === userId.toString();
    
    if (!canEdit) {
      return res.status(403).json({ 
        message: 'You do not have permission to edit this note' 
      });
    }
    
    // Update fields
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (type !== undefined) note.type = type;
    if (tags !== undefined) note.tags = tags;
    if (notebook_ids !== undefined) note.notebooks = notebook_ids;
    if (view_type !== undefined) note.view_type = view_type;
    
    // Save changes
    await note.save();
    
    // Populate for response
    await note.populate('tags notebooks UID');
    
    res.json({
      message: 'Note updated successfully',
      note
    });
    
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ 
      message: 'Error updating note',
      error: error.message 
    });
  }
};

/**
 * Delete a note
 * DELETE /api/notes/:id
 * 
 * Access: Editor, Lead Editor, Admin (or note owner)
 */
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const userRoles = req.user.roles || [];
    
    // Find note
    const note = await Note.findById(id);
    
    if (!note) {
      return res.status(404).json({ 
        message: 'Note not found' 
      });
    }
    
    // Check permission
    const canDelete = userRoles.includes('Admin') || 
                     userRoles.includes('Editor') || 
                     userRoles.includes('Lead Editor') ||
                     note.UID.toString() === userId.toString();
    
    if (!canDelete) {
      return res.status(403).json({ 
        message: 'You do not have permission to delete this note' 
      });
    }
    
    // Delete associated comments and attachments
    await Comment.deleteMany({ note: id });
    await Attachment.deleteMany({ parent_type: 'Note', parent_id: id });
    
    // Delete note
    await Note.findByIdAndDelete(id);
    
    res.json({
      message: 'Note deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ 
      message: 'Error deleting note',
      error: error.message 
    });
  }
};

/**
 * Add tag to note
 * POST /api/notes/:id/tags
 */
const addTagToNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { tag_id } = req.body;
    
    if (!tag_id) {
      return res.status(400).json({ 
        message: 'tag_id is required' 
      });
    }
    
    // Find note and tag
    const note = await Note.findById(id);
    const tag = await Tag.findById(tag_id);
    
    if (!note || !tag) {
      return res.status(404).json({ 
        message: 'Note or tag not found' 
      });
    }
    
    // Add tag if not already present
    if (!note.tags.includes(tag_id)) {
      note.tags.push(tag_id);
      await note.save();
      
      // Add note to tag's notes array
      if (!tag.notes.includes(id)) {
        tag.notes.push(id);
        await tag.save();
      }
    }
    
    await note.populate('tags');
    
    res.json({
      message: 'Tag added to note successfully',
      note
    });
    
  } catch (error) {
    console.error('Add tag error:', error);
    res.status(500).json({ 
      message: 'Error adding tag',
      error: error.message 
    });
  }
};

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  addTagToNote
};

