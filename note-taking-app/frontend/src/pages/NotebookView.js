/**
 * Notebook View Page Component
 * 
 * This page displays a single notebook and all its notes.
 * Users can view, create, and manage notes within a notebook.
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getNotebookById, addNoteToNotebook, getNotes, createNote } from '../utils/api';
import './NotebookView.css';

/**
 * NotebookView Component
 * 
 * Props:
 * - user: Current user object
 * - onLogout: Function to call when user logs out
 */
function NotebookView({ user, onLogout }) {
  // Get notebook ID from URL parameters
  const { id } = useParams();
  
  // State to store notebook data and its notes
  const [notebook, setNotebook] = useState(null);
  const [notes, setNotes] = useState([]);
  
  // State for creating new note
  const [showNewNote, setShowNewNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  
  // State for loading and errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * Load Notebook Data
   * 
   * Fetches notebook information and its notes when component loads.
   */
  useEffect(() => {
    loadNotebook();
  }, [id]);

  const loadNotebook = async () => {
    try {
      setLoading(true);
      
      // Fetch notebook details
      const notebookResponse = await getNotebookById(id);
      setNotebook(notebookResponse.notebook);
      
      // Fetch all notes in this notebook
      const notesResponse = await getNotes({ notebook_id: id });
      setNotes(notesResponse.notes || []);
      
    } catch (err) {
      setError('Failed to load notebook. Please try again.');
      console.error('Load notebook error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Create Note
   * 
   * Creates a new note and adds it to this notebook.
   */
  const handleCreateNote = async (e) => {
    e.preventDefault();
    
    if (!newNoteTitle.trim()) {
      setError('Note title is required');
      return;
    }
    
    try {
      // Create new note
      const noteResponse = await createNote({
        title: newNoteTitle,
        content: '',
        type: 'text',
        notebook_ids: [id]
      });
      
      // Add note to notebook (if not already added)
      await addNoteToNotebook(id, noteResponse.note._id);
      
      // Add new note to the list
      setNotes(prev => [noteResponse.note, ...prev]);
      
      // Reset form
      setNewNoteTitle('');
      setShowNewNote(false);
      setError('');
      
      // Reload notebook to update note count
      loadNotebook();
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create note');
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

  // Show error if notebook not found
  if (!notebook) {
    return (
      <div>
        <Navbar user={user} onLogout={onLogout} />
        <div className="container">
          <div className="error">Notebook not found</div>
          <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  // Render the notebook view
  return (
    <div className="notebook-view">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="container">
        {/* Notebook Header */}
        <div className="notebook-header">
          <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
          <h1>{notebook.notebook_name}</h1>
          <p className="notebook-info">
            {notes.length} note(s) in this notebook
          </p>
        </div>
        
        {/* Error Message */}
        {error && <div className="error">{error}</div>}
        
        {/* Create New Note Section */}
        <div className="card">
          {!showNewNote ? (
            <button 
              className="btn btn-primary"
              onClick={() => setShowNewNote(true)}
            >
              + Create New Note
            </button>
          ) : (
            <form onSubmit={handleCreateNote} className="inline-form">
              <input
                type="text"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                placeholder="Enter note title"
                autoFocus
              />
              <button type="submit" className="btn btn-success">Create</button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => {
                  setShowNewNote(false);
                  setNewNoteTitle('');
                }}
              >
                Cancel
              </button>
            </form>
          )}
        </div>
        
        {/* Notes List */}
        <div className="card">
          <h2>Notes</h2>
          
          {notes.length === 0 ? (
            <p className="empty-message">
              No notes in this notebook yet. Create one to get started!
            </p>
          ) : (
            <div className="notes-grid">
              {notes.map(note => (
                <Link 
                  key={note._id} 
                  to={`/note/${note._id}`}
                  className="note-card"
                >
                  <h3>{note.title}</h3>
                  <p className="note-preview">
                    {note.content?.substring(0, 150) || 'No content yet...'}
                  </p>
                  <p className="note-meta">
                    Created: {new Date(note.creation_time).toLocaleDateString()}
                  </p>
                  {note.tags && note.tags.length > 0 && (
                    <div className="note-tags">
                      {note.tags.map(tag => (
                        <span key={tag._id} className="tag">{tag.tag_name}</span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotebookView;

