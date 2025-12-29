/**
 * Dashboard Page Component
 * 
 * This is the main page users see after logging in.
 * It displays:
 * - User's notebooks
 * - Recent notes
 * - Quick actions to create new notebooks and notes
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getNotebooks, getNotes, createNotebook, createNote } from '../utils/api';
import './Dashboard.css';

/**
 * Dashboard Component
 * 
 * Props:
 * - user: Current user object
 * - onLogout: Function to call when user logs out
 */
function Dashboard({ user, onLogout }) {
  // State to store notebooks and notes
  const [notebooks, setNotebooks] = useState([]);
  const [notes, setNotes] = useState([]);
  
  // State for creating new items
  const [showNewNotebook, setShowNewNotebook] = useState(false);
  const [newNotebookName, setNewNotebookName] = useState('');
  
  // State for loading and errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * Load Data
   * 
   * Fetches notebooks and notes from the API when component loads.
   */
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Fetch notebooks and notes in parallel
      const [notebooksResponse, notesResponse] = await Promise.all([
        getNotebooks(),
        getNotes()
      ]);
      
      setNotebooks(notebooksResponse.notebooks || []);
      setNotes(notesResponse.notes || []);
      
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error('Load data error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Create Notebook
   * 
   * Creates a new notebook when user submits the form.
   */
  const handleCreateNotebook = async (e) => {
    e.preventDefault();
    
    if (!newNotebookName.trim()) {
      setError('Notebook name is required');
      return;
    }
    
    try {
      const response = await createNotebook({ notebook_name: newNotebookName });
      
      // Add new notebook to the list
      setNotebooks(prev => [response.notebook, ...prev]);
      
      // Reset form
      setNewNotebookName('');
      setShowNewNotebook(false);
      setError('');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create notebook');
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

  // Render the dashboard
  return (
    <div className="dashboard">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome, {user?.first_name}!</h1>
          <p>Manage your notebooks and notes</p>
        </div>
        
        {/* Error Message */}
        {error && <div className="error">{error}</div>}
        
        {/* Create New Notebook Section */}
        <div className="card">
          <h2>Notebooks</h2>
          
          {!showNewNotebook ? (
            <button 
              className="btn btn-primary"
              onClick={() => setShowNewNotebook(true)}
            >
              + Create New Notebook
            </button>
          ) : (
            <form onSubmit={handleCreateNotebook} className="inline-form">
              <input
                type="text"
                value={newNotebookName}
                onChange={(e) => setNewNotebookName(e.target.value)}
                placeholder="Enter notebook name"
                autoFocus
              />
              <button type="submit" className="btn btn-success">Create</button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => {
                  setShowNewNotebook(false);
                  setNewNotebookName('');
                }}
              >
                Cancel
              </button>
            </form>
          )}
          
          {/* Notebooks List */}
          {notebooks.length === 0 ? (
            <p className="empty-message">No notebooks yet. Create one to get started!</p>
          ) : (
            <div className="notebooks-grid">
              {notebooks.map(notebook => (
                <Link 
                  key={notebook._id} 
                  to={`/notebook/${notebook._id}`}
                  className="notebook-card"
                >
                  <h3>{notebook.notebook_name}</h3>
                  <p className="note-count">
                    {notebook.notes?.length || 0} note(s)
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
        
        {/* Recent Notes Section */}
        <div className="card">
          <h2>Recent Notes</h2>
          
          <Link to="/note/new" className="btn btn-primary">
            + Create New Note
          </Link>
          
          {notes.length === 0 ? (
            <p className="empty-message">No notes yet. Create one to get started!</p>
          ) : (
            <div className="notes-list">
              {notes.slice(0, 10).map(note => (
                <Link 
                  key={note._id} 
                  to={`/note/${note._id}`}
                  className="note-item"
                >
                  <h3>{note.title}</h3>
                  <p className="note-preview">
                    {note.content?.substring(0, 100)}...
                  </p>
                  <p className="note-meta">
                    Created: {new Date(note.creation_time).toLocaleDateString()}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

