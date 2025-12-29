/**
 * Notebook Controller
 * 
 * Handles all operations related to notebooks.
 */

const Notebook = require('../models/Notebook');
const Note = require('../models/Note');

/**
 * Create a new notebook
 * POST /api/notebooks
 */
const createNotebook = async (req, res) => {
  try {
    const { notebook_name, parent_notebook_id } = req.body;
    const userId = req.userId;
    
    if (!notebook_name) {
      return res.status(400).json({ 
        message: 'Notebook name is required' 
      });
    }
    
    // Generate unique notebook_ID
    const notebook_ID = `NOTEBOOK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create notebook
    const notebook = new Notebook({
      notebook_ID,
      notebook_name,
      owner: userId,
      parent_notebook: parent_notebook_id || null
    });
    
    await notebook.save();
    
    await notebook.populate('owner parent_notebook');
    
    res.status(201).json({
      message: 'Notebook created successfully',
      notebook
    });
    
  } catch (error) {
    console.error('Create notebook error:', error);
    res.status(500).json({ 
      message: 'Error creating notebook',
      error: error.message 
    });
  }
};

/**
 * Get all notebooks
 * GET /api/notebooks
 */
const getNotebooks = async (req, res) => {
  try {
    const userId = req.userId;
    const userRoles = req.user.roles || [];
    
    let query = {};
    
    // If not admin, only show user's notebooks or accessible notebooks
    if (!userRoles.includes('Admin')) {
      query.$or = [
        { owner: userId },
        { accessible_groups: { $in: [] } } // Will be filtered by group membership
      ];
    }
    
    const notebooks = await Notebook.find(query)
      .populate('owner', 'user_name first_name last_name')
      .populate('parent_notebook', 'notebook_name notebook_ID')
      .populate('notes', 'title note_id')
      .sort({ createdAt: -1 });
    
    res.json({
      message: 'Notebooks retrieved successfully',
      count: notebooks.length,
      notebooks
    });
    
  } catch (error) {
    console.error('Get notebooks error:', error);
    res.status(500).json({ 
      message: 'Error fetching notebooks',
      error: error.message 
    });
  }
};

/**
 * Get single notebook by ID
 * GET /api/notebooks/:id
 */
const getNotebookById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notebook = await Notebook.findById(id)
      .populate('owner', 'user_name first_name last_name')
      .populate('parent_notebook', 'notebook_name notebook_ID')
      .populate({
        path: 'notes',
        populate: {
          path: 'UID tags',
          select: 'user_name first_name last_name tag_name'
        }
      });
    
    if (!notebook) {
      return res.status(404).json({ 
        message: 'Notebook not found' 
      });
    }
    
    res.json({
      message: 'Notebook retrieved successfully',
      notebook
    });
    
  } catch (error) {
    console.error('Get notebook error:', error);
    res.status(500).json({ 
      message: 'Error fetching notebook',
      error: error.message 
    });
  }
};

/**
 * Update notebook
 * PUT /api/notebooks/:id
 */
const updateNotebook = async (req, res) => {
  try {
    const { id } = req.params;
    const { notebook_name, parent_notebook_id } = req.body;
    const userId = req.userId;
    const userRoles = req.user.roles || [];
    
    const notebook = await Notebook.findById(id);
    
    if (!notebook) {
      return res.status(404).json({ 
        message: 'Notebook not found' 
      });
    }
    
    // Check permission
    const canEdit = userRoles.includes('Admin') || 
                    userRoles.includes('Lead Editor') ||
                    notebook.owner.toString() === userId.toString();
    
    if (!canEdit) {
      return res.status(403).json({ 
        message: 'You do not have permission to edit this notebook' 
      });
    }
    
    if (notebook_name !== undefined) notebook.notebook_name = notebook_name;
    if (parent_notebook_id !== undefined) notebook.parent_notebook = parent_notebook_id;
    
    await notebook.save();
    await notebook.populate('owner parent_notebook');
    
    res.json({
      message: 'Notebook updated successfully',
      notebook
    });
    
  } catch (error) {
    console.error('Update notebook error:', error);
    res.status(500).json({ 
      message: 'Error updating notebook',
      error: error.message 
    });
  }
};

/**
 * Delete notebook
 * DELETE /api/notebooks/:id
 */
const deleteNotebook = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const userRoles = req.user.roles || [];
    
    const notebook = await Notebook.findById(id);
    
    if (!notebook) {
      return res.status(404).json({ 
        message: 'Notebook not found' 
      });
    }
    
    // Check permission
    const canDelete = userRoles.includes('Admin') || 
                     userRoles.includes('Lead Editor') ||
                     notebook.owner.toString() === userId.toString();
    
    if (!canDelete) {
      return res.status(403).json({ 
        message: 'You do not have permission to delete this notebook' 
      });
    }
    
    // Remove notebook reference from notes
    await Note.updateMany(
      { notebooks: id },
      { $pull: { notebooks: id } }
    );
    
    await Notebook.findByIdAndDelete(id);
    
    res.json({
      message: 'Notebook deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete notebook error:', error);
    res.status(500).json({ 
      message: 'Error deleting notebook',
      error: error.message 
    });
  }
};

/**
 * Add note to notebook
 * POST /api/notebooks/:id/notes
 */
const addNoteToNotebook = async (req, res) => {
  try {
    const { id } = req.params; // notebook id
    const { note_id } = req.body;
    
    if (!note_id) {
      return res.status(400).json({ 
        message: 'note_id is required' 
      });
    }
    
    const notebook = await Notebook.findById(id);
    const note = await Note.findById(note_id);
    
    if (!notebook || !note) {
      return res.status(404).json({ 
        message: 'Notebook or note not found' 
      });
    }
    
    // Add note to notebook
    if (!notebook.notes.includes(note_id)) {
      notebook.notes.push(note_id);
      await notebook.save();
    }
    
    // Add notebook to note
    if (!note.notebooks.includes(id)) {
      note.notebooks.push(id);
      await note.save();
    }
    
    await notebook.populate('notes');
    
    res.json({
      message: 'Note added to notebook successfully',
      notebook
    });
    
  } catch (error) {
    console.error('Add note to notebook error:', error);
    res.status(500).json({ 
      message: 'Error adding note to notebook',
      error: error.message 
    });
  }
};

module.exports = {
  createNotebook,
  getNotebooks,
  getNotebookById,
  updateNotebook,
  deleteNotebook,
  addNoteToNotebook
};

