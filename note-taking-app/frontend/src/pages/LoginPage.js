/**
 * Login Page Component
 * 
 * This page allows users to log in to their account.
 * Users enter their email and password to authenticate.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../utils/api';
import './LoginPage.css';

/**
 * LoginPage Component
 * 
 * Props:
 * - onLogin: Function called when login is successful
 */
function LoginPage({ onLogin }) {
  // State to store form input values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State to track loading and errors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // useNavigate hook to programmatically navigate to other pages
  const navigate = useNavigate();

  /**
   * Handle Form Submission
   * 
   * Called when user clicks the "Login" button.
   * Sends login request to backend API.
   */
  const handleSubmit = async (e) => {
    // Prevent default form submission (page refresh)
    e.preventDefault();
    
    // Clear any previous errors
    setError('');
    setLoading(true);
    
    try {
      // Call API to login
      const response = await login(email, password);
      
      // If successful, call onLogin callback with token and user data
      onLogin(response.token, response.user);
      
      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (err) {
      // If login fails, show error message
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      // Stop loading spinner
      setLoading(false);
    }
  };

  // Render the login form
  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Welcome Back!</h1>
        <p className="subtitle">Login to your account</p>
        
        {/* Show error message if login fails */}
        {error && <div className="error">{error}</div>}
        
        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>
          
          {/* Password Input */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        {/* Link to Signup Page */}
        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;

