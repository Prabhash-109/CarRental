import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css'; 

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo / Brand */}
        <Link to="/" className="navbar-brand">
          🚗 CarRental
        </Link>

        {/* Links */}
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/cars">Available Cars</Link></li>

          {user ? (
            <>
              {user.role === 'USER' && (
                <li><Link to="/my-bookings">My Bookings</Link></li>
              )}
              {user.role === 'AGENT' && (
                <li><Link to="/agent/dashboard">Dashboard</Link></li>
              )}
              <li className="welcome-text">Hi, {user.firstName} 👋</li>
              <li>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="auth-link">Login</Link></li>
              <li><Link to="/register" className="auth-link register">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
