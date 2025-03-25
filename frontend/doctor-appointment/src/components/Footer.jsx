import React from "react";
import { Link } from "react-router-dom";
import "../styles/styles.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">Healthcare Booking System</h3>
          <p className="footer-description">
            Connecting patients with healthcare professionals for better and more accessible care.
          </p>
          <div className="footer-social">
            <a href="#" className="social-link" aria-label="Facebook">
              <i className="social-icon">📘</i>
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <i className="social-icon">🐦</i>
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <i className="social-icon">📷</i>
            </a>
            <a href="#" className="social-link" aria-label="LinkedIn">
              <i className="social-icon">💼</i>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/doctors">Find Doctors</Link></li>
            <li><Link to="/appointments">My Appointments</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">For Patients</h4>
          <ul className="footer-links">
            <li><a href="#">How it Works</a></li>
            <li><a href="#">Patient Reviews</a></li>
            <li><a href="#">Insurance Partners</a></li>
            <li><a href="#">Health Blog</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Contact Us</h4>
          <address className="footer-contact">
            <p><i className="contact-icon">📍</i> 123 Healthcare Ave, Medical District</p>
            <p><i className="contact-icon">📞</i> (123) 456-7890</p>
            <p><i className="contact-icon">✉️</i> support@healthcarebooking.com</p>
          </address>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright">
          &copy; {currentYear} Healthcare Booking System. All rights reserved.
        </p>
        <div className="footer-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;