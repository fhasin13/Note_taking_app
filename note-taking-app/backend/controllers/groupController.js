/**
 * Group Controller
 * 
 * Handles group management operations.
 * Groups can only be created by Lead Editors.
 */

const Group = require('../models/Group');
const User = require('../models/User');
const Notebook = require('../models/Notebook');

/**
 * Create a new group
 * POST /api/groups
 * 
 * Access: Lead Editor, Admin
 */
const createGroup = async (req, res) => {
  try {
    const { group_name, member_ids, notebook_ids } = req.body;
    const userId = req.userId;
    const userRoles = req.user.roles || [];
    
    // Check permission: Only Lead Editor or Admin can create groups
    if (!userRoles.includes('Lead Editor') && !userRoles.includes('Admin')) {
      return res.status(403).json({ 
        message: 'Only Lead Editors and Admins can create groups' 
      });
    }
    
    if (!group_name) {
      return res.status(400).json({ 
        message: 'group_name is required' 
      });
    }
    
    // Generate unique group_id
    const group_id = `GROUP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create group
    const group = new Group({
      group_id,
      group_name,
      lead_editor: userId,
      members: member_ids || [],
      accessible_notebooks: notebook_ids || []
    });
    
    await group.save();
    
    // Update notebooks to include this group
    if (notebook_ids && notebook_ids.length > 0) {
      await Notebook.updateMany(
        { _id: { $in: notebook_ids } },
        { $addToSet: { accessible_groups: group._id } }
      );
    }
    
    await group.populate('lead_editor members accessible_notebooks');
    
    res.status(201).json({
      message: 'Group created successfully',
      group
    });
    
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ 
      message: 'Error creating group',
      error: error.message 
    });
  }
};

/**
 * Get all groups
 * GET /api/groups
 */
const getGroups = async (req, res) => {
  try {
    const userId = req.userId;
    const userRoles = req.user.roles || [];
    
    let query = {};
    
    // If not admin or lead editor, only show groups user is a member of
    if (!userRoles.includes('Admin') && !userRoles.includes('Lead Editor')) {
      query.$or = [
        { members: userId },
        { lead_editor: userId }
      ];
    }
    
    const groups = await Group.find(query)
      .populate('lead_editor', 'user_name first_name last_name')
      .populate('members', 'user_name first_name last_name')
      .populate('accessible_notebooks', 'notebook_name notebook_ID')
      .sort({ createdAt: -1 });
    
    res.json({
      message: 'Groups retrieved successfully',
      count: groups.length,
      groups
    });
    
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({ 
      message: 'Error fetching groups',
      error: error.message 
    });
  }
};

/**
 * Get single group by ID
 * GET /api/groups/:id
 */
const getGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const group = await Group.findById(id)
      .populate('lead_editor', 'user_name first_name last_name')
      .populate('members', 'user_name first_name last_name')
      .populate('accessible_notebooks', 'notebook_name notebook_ID')
      .populate('attachments');
    
    if (!group) {
      return res.status(404).json({ 
        message: 'Group not found' 
      });
    }
    
    res.json({
      message: 'Group retrieved successfully',
      group
    });
    
  } catch (error) {
    console.error('Get group error:', error);
    res.status(500).json({ 
      message: 'Error fetching group',
      error: error.message 
    });
  }
};

/**
 * Update group
 * PUT /api/groups/:id
 * 
 * Access: Lead Editor (who created it), Admin
 */
const updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { group_name, member_ids, notebook_ids } = req.body;
    const userId = req.userId;
    const userRoles = req.user.roles || [];
    
    const group = await Group.findById(id);
    
    if (!group) {
      return res.status(404).json({ 
        message: 'Group not found' 
      });
    }
    
    // Check permission
    const canEdit = userRoles.includes('Admin') || 
                    (userRoles.includes('Lead Editor') && 
                     group.lead_editor.toString() === userId.toString());
    
    if (!canEdit) {
      return res.status(403).json({ 
        message: 'You do not have permission to edit this group' 
      });
    }
    
    // Update fields
    if (group_name !== undefined) group.group_name = group_name;
    if (member_ids !== undefined) group.members = member_ids;
    if (notebook_ids !== undefined) {
      // Update notebooks
      group.accessible_notebooks = notebook_ids;
      
      // Update notebook accessible_groups
      await Notebook.updateMany(
        { accessible_groups: id },
        { $pull: { accessible_groups: id } }
      );
      
      if (notebook_ids.length > 0) {
        await Notebook.updateMany(
          { _id: { $in: notebook_ids } },
          { $addToSet: { accessible_groups: id } }
        );
      }
    }
    
    await group.save();
    await group.populate('lead_editor members accessible_notebooks');
    
    res.json({
      message: 'Group updated successfully',
      group
    });
    
  } catch (error) {
    console.error('Update group error:', error);
    res.status(500).json({ 
      message: 'Error updating group',
      error: error.message 
    });
  }
};

/**
 * Delete group
 * DELETE /api/groups/:id
 * 
 * Access: Lead Editor (who created it), Admin
 */
const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const userRoles = req.user.roles || [];
    
    const group = await Group.findById(id);
    
    if (!group) {
      return res.status(404).json({ 
        message: 'Group not found' 
      });
    }
    
    // Check permission
    const canDelete = userRoles.includes('Admin') || 
                     (userRoles.includes('Lead Editor') && 
                      group.lead_editor.toString() === userId.toString());
    
    if (!canDelete) {
      return res.status(403).json({ 
        message: 'You do not have permission to delete this group' 
      });
    }
    
    // Remove group from notebooks
    await Notebook.updateMany(
      { accessible_groups: id },
      { $pull: { accessible_groups: id } }
    );
    
    await Group.findByIdAndDelete(id);
    
    res.json({
      message: 'Group deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete group error:', error);
    res.status(500).json({ 
      message: 'Error deleting group',
      error: error.message 
    });
  }
};

/**
 * Add member to group
 * POST /api/groups/:id/members
 */
const addMemberToGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;
    
    if (!user_id) {
      return res.status(400).json({ 
        message: 'user_id is required' 
      });
    }
    
    const group = await Group.findById(id);
    const user = await User.findById(user_id);
    
    if (!group || !user) {
      return res.status(404).json({ 
        message: 'Group or user not found' 
      });
    }
    
    // Check permission
    const userId = req.userId;
    const userRoles = req.user.roles || [];
    const canEdit = userRoles.includes('Admin') || 
                    (userRoles.includes('Lead Editor') && 
                     group.lead_editor.toString() === userId.toString());
    
    if (!canEdit) {
      return res.status(403).json({ 
        message: 'You do not have permission to modify this group' 
      });
    }
    
    // Add member if not already present
    if (!group.members.includes(user_id)) {
      group.members.push(user_id);
      await group.save();
    }
    
    await group.populate('members');
    
    res.json({
      message: 'Member added to group successfully',
      group
    });
    
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ 
      message: 'Error adding member',
      error: error.message 
    });
  }
};

module.exports = {
  createGroup,
  getGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  addMemberToGroup
};

