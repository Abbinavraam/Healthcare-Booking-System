import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-content">
        <header className="home-header">
          <h1>Welcome to <span className="highlight">Healthcare</span> Booking System</h1>
          <p className="home-subtitle">Book appointments with top doctors easily and securely.</p>
          <p className="home-description">
            Our platform connects you with qualified healthcare professionals for virtual and in-person consultations.
            Get the care you need, when you need it.
          </p>
        </header>

        <div className="home-features">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Find Specialists</h3>
            <p>Search for doctors by specialty, location, or availability</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Easy Scheduling</h3>
            <p>Book, reschedule, or cancel appointments with a few clicks</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Reminders</h3>
            <p>Get notifications about upcoming appointments</p>
          </div>
        </div>

        <div className="home-cta">
          <button className="btn btn-primary" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="btn btn-secondary" onClick={() => navigate("/register")}>
            Register
          </button>
        </div>
      </div>

      <div className="home-image">
        <div className="image-placeholder">
          <div className="image-overlay"></div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
