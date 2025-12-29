/**
 * Signup Page Component
 * 
 * This page allows new users to create an account.
 * Users enter their information to register.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../utils/api';
import './SignupPage.css';

/**
 * SignupPage Component
 * 
 * Props:
 * - onLogin: Function called when signup is successful (auto-login)
 */
function SignupPage({ onLogin }) {
  // State to store all form input values
  const [formData, setFormData] = useState({
    user_name: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    institution: '',
    roles: ['Contributor'] // Default role
  });
  
  // State to track loading and errors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  /**
   * Handle Input Change
   * 
   * Updates form state when user types in any input field.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Handle Form Submission
   * 
   * Validates form data and creates a new user account.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare data for API (remove confirmPassword, it's not needed)
      const { confirmPassword, ...signupData } = formData;
      
      // If phone is provided, convert to array
      if (signupData.phone) {
        signupData.phone = [signupData.phone];
      }
      
      // Call API to create account
      const response = await signup(signupData);
      
      // If successful, automatically log in the user
      onLogin(response.token, response.user);
      
      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (err) {
      // If signup fails, show error message
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render the signup form
  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1>Create Account</h1>
        <p className="subtitle">Sign up to get started</p>
        
        {/* Show error message if signup fails */}
        {error && <div className="error">{error}</div>}
        
        {/* Signup Form */}
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="form-group">
            <label htmlFor="user_name">Username</label>
            <input
              type="text"
              id="user_name"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              placeholder="Choose a username"
              required
              disabled={loading}
            />
          </div>
          
          {/* First Name */}
          <div className="form-group">
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Enter your first name"
              required
              disabled={loading}
            />
          </div>
          
          {/* Last Name */}
          <div className="form-group">
            <label htmlFor="last_name">Last Name</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Enter your last name"
              required
              disabled={loading}
            />
          </div>
          
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>
          
          {/* Phone */}
          <div className="form-group">
            <label htmlFor="phone">Phone (Optional)</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              disabled={loading}
            />
          </div>
          
          {/* Institution */}
          <div className="form-group">
            <label htmlFor="institution">Institution (Optional)</label>
            <input
              type="text"
              id="institution"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              placeholder="Enter your institution"
              disabled={loading}
            />
          </div>
          
          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password (min 6 characters)"
              required
              disabled={loading}
            />
          </div>
          
          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
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
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        {/* Link to Login Page */}
        <p className="login-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;

