import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../assets/css/Navbar.css';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide the global top navbar on fullscreen canvas pages and dashboards
  const hiddenPaths = ['/login', '/signup'];
  if (hiddenPaths.includes(location.pathname)) return null;

  const isDashboardMode = location.pathname.includes('/dashboard');

  return (
    <nav className={`minimal-navbar ${isDashboardMode ? 'navbar-dashboard-mode' : ''}`}>
      <div className="navbar-container">
        {/* Center: Open Space (Links Removed) */}
        <div style={{ flex: 1 }}></div>

        {/* Right Side: Account Actions */}
        <div className="navbar-actions desktop-only">
          {isAuthenticated ? (
            <div className="user-dropdown-trigger">
              <span className="user-name-label">Hi, {user?.username}</span>
              <div className="nav-avatar">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="nav-link">Log In</Link>
              <Link to="/signup" className="nav-btn-solid">Get Started</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay">
          
          {isAuthenticated ? (
            <button className="mobile-link" style={{ textAlign: 'left' }} onClick={() => { logout(); setMobileMenuOpen(false); }}>
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
              <Link to="/signup" className="mobile-link bold-link" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
