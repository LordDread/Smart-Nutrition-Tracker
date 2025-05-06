import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ showLoginModal, showRegisterModal }) => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('accessToken'); // Check if the user is logged in
  const username = localStorage.getItem('username'); // Retrieve the username from localStorage

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('username'); // Remove the username from localStorage
    navigate('/');
  };

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        {/* Left-aligned navigation links */}
        <li className="navbar-item"><Link to="/">Home</Link></li>
        {isLoggedIn && <li className="navbar-item"><Link to="/profile">Profile</Link></li>}
        {isLoggedIn && <li className="navbar-item"><Link to="/mealLog">Meal Log</Link></li>}
        <li className="navbar-item"><Link to="/about">About</Link></li>

        {/* Right-aligned username and buttons */}
        <div className="navbar-right">
          {isLoggedIn && <span className="navbar-username">{username || 'User'}</span>}
          {!isLoggedIn && (
            <>
              <button className="navbar-btn" onClick={showLoginModal}>Login</button>
              <button className="navbar-btn" onClick={showRegisterModal}>Register</button>
            </>
          )}
          {isLoggedIn && (
            <button className="navbar-btn" onClick={handleLogout}>Logout</button>
          )}
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;