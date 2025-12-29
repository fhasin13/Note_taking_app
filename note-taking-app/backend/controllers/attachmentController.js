/**
 * Attachment Controller
 */

const Attachment = require('../models/Attachment');
const Note = require('../models/Note');
const Comment = require('../models/Comment');
const Group = require('../models/Group');

/**
 * Create an attachment
 * POST /api/attachments
 */
const createAttachment = async (req, res) => {
  try {
    const { parent_type, parent_id, file_name, file_type, URL, file_size } = req.body;
    
    if (!parent_type || !parent_id || !file_name || !file_type || !URL) {
      return res.status(400).json({ 
        message: 'parent_type, parent_id, file_name, file_type, and URL are required' 
      });
    }
    
    // Verify parent exists
    let parent;
    if (parent_type === 'Note') {
      parent = await Note.findById(parent_id);
    } else if (parent_type === 'Comment') {
      parent = await Comment.findById(parent_id);
    } else if (parent_type === 'Group') {
      parent = await Group.findById(parent_id);
    }
    
    if (!parent) {
      return res.status(404).json({ 
        message: `${parent_type} not found` 
      });
    }
    
    // Generate unique attachment_ID
    const attachment_ID = `ATTACH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const attachment = new Attachment({
      attachment_ID,
      parent_type,
      parent_id,
      file_name,
      file_type,
      URL,
      file_size: file_size || 0
    });
    
    await attachment.save();
    
    // Add attachment to parent
    parent.attachments = parent.attachments || [];
    parent.attachments.push(attachment._id);
    await parent.save();
    
    res.status(201).json({
      message: 'Attachment created successfully',
      attachment
    });
    
  } catch (error) {
    console.error('Create attachment error:', error);
    res.status(500).json({ 
      message: 'Error creating attachment',
      error: error.message 
    });
  }
};

/**
 * Get attachments
 * GET /api/attachments?parent_type=...&parent_id=...
 */
const getAttachments = async (req, res) => {
  try {
    const { parent_type, parent_id } = req.query;
    
    let query = {};
    if (parent_type) query.parent_type = parent_type;
    if (parent_id) query.parent_id = parent_id;
    
    const attachments = await Attachment.find(query)
      .sort({ createdAt: -1 });
    
    res.json({
      message: 'Attachments retrieved successfully',
      count: attachments.length,
      attachments
    });
    
  } catch (error) {
    console.error('Get attachments error:', error);
    res.status(500).json({ 
      message: 'Error fetching attachments',
      error: error.message 
    });
  }
};

/**
 * Delete an attachment
 * DELETE /api/attachments/:id
 */
const deleteAttachment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const attachment = await Attachment.findById(id);
    
    if (!attachment) {
      return res.status(404).json({ 
        message: 'Attachment not found' 
      });
    }
    
    // Remove from parent
    let parent;
    if (attachment.parent_type === 'Note') {
      parent = await Note.findById(attachment.parent_id);
    } else if (attachment.parent_type === 'Comment') {
      parent = await Comment.findById(attachment.parent_id);
    } else if (attachment.parent_type === 'Group') {
      parent = await Group.findById(attachment.parent_id);
    }
    
    if (parent) {
      parent.attachments = parent.attachments.filter(
        attId => attId.toString() !== id
      );
      await parent.save();
    }
    
    await Attachment.findByIdAndDelete(id);
    
    res.json({
      message: 'Attachment deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete attachment error:', error);
    res.status(500).json({ 
      message: 'Error deleting attachment',
      error: error.message 
    });
  }
};

module.exports = {
  createAttachment,
  getAttachments,
  deleteAttachment
};

