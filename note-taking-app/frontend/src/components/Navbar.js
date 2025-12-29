/**
 * Navigation Bar Component
 * 
 * This component displays the top navigation bar with links to different pages.
 * It shows different options based on user roles.
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

/**
 * Navbar Component
 * 
 * Props:
 * - user: Current user object with roles and info
 * - onLogout: Function to call when user clicks logout
 */
function Navbar({ user, onLogout }) {
  // Get current page location to highlight active link
  const location = useLocation();
  
  // Check if user has specific roles
  const isAdmin = user?.roles?.includes('Admin');
  const isLeadEditor = user?.roles?.includes('Lead Editor');
  const canManageGroups = isAdmin || isLeadEditor;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">📝 Note Taking App</Link>
      </div>
      
      <div className="navbar-links">
        {/* Dashboard Link */}
        <Link 
          to="/dashboard" 
          className={location.pathname === '/dashboard' ? 'active' : ''}
        >
          Dashboard
        </Link>
        
        {/* Groups Link (only for Admin and Lead Editor) */}
        {canManageGroups && (
          <Link 
            to="/groups" 
            className={location.pathname === '/groups' ? 'active' : ''}
          >
            Groups
          </Link>
        )}
        
        {/* User Info */}
        <span className="user-info">
          {user?.first_name} {user?.last_name}
          {user?.roles && user.roles.length > 0 && (
            <span className="user-roles">
              ({user.roles.join(', ')})
            </span>
          )}
        </span>
        
        {/* Logout Button */}
        <button onClick={onLogout} className="btn-logout">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

