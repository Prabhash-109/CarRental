import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Home.css"; // custom styles

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Drive Your Dream Car</h1>
          <p>Luxury, Comfort, and Style at your fingertips</p>
          <div className="hero-buttons">
            <Link to="/cars" className="btn primary-btn">
              Browse Cars
            </Link>
            {!user && (
              <Link to="/register" className="btn secondary-btn">
                Get Started
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stat-card">
          <div className="stat-number">100+</div>
          <div className="stat-label">Cars Available</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">500+</div>
          <div className="stat-label">Happy Customers</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">24/7</div>
          <div className="stat-label">Customer Support</div>
        </div>
      </section>

      {/* Quick Actions */}
      {user && (
        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            {user.role === "USER" && (
              <>
                <Link to="/cars" className="action-card">
                  🚗 Browse Cars
                </Link>
                <Link to="/my-bookings" className="action-card">
                  📅 My Bookings
                </Link>
              </>
            )}
            {user.role === "AGENT" && (
              <>
                <Link to="/agent/dashboard" className="action-card">
                  📊 Dashboard
                </Link>
                <Link to="/agent/add-car" className="action-card">
                  ➕ Add New Car
                </Link>
              </>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
