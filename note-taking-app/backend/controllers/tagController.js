/**
 * Tag Controller
 */

const Tag = require('../models/Tag');
const Note = require('../models/Note');

/**
 * Create a new tag
 * POST /api/tags
 */
const createTag = async (req, res) => {
  try {
    const { tag_name } = req.body;
    
    if (!tag_name) {
      return res.status(400).json({ 
        message: 'tag_name is required' 
      });
    }
    
    // Check if tag already exists
    const existingTag = await Tag.findOne({ 
      tag_name: tag_name.toLowerCase() 
    });
    
    if (existingTag) {
      return res.status(400).json({ 
        message: 'Tag already exists' 
      });
    }
    
    // Generate unique tag_id
    const tag_id = `TAG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const tag = new Tag({
      tag_id,
      tag_name: tag_name.toLowerCase()
    });
    
    await tag.save();
    
    res.status(201).json({
      message: 'Tag created successfully',
      tag
    });
    
  } catch (error) {
    console.error('Create tag error:', error);
    res.status(500).json({ 
      message: 'Error creating tag',
      error: error.message 
    });
  }
};

/**
 * Get all tags
 * GET /api/tags
 */
const getTags = async (req, res) => {
  try {
    const tags = await Tag.find()
      .populate('notes', 'title note_id')
      .sort({ tag_name: 1 });
    
    res.json({
      message: 'Tags retrieved successfully',
      count: tags.length,
      tags
    });
    
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ 
      message: 'Error fetching tags',
      error: error.message 
    });
  }
};

/**
 * Delete a tag
 * DELETE /api/tags/:id
 */
const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    
    const tag = await Tag.findById(id);
    
    if (!tag) {
      return res.status(404).json({ 
        message: 'Tag not found' 
      });
    }
    
    // Remove tag from all notes
    await Note.updateMany(
      { tags: id },
      { $pull: { tags: id } }
    );
    
    await Tag.findByIdAndDelete(id);
    
    res.json({
      message: 'Tag deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete tag error:', error);
    res.status(500).json({ 
      message: 'Error deleting tag',
      error: error.message 
    });
  }
};

module.exports = {
  createTag,
  getTags,
  deleteTag
};

