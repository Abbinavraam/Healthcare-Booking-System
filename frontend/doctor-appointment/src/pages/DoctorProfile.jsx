import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/styles.css";

const DoctorProfile = () => {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("about");
  const navigate = useNavigate();

  // Mock doctor data
  const mockDoctor = {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialization: "Cardiology",
    experience: 12,
    rating: 4.8,
    patients: 1500,
    availability: ["Monday", "Wednesday", "Friday"],
    timeSlots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    bio: "Dr. Sarah Johnson is a board-certified cardiologist with over 12 years of experience in treating various heart conditions. She specializes in preventive cardiology, heart failure management, and cardiac rehabilitation.",
    education: [
      { degree: "MD", institution: "Johns Hopkins University", year: "2008" },
      { degree: "Residency", institution: "Mayo Clinic", year: "2012" },
      { degree: "Fellowship", institution: "Cleveland Clinic", year: "2014" }
    ],
    hospital: "City General Hospital",
    address: "123 Medical Center Blvd, Suite 300",
    languages: ["English", "Spanish"],
    services: [
      "Cardiac Consultation",
      "Echocardiography",
      "Stress Testing",
      "Holter Monitoring",
      "Pacemaker Checks"
    ],
    reviews: [
      {
        id: "1",
        patient: "John D.",
        rating: 5,
        date: "2023-04-15",
        comment: "Dr. Johnson was thorough and took the time to explain everything clearly. Very professional and caring."
      },
      {
        id: "2",
        patient: "Maria S.",
        rating: 4,
        date: "2023-03-22",
        comment: "Great doctor who really listens. The wait time was a bit long but the care was excellent."
      },
      {
        id: "3",
        patient: "Robert T.",
        rating: 5,
        date: "2023-02-10",
        comment: "Dr. Johnson helped me manage my heart condition with a personalized treatment plan. I've seen significant improvement."
      }
    ]
  };

  useEffect(() => {
    // Simulate API call to fetch doctor details
    const fetchDoctorDetails = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDoctor(mockDoctor);
      } catch (err) {
        setError("Failed to fetch doctor details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [doctorId]);

  const handleBookAppointment = () => {
    navigate(`/book-appointment/${doctorId}`);
  };

  if (loading) {
    return (
      <div className="doctor-profile-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="doctor-profile-page">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Try Again
          </button>
          <button className="btn btn-outline" onClick={() => navigate("/doctors")}>
            Back to Doctors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-profile-page">
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="profile-image-container">
            <img src={doctor.image} alt={doctor.name} className="profile-image" />
          </div>
          <div className="profile-info">
            <h1>{doctor.name}</h1>
            <p className="profile-specialty">{doctor.specialization}</p>
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-value">{doctor.experience} Years</span>
                <span className="stat-label">Experience</span>
              </div>
              <div className="stat">
                <span className="stat-value">{doctor.patients}+</span>
                <span className="stat-label">Patients</span>
              </div>
              <div className="stat">
                <span className="stat-value">⭐ {doctor.rating}</span>
                <span className="stat-label">Rating</span>
              </div>
            </div>
            <button className="btn btn-primary book-btn" onClick={handleBookAppointment}>
              Book Appointment
            </button>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          <button 
            className={`tab-button ${activeTab === "about" ? "active" : ""}`}
            onClick={() => setActiveTab("about")}
          >
            About
          </button>
          <button 
            className={`tab-button ${activeTab === "experience" ? "active" : ""}`}
            onClick={() => setActiveTab("experience")}
          >
            Experience & Education
          </button>
          <button 
            className={`tab-button ${activeTab === "services" ? "active" : ""}`}
            onClick={() => setActiveTab("services")}
          >
            Services
          </button>
          <button 
            className={`tab-button ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>
        </div>

        <div className="profile-tab-content">
          {activeTab === "about" && (
            <div className="about-section">
              <h3>About Dr. {doctor.name.split(" ")[1]}</h3>
              <p className="bio">{doctor.bio}</p>
              
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-icon">🏥</span>
                  <div className="info-content">
                    <h4>Hospital</h4>
                    <p>{doctor.hospital}</p>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">📍</span>
                  <div className="info-content">
                    <h4>Address</h4>
                    <p>{doctor.address}</p>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">🗣️</span>
                  <div className="info-content">
                    <h4>Languages</h4>
                    <p>{doctor.languages.join(", ")}</p>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">📅</span>
                  <div className="info-content">
                    <h4>Availability</h4>
                    <p>{doctor.availability.join(", ")}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "experience" && (
            <div className="experience-section">
              <h3>Education & Qualifications</h3>
              <div className="timeline">
                {doctor.education.map((edu, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <h4>{edu.degree}</h4>
                      <p className="timeline-institution">{edu.institution}</p>
                      <p className="timeline-year">{edu.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "services" && (
            <div className="services-section">
              <h3>Services Offered</h3>
              <div className="services-grid">
                {doctor.services.map((service, index) => (
                  <div key={index} className="service-item">
                    <span className="service-icon">✓</span>
                    <span className="service-name">{service}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="reviews-section">
              <h3>Patient Reviews</h3>
              <div className="reviews-summary">
                <div className="rating-large">
                  <span className="rating-number">{doctor.rating}</span>
                  <div className="rating-stars">
                    {"★".repeat(Math.floor(doctor.rating))}
                    {doctor.rating % 1 !== 0 && "½"}
                    {"☆".repeat(5 - Math.ceil(doctor.rating))}
                  </div>
                  <span className="rating-count">Based on {doctor.reviews.length} reviews</span>
                </div>
              </div>
              <div className="reviews-list">
                {doctor.reviews.map(review => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <span className="reviewer-name">{review.patient}</span>
                        <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
                      </div>
                      <div className="review-rating">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </div>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;