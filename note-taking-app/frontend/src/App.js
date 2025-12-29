/**
 * Main App Component
 * 
 * This is the root component of the application.
 * It sets up routing and provides authentication context to all child components.
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import NotebookView from './pages/NotebookView';
import NoteEditor from './pages/NoteEditor';
import GroupManagement from './pages/GroupManagement';

// Import API utility
import { getCurrentUser } from './utils/api';

/**
 * App Component
 * 
 * Manages:
 * - User authentication state
 * - Routing between different pages
 * - Protected routes (pages that require login)
 */
function App() {
  // State to store current user information
  const [user, setUser] = useState(null);
  
  // State to track if we're still checking authentication
  const [loading, setLoading] = useState(true);

  /**
   * Check if user is logged in when app loads
   * This runs once when the component mounts
   */
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Check Authentication
   * 
   * Tries to get current user from API using stored token.
   * If token is valid, user is logged in.
   */
  const checkAuth = async () => {
    try {
      // Get token from browser's local storage
      const token = localStorage.getItem('token');
      
      if (!token) {
        // No token means user is not logged in
        setLoading(false);
        return;
      }
      
      // Try to get user info from API
      const response = await getCurrentUser();
      
      if (response.user) {
        // User is authenticated, save user info
        setUser(response.user);
      } else {
        // Invalid token, remove it
        localStorage.removeItem('token');
      }
    } catch (error) {
      // Error means user is not authenticated
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    } finally {
      // Done checking, stop loading
      setLoading(false);
    }
  };

  /**
   * Handle Login
   * 
   * Called when user successfully logs in.
   * Saves token and user info.
   */
  const handleLogin = (token, userData) => {
    // Save token to browser storage
    localStorage.setItem('token', token);
    // Save user info to state
    setUser(userData);
  };

  /**
   * Handle Logout
   * 
   * Called when user logs out.
   * Removes token and clears user info.
   */
  const handleLogout = () => {
    // Remove token from browser storage
    localStorage.removeItem('token');
    // Clear user info from state
    setUser(null);
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  /**
   * Protected Route Component
   * 
   * Wraps routes that require authentication.
   * If user is not logged in, redirects to login page.
   */
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      // User not logged in, redirect to login
      return <Navigate to="/login" replace />;
    }
    // User is logged in, show the protected page
    return children;
  };

  /**
   * Public Route Component
   * 
   * Wraps routes that should only be accessible when NOT logged in.
   * If user is already logged in, redirects to dashboard.
   */
  const PublicRoute = ({ children }) => {
    if (user) {
      // User already logged in, redirect to dashboard
      return <Navigate to="/dashboard" replace />;
    }
    // User not logged in, show the public page
    return children;
  };

  // Render the application with routing
  return (
    <Router>
      <div className="App">
        {/* Define all routes */}
        <Routes>
          {/* Public routes (only accessible when not logged in) */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage onLogin={handleLogin} />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <SignupPage onLogin={handleLogin} />
              </PublicRoute>
            } 
          />
          
          {/* Protected routes (require authentication) */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notebook/:id" 
            element={
              <ProtectedRoute>
                <NotebookView user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/note/:id" 
            element={
              <ProtectedRoute>
                <NoteEditor user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/note/new" 
            element={
              <ProtectedRoute>
                <NoteEditor user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/groups" 
            element={
              <ProtectedRoute>
                <GroupManagement user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          
          {/* Default route: redirect to dashboard if logged in, else to login */}
          <Route 
            path="/" 
            element={
              user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

