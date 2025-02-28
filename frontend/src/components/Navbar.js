import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ showLoginModal, showRegisterModal }) => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('accessToken'); // Check if the user is logged in

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item"><Link to="/">Home</Link></li>
        {isLoggedIn && <li className="navbar-item"><Link to="/profile">Profile</Link></li>}
        {isLoggedIn && <li className="navbar-item"><Link to="/mealLog">Meal Log</Link></li>}
        <li className="navbar-item"><Link to="/about">About</Link></li>
        {!isLoggedIn && <li className="navbar-item"><button className="navbar-btn" onClick={showLoginModal}>Login</button></li>}
        {!isLoggedIn && <li className="navbar-item"><button className="navbar-btn" onClick={showRegisterModal}>Register</button></li>}
        {isLoggedIn && <li className="navbar-item"><button className="navbar-btn" onClick={handleLogout}>Logout</button></li>}
      </ul>
    </nav>
  );
};

export default Navbar;