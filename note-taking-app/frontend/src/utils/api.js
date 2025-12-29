/**
 * API Utility Functions
 * 
 * This file contains functions to make HTTP requests to the backend API.
 * All API calls go through this file, making it easy to manage the base URL
 * and add authentication headers.
 */

import axios from 'axios';

// Base URL for the backend API
// Change this if your backend runs on a different port or domain
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Create axios instance with default configuration
 * This automatically adds the base URL and authentication token to all requests
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Add authentication token to requests
 * This runs before every API request
 */
api.interceptors.request.use(
  (config) => {
    // Get token from browser storage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to the request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Handle API errors
 * This runs after every API response
 */
api.interceptors.response.use(
  (response) => response.data, // Return just the data, not the whole response object
  (error) => {
    // If token is invalid, remove it and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTHENTICATION API ====================

/**
 * Sign up (register) a new user
 * POST /api/auth/signup
 */
export const signup = async (userData) => {
  return await api.post('/auth/signup', userData);
};

/**
 * Log in an existing user
 * POST /api/auth/login
 */
export const login = async (email, password) => {
  return await api.post('/auth/login', { email, password });
};

/**
 * Get current user information
 * GET /api/auth/me
 */
export const getCurrentUser = async () => {
  return await api.get('/auth/me');
};

// ==================== NOTES API ====================

/**
 * Get all notes
 * GET /api/notes
 */
export const getNotes = async (params = {}) => {
  return await api.get('/notes', { params });
};

/**
 * Get a single note by ID
 * GET /api/notes/:id
 */
export const getNoteById = async (id) => {
  return await api.get(`/notes/${id}`);
};

/**
 * Create a new note
 * POST /api/notes
 */
export const createNote = async (noteData) => {
  return await api.post('/notes', noteData);
};

/**
 * Update a note
 * PUT /api/notes/:id
 */
export const updateNote = async (id, noteData) => {
  return await api.put(`/notes/${id}`, noteData);
};

/**
 * Delete a note
 * DELETE /api/notes/:id
 */
export const deleteNote = async (id) => {
  return await api.delete(`/notes/${id}`);
};

// ==================== NOTEBOOKS API ====================

/**
 * Get all notebooks
 * GET /api/notebooks
 */
export const getNotebooks = async () => {
  return await api.get('/notebooks');
};

/**
 * Get a single notebook by ID
 * GET /api/notebooks/:id
 */
export const getNotebookById = async (id) => {
  return await api.get(`/notebooks/${id}`);
};

/**
 * Create a new notebook
 * POST /api/notebooks
 */
export const createNotebook = async (notebookData) => {
  return await api.post('/notebooks', notebookData);
};

/**
 * Update a notebook
 * PUT /api/notebooks/:id
 */
export const updateNotebook = async (id, notebookData) => {
  return await api.put(`/notebooks/${id}`, notebookData);
};

/**
 * Delete a notebook
 * DELETE /api/notebooks/:id
 */
export const deleteNotebook = async (id) => {
  return await api.delete(`/notebooks/${id}`);
};

/**
 * Add a note to a notebook
 * POST /api/notebooks/:id/notes
 */
export const addNoteToNotebook = async (notebookId, noteId) => {
  return await api.post(`/notebooks/${notebookId}/notes`, { note_id: noteId });
};

// ==================== TAGS API ====================

/**
 * Get all tags
 * GET /api/tags
 */
export const getTags = async () => {
  return await api.get('/tags');
};

/**
 * Create a new tag
 * POST /api/tags
 */
export const createTag = async (tagData) => {
  return await api.post('/tags', tagData);
};

/**
 * Delete a tag
 * DELETE /api/tags/:id
 */
export const deleteTag = async (id) => {
  return await api.delete(`/tags/${id}`);
};

// ==================== COMMENTS API ====================

/**
 * Get comments for a note
 * GET /api/comments?note_id=...
 */
export const getComments = async (noteId) => {
  return await api.get('/comments', { params: { note_id: noteId } });
};

/**
 * Create a comment
 * POST /api/comments
 */
export const createComment = async (commentData) => {
  return await api.post('/comments', commentData);
};

/**
 * Delete a comment
 * DELETE /api/comments/:id
 */
export const deleteComment = async (id) => {
  return await api.delete(`/comments/${id}`);
};

// ==================== GROUPS API ====================

/**
 * Get all groups
 * GET /api/groups
 */
export const getGroups = async () => {
  return await api.get('/groups');
};

/**
 * Get a single group by ID
 * GET /api/groups/:id
 */
export const getGroupById = async (id) => {
  return await api.get(`/groups/${id}`);
};

/**
 * Create a new group
 * POST /api/groups
 */
export const createGroup = async (groupData) => {
  return await api.post('/groups', groupData);
};

/**
 * Update a group
 * PUT /api/groups/:id
 */
export const updateGroup = async (id, groupData) => {
  return await api.put(`/groups/${id}`, groupData);
};

/**
 * Delete a group
 * DELETE /api/groups/:id
 */
export const deleteGroup = async (id) => {
  return await api.delete(`/groups/${id}`);
};

/**
 * Add a member to a group
 * POST /api/groups/:id/members
 */
export const addMemberToGroup = async (groupId, userId) => {
  return await api.post(`/groups/${groupId}/members`, { user_id: userId });
};

// ==================== USERS API ====================

/**
 * Get all users (Admin only)
 * GET /api/users
 */
export const getUsers = async () => {
  return await api.get('/users');
};

