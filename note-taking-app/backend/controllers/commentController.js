/**
 * Comment Controller
 */

const Comment = require('../models/Comment');
const Note = require('../models/Note');

/**
 * Create a comment on a note
 * POST /api/comments
 */
const createComment = async (req, res) => {
  try {
    const { note_id, comment_text } = req.body;
    const userId = req.userId;
    
    if (!note_id || !comment_text) {
      return res.status(400).json({ 
        message: 'note_id and comment_text are required' 
      });
    }
    
    // Verify note exists
    const note = await Note.findById(note_id);
    if (!note) {
      return res.status(404).json({ 
        message: 'Note not found' 
      });
    }
    
    // Generate unique comment_id
    const comment_id = `COMMENT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create comment
    const comment = new Comment({
      comment_id,
      user: userId,
      note: note_id,
      comment_text
    });
    
    await comment.save();
    
    // Add comment to note
    note.comments.push(comment._id);
    await note.save();
    
    await comment.populate('user', 'user_name first_name last_name');
    
    res.status(201).json({
      message: 'Comment created successfully',
      comment
    });
    
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ 
      message: 'Error creating comment',
      error: error.message 
    });
  }
};

/**
 * Get comments for a note
 * GET /api/comments?note_id=...
 */
const getComments = async (req, res) => {
  try {
    const { note_id } = req.query;
    
    let query = {};
    if (note_id) {
      query.note = note_id;
    }
    
    const comments = await Comment.find(query)
      .populate('user', 'user_name first_name last_name')
      .populate('note', 'title')
      .sort({ comment_time: -1 });
    
    res.json({
      message: 'Comments retrieved successfully',
      count: comments.length,
      comments
    });
    
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ 
      message: 'Error fetching comments',
      error: error.message 
    });
  }
};

/**
 * Delete a comment
 * DELETE /api/comments/:id
 */
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const userRoles = req.user.roles || [];
    
    const comment = await Comment.findById(id);
    
    if (!comment) {
      return res.status(404).json({ 
        message: 'Comment not found' 
      });
    }
    
    // Check permission: Only owner, Editor, Lead Editor, or Admin can delete
    const canDelete = userRoles.includes('Admin') || 
                     userRoles.includes('Editor') || 
                     userRoles.includes('Lead Editor') ||
                     comment.user.toString() === userId.toString();
    
    if (!canDelete) {
      return res.status(403).json({ 
        message: 'You do not have permission to delete this comment' 
      });
    }
    
    // Remove comment from note
    await Note.findByIdAndUpdate(comment.note, {
      $pull: { comments: id }
    });
    
    await Comment.findByIdAndDelete(id);
    
    res.json({
      message: 'Comment deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ 
      message: 'Error deleting comment',
      error: error.message 
    });
  }
};

module.exports = {
  createComment,
  getComments,
  deleteComment
};

