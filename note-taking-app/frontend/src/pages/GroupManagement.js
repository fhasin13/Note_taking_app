/**
 * Group Management Page Component
 * 
 * This page allows Lead Editors and Admins to:
 * - View all groups
 * - Create new groups
 * - Add members to groups
 * - Manage group access to notebooks
 */

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { 
  getGroups, 
  createGroup, 
  deleteGroup,
  getUsers,
  getNotebooks,
  addMemberToGroup
} from '../utils/api';
import './GroupManagement.css';

/**
 * GroupManagement Component
 * 
 * Props:
 * - user: Current user object
 * - onLogout: Function to call when user logs out
 */
function GroupManagement({ user, onLogout }) {
  // State to store groups, users, and notebooks
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [notebooks, setNotebooks] = useState([]);
  
  // State for creating new group
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [newGroup, setNewGroup] = useState({
    group_name: '',
    member_ids: [],
    notebook_ids: []
  });
  
  // State for loading and errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if user has permission to manage groups
  const canManageGroups = user?.roles?.includes('Admin') || user?.roles?.includes('Lead Editor');

  /**
   * Load Data
   * 
   * Fetches groups, users, and notebooks when component loads.
   */
  useEffect(() => {
    if (canManageGroups) {
      loadData();
    } else {
      setLoading(false);
    }
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Fetch groups, users, and notebooks in parallel
      const [groupsResponse, usersResponse, notebooksResponse] = await Promise.all([
        getGroups(),
        getUsers().catch(() => ({ users: [] })), // Users endpoint might require Admin
        getNotebooks()
      ]);
      
      setGroups(groupsResponse.groups || []);
      setUsers(usersResponse.users || []);
      setNotebooks(notebooksResponse.notebooks || []);
      
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error('Load data error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Create Group
   * 
   * Creates a new group with selected members and notebooks.
   */
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    
    if (!newGroup.group_name.trim()) {
      setError('Group name is required');
      return;
    }
    
    try {
      const response = await createGroup(newGroup);
      
      // Add new group to the list
      setGroups(prev => [response.group, ...prev]);
      
      // Reset form
      setNewGroup({
        group_name: '',
        member_ids: [],
        notebook_ids: []
      });
      setShowNewGroup(false);
      setError('');
      setSuccess('Group created successfully!');
      
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create group');
    }
  };

  /**
   * Handle Delete Group
   * 
   * Deletes a group after confirmation.
   */
  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm('Are you sure you want to delete this group?')) {
      return;
    }
    
    try {
      await deleteGroup(groupId);
      
      // Remove group from list
      setGroups(prev => prev.filter(g => g._id !== groupId));
      setSuccess('Group deleted successfully!');
      
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete group');
    }
  };

  /**
   * Toggle Member Selection
   * 
   * Adds or removes a user from the new group's member list.
   */
  const toggleMember = (userId) => {
    setNewGroup(prev => ({
      ...prev,
      member_ids: prev.member_ids.includes(userId)
        ? prev.member_ids.filter(id => id !== userId)
        : [...prev.member_ids, userId]
    }));
  };

  /**
   * Toggle Notebook Selection
   * 
   * Adds or removes a notebook from the new group's notebook list.
   */
  const toggleNotebook = (notebookId) => {
    setNewGroup(prev => ({
      ...prev,
      notebook_ids: prev.notebook_ids.includes(notebookId)
        ? prev.notebook_ids.filter(id => id !== notebookId)
        : [...prev.notebook_ids, notebookId]
    }));
  };

  // Show access denied if user doesn't have permission
  if (!canManageGroups) {
    return (
      <div>
        <Navbar user={user} onLogout={onLogout} />
        <div className="container">
          <div className="error">
            Access denied. Only Lead Editors and Admins can manage groups.
          </div>
        </div>
      </div>
    );
  }

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <div>
        <Navbar user={user} onLogout={onLogout} />
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  // Render the group management page
  return (
    <div className="group-management">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="container">
        <div className="page-header">
          <h1>Group Management</h1>
          <p>Create and manage groups for collaboration</p>
        </div>
        
        {/* Messages */}
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        
        {/* Create New Group Section */}
        <div className="card">
          <h2>Create New Group</h2>
          
          {!showNewGroup ? (
            <button 
              className="btn btn-primary"
              onClick={() => setShowNewGroup(true)}
            >
              + Create New Group
            </button>
          ) : (
            <form onSubmit={handleCreateGroup}>
              {/* Group Name */}
              <div className="form-group">
                <label>Group Name</label>
                <input
                  type="text"
                  value={newGroup.group_name}
                  onChange={(e) => setNewGroup(prev => ({ ...prev, group_name: e.target.value }))}
                  placeholder="Enter group name"
                  required
                />
              </div>
              
              {/* Select Members */}
              <div className="form-group">
                <label>Select Members</label>
                <div className="checkbox-list">
                  {users.length === 0 ? (
                    <p className="empty-message">No users available</p>
                  ) : (
                    users.map(userItem => (
                      <label key={userItem._id} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={newGroup.member_ids.includes(userItem._id)}
                          onChange={() => toggleMember(userItem._id)}
                        />
                        {userItem.first_name} {userItem.last_name} ({userItem.user_name})
                      </label>
                    ))
                  )}
                </div>
              </div>
              
              {/* Select Notebooks */}
              <div className="form-group">
                <label>Select Notebooks (for group access)</label>
                <div className="checkbox-list">
                  {notebooks.length === 0 ? (
                    <p className="empty-message">No notebooks available</p>
                  ) : (
                    notebooks.map(notebook => (
                      <label key={notebook._id} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={newGroup.notebook_ids.includes(notebook._id)}
                          onChange={() => toggleNotebook(notebook._id)}
                        />
                        {notebook.notebook_name}
                      </label>
                    ))
                  )}
                </div>
              </div>
              
              {/* Form Actions */}
              <div className="form-actions">
                <button type="submit" className="btn btn-success">Create Group</button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowNewGroup(false);
                    setNewGroup({
                      group_name: '',
                      member_ids: [],
                      notebook_ids: []
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
        
        {/* Groups List */}
        <div className="card">
          <h2>All Groups</h2>
          
          {groups.length === 0 ? (
            <p className="empty-message">No groups yet. Create one to get started!</p>
          ) : (
            <div className="groups-list">
              {groups.map(group => (
                <div key={group._id} className="group-item">
                  <div className="group-header">
                    <h3>{group.group_name}</h3>
                    <button 
                      onClick={() => handleDeleteGroup(group._id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </div>
                  
                  <div className="group-info">
                    <p><strong>Lead Editor:</strong> {group.lead_editor?.first_name} {group.lead_editor?.last_name}</p>
                    <p><strong>Members:</strong> {group.members?.length || 0}</p>
                    {group.members && group.members.length > 0 && (
                      <ul className="members-list">
                        {group.members.map(member => (
                          <li key={member._id}>
                            {member.first_name} {member.last_name}
                          </li>
                        ))}
                      </ul>
                    )}
                    <p><strong>Accessible Notebooks:</strong> {group.accessible_notebooks?.length || 0}</p>
                    {group.accessible_notebooks && group.accessible_notebooks.length > 0 && (
                      <ul className="notebooks-list">
                        {group.accessible_notebooks.map(notebook => (
                          <li key={notebook._id}>{notebook.notebook_name}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GroupManagement;

