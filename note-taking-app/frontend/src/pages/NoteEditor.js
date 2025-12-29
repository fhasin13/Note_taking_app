/**
 * Note Editor Page Component
 * 
 * This page allows users to view, create, and edit notes.
 * Users can:
 * - Edit note title and content
 * - Add tags
 * - Add comments
 * - Save changes
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  getNoteById, 
  createNote, 
  updateNote, 
  deleteNote,
  getTags,
  createTag,
  getComments,
  createComment,
  deleteComment,
  getNotebooks
} from '../utils/api';
import './NoteEditor.css';

/**
 * NoteEditor Component
 * 
 * Props:
 * - user: Current user object
 * - onLogout: Function to call when user logs out
 */
function NoteEditor({ user, onLogout }) {
  // Get note ID from URL (or 'new' if creating new note)
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State for note data
  const [note, setNote] = useState({
    title: '',
    content: '',
    type: 'text',
    tags: [],
    notebooks: []
  });
  
  // State for related data
  const [tags, setTags] = useState([]);
  const [notebooks, setNotebooks] = useState([]);
  const [comments, setComments] = useState([]);
  
  // State for UI
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // State for adding tags and comments
  const [newTagName, setNewTagName] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [newComment, setNewComment] = useState('');

  // Check if this is a new note or editing existing note
  const isNewNote = id === 'new';

  /**
   * Load Note Data
   * 
   * Fetches note information when component loads (if editing existing note).
   */
  useEffect(() => {
    if (!isNewNote) {
      loadNote();
    } else {
      // For new notes, just load tags and notebooks
      loadRelatedData();
      setLoading(false);
    }
  }, [id]);

  const loadNote = async () => {
    try {
      setLoading(true);
      
      // Fetch note, tags, notebooks, and comments in parallel
      const [noteResponse, tagsResponse, notebooksResponse] = await Promise.all([
        getNoteById(id),
        getTags(),
        getNotebooks()
      ]);
      
      setNote({
        title: noteResponse.note.title,
        content: noteResponse.note.content || '',
        type: noteResponse.note.type || 'text',
        tags: noteResponse.note.tags?.map(t => t._id) || [],
        notebooks: noteResponse.note.notebooks?.map(n => n._id) || []
      });
      
      setTags(tagsResponse.tags || []);
      setNotebooks(notebooksResponse.notebooks || []);
      
      // Load comments
      const commentsResponse = await getComments(id);
      setComments(commentsResponse.comments || []);
      
    } catch (err) {
      setError('Failed to load note. Please try again.');
      console.error('Load note error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedData = async () => {
    try {
      const [tagsResponse, notebooksResponse] = await Promise.all([
        getTags(),
        getNotebooks()
      ]);
      
      setTags(tagsResponse.tags || []);
      setNotebooks(notebooksResponse.notebooks || []);
    } catch (err) {
      console.error('Load related data error:', err);
    }
  };

  /**
   * Handle Save Note
   * 
   * Creates a new note or updates an existing one.
   */
  const handleSave = async () => {
    if (!note.title.trim()) {
      setError('Note title is required');
      return;
    }
    
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      if (isNewNote) {
        // Create new note
        const response = await createNote(note);
        setSuccess('Note created successfully!');
        
        // Redirect to edit page for the new note
        setTimeout(() => {
          navigate(`/note/${response.note._id}`);
        }, 1000);
      } else {
        // Update existing note
        await updateNote(id, note);
        setSuccess('Note saved successfully!');
        
        // Reload note to get latest data
        loadNote();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handle Delete Note
   * 
   * Deletes the current note and redirects to dashboard.
   */
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }
    
    try {
      await deleteNote(id);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete note');
    }
  };

  /**
   * Handle Add Tag
   * 
   * Creates a new tag or adds existing tag to note.
   */
  const handleAddTag = async () => {
    if (!newTagName.trim()) {
      return;
    }
    
    try {
      // Check if tag already exists
      let tag = tags.find(t => t.tag_name === newTagName.toLowerCase());
      
      if (!tag) {
        // Create new tag
        const response = await createTag({ tag_name: newTagName });
        tag = response.tag;
        setTags(prev => [...prev, tag]);
      }
      
      // Add tag to note if not already added
      if (!note.tags.includes(tag._id)) {
        setNote(prev => ({
          ...prev,
          tags: [...prev.tags, tag._id]
        }));
      }
      
      setNewTagName('');
      setShowTagInput(false);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add tag');
    }
  };

  /**
   * Handle Remove Tag
   * 
   * Removes a tag from the note.
   */
  const handleRemoveTag = (tagId) => {
    setNote(prev => ({
      ...prev,
      tags: prev.tags.filter(id => id !== tagId)
    }));
  };

  /**
   * Handle Add Comment
   * 
   * Adds a comment to the note.
   */
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      return;
    }
    
    try {
      const response = await createComment({
        note_id: id,
        comment_text: newComment
      });
      
      setComments(prev => [response.comment, ...prev]);
      setNewComment('');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add comment');
    }
  };

  /**
   * Handle Delete Comment
   * 
   * Deletes a comment from the note.
   */
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(prev => prev.filter(c => c._id !== commentId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete comment');
    }
  };

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

  // Get selected tag objects for display
  const selectedTags = tags.filter(t => note.tags.includes(t._id));

  // Render the note editor
  return (
    <div className="note-editor">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="container">
        <div className="note-editor-header">
          <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
          <div className="note-actions">
            <button 
              onClick={handleSave} 
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Note'}
            </button>
            {!isNewNote && (
              <button 
                onClick={handleDelete} 
                className="btn btn-danger"
              >
                Delete Note
              </button>
            )}
          </div>
        </div>
        
        {/* Messages */}
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        
        {/* Note Editor Form */}
        <div className="card">
          {/* Title Input */}
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={note.title}
              onChange={(e) => setNote(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter note title"
              className="note-title-input"
            />
          </div>
          
          {/* Content Textarea */}
          <div className="form-group">
            <label>Content</label>
            <textarea
              value={note.content}
              onChange={(e) => setNote(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Write your note content here..."
              className="note-content-input"
              rows={15}
            />
          </div>
          
          {/* Tags Section */}
          <div className="form-group">
            <label>Tags</label>
            <div className="tags-container">
              {selectedTags.map(tag => (
                <span key={tag._id} className="tag">
                  {tag.tag_name}
                  <button 
                    onClick={() => handleRemoveTag(tag._id)}
                    className="tag-remove"
                  >
                    ×
                  </button>
                </span>
              ))}
              {!showTagInput ? (
                <button 
                  onClick={() => setShowTagInput(true)}
                  className="btn-add-tag"
                >
                  + Add Tag
                </button>
              ) : (
                <div className="tag-input-group">
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="Enter tag name"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    autoFocus
                  />
                  <button onClick={handleAddTag} className="btn btn-success">Add</button>
                  <button 
                    onClick={() => {
                      setShowTagInput(false);
                      setNewTagName('');
                    }}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Comments Section (only for existing notes) */}
        {!isNewNote && (
          <div className="card">
            <h2>Comments</h2>
            
            {/* Add Comment Form */}
            <div className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows={3}
              />
              <button 
                onClick={handleAddComment}
                className="btn btn-primary"
                disabled={!newComment.trim()}
              >
                Add Comment
              </button>
            </div>
            
            {/* Comments List */}
            <div className="comments-list">
              {comments.length === 0 ? (
                <p className="empty-message">No comments yet.</p>
              ) : (
                comments.map(comment => (
                  <div key={comment._id} className="comment-item">
                    <div className="comment-header">
                      <strong>{comment.user?.first_name} {comment.user?.last_name}</strong>
                      <span className="comment-time">
                        {new Date(comment.comment_time).toLocaleString()}
                      </span>
                      {(user._id === comment.user?._id || 
                        user.roles?.includes('Admin') || 
                        user.roles?.includes('Editor')) && (
                        <button 
                          onClick={() => handleDeleteComment(comment._id)}
                          className="btn-delete-comment"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <p className="comment-text">{comment.comment_text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NoteEditor;

