import React from "react";
import { Link } from "react-router-dom";
import "../styles/styles.css";

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-content">
          <h1 className="not-found-title">404</h1>
          <h2 className="not-found-subtitle">Page Not Found</h2>
          <p className="not-found-description">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <div className="not-found-actions">
            <Link to="/" className="btn btn-primary">
              Back to Home
            </Link>
            <Link to="/doctors" className="btn btn-outline">
              Find Doctors
            </Link>
          </div>
        </div>
        <div className="not-found-image">
          <div className="image-placeholder">
            <span className="error-emoji">🔍</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;