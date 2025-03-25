import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/styles.css";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);

  // Mock appointment data
  const mockAppointments = [
    {
      id: "1",
      doctorId: "1",
      doctorName: "Dr. Sarah Johnson",
      doctorSpecialty: "Cardiology",
      doctorImage: "https://randomuser.me/api/portraits/women/44.jpg",
      date: "2023-12-15",
      time: "10:00",
      status: "confirmed",
      reason: "Annual Check-up",
      notes: "Need to discuss recent test results and medication adjustments.",
      location: "City General Hospital, Room 305"
    },
    {
      id: "2",
      doctorId: "2",
      doctorName: "Dr. Michael Chen",
      doctorSpecialty: "Dermatology",
      doctorImage: "https://randomuser.me/api/portraits/men/32.jpg",
      date: "2023-12-22",
      time: "14:30",
      status: "confirmed",
      reason: "Follow-up",
      notes: "",
      location: "Westside Medical Center, Suite 210"
    },
    {
      id: "3",
      doctorId: "3",
      doctorName: "Dr. Emily Rodriguez",
      doctorSpecialty: "Pediatrics",
      doctorImage: "https://randomuser.me/api/portraits/women/68.jpg",
      date: "2023-11-05",
      time: "09:15",
      status: "completed",
      reason: "Vaccination",
      notes: "Child received scheduled vaccinations. Next appointment in 6 months.",
      location: "Children's Wellness Clinic"
    },
    {
      id: "4",
      doctorId: "1",
      doctorName: "Dr. Sarah Johnson",
      doctorSpecialty: "Cardiology",
      doctorImage: "https://randomuser.me/api/portraits/women/44.jpg",
      date: "2023-10-18",
      time: "11:30",
      status: "cancelled",
      reason: "Consultation",
      notes: "Cancelled due to scheduling conflict.",
      location: "City General Hospital, Room 305"
    }
  ];

  useEffect(() => {
    // Simulate API call to fetch appointments
    const fetchAppointments = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAppointments(mockAppointments);
      } catch (err) {
        setError("Failed to fetch appointments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleCancelAppointment = (appointment) => {
    setAppointmentToCancel(appointment);
    setShowCancelModal(true);
  };

  const confirmCancelAppointment = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update the appointment status locally
      setAppointments(appointments.map(app => 
        app.id === appointmentToCancel.id 
          ? { ...app, status: 'cancelled' } 
          : app
      ));
      
      setShowCancelModal(false);
      setAppointmentToCancel(null);
    } catch (err) {
      setError("Failed to cancel appointment. Please try again.");
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const today = new Date();
    const appointmentDate = new Date(appointment.date);
    
    if (activeTab === "upcoming") {
      return appointmentDate >= today && appointment.status === "confirmed";
    } else if (activeTab === "past") {
      return appointmentDate < today || appointment.status === "completed";
    } else if (activeTab === "cancelled") {
      return appointment.status === "cancelled";
    }
    return true;
  });

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="appointments-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="appointments-page">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="appointments-page">
      <div className="appointments-header">
        <h1>My Appointments</h1>
        <p>View and manage your scheduled appointments</p>
      </div>

      <div className="appointments-tabs">
        <button 
          className={`tab-button ${activeTab === "upcoming" ? "active" : ""}`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming
        </button>
        <button 
          className={`tab-button ${activeTab === "past" ? "active" : ""}`}
          onClick={() => setActiveTab("past")}
        >
          Past
        </button>
        <button 
          className={`tab-button ${activeTab === "cancelled" ? "active" : ""}`}
          onClick={() => setActiveTab("cancelled")}
        >
          Cancelled
        </button>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="no-appointments">
          <div className="empty-state-icon">📅</div>
          <h3>No {activeTab} appointments found</h3>
          {activeTab === "upcoming" ? (
            <>
              <p>You don't have any upcoming appointments scheduled.</p>
              <Link to="/doctors" className="btn btn-primary">
                Book an Appointment
              </Link>
            </>
          ) : activeTab === "past" ? (
            <p>You don't have any past appointments.</p>
          ) : (
            <p>You don't have any cancelled appointments.</p>
          )}
        </div>
      ) : (
        <div className="appointments-list">
          {filteredAppointments.map(appointment => (
            <div key={appointment.id} className="appointment-card">
              <div className="appointment-card-left">
                <img 
                  src={appointment.doctorImage} 
                  alt={appointment.doctorName} 
                  className="doctor-thumbnail" 
                />
              </div>
              
              <div className="appointment-card-middle">
                <div className="appointment-doctor-info">
                  <h3>{appointment.doctorName}</h3>
                  <p className="doctor-specialty">{appointment.doctorSpecialty}</p>
                </div>
                
                <div className="appointment-details">
                  <div className="appointment-detail">
                    <span className="detail-icon">📅</span>
                    <span className="detail-text">{formatDate(appointment.date)}</span>
                  </div>
                  <div className="appointment-detail">
                    <span className="detail-icon">🕒</span>
                    <span className="detail-text">{appointment.time}</span>
                  </div>
                  <div className="appointment-detail">
                    <span className="detail-icon">📍</span>
                    <span className="detail-text">{appointment.location}</span>
                  </div>
                  <div className="appointment-detail">
                    <span className="detail-icon">🔍</span>
                    <span className="detail-text">{appointment.reason}</span>
                  </div>
                </div>
                
                {appointment.notes && (
                  <div className="appointment-notes">
                    <p>{appointment.notes}</p>
                  </div>
                )}
              </div>
              
              <div className="appointment-card-right">
                <div className={`appointment-status status-${appointment.status}`}>
                  <span>
                    {appointment.status === "confirmed" ? "Confirmed" : 
                     appointment.status === "completed" ? "Completed" : "Cancelled"}
                  </span>
                </div>
                
                {appointment.status === "confirmed" && (
                  <div className="appointment-actions">
                    <Link 
                      to={`/reschedule/${appointment.id}`} 
                      className="btn btn-outline"
                    >
                      Reschedule
                    </Link>
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleCancelAppointment(appointment)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Appointment Modal */}
      {showCancelModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Cancel Appointment</h3>
              <button 
                className="modal-close"
                onClick={() => setShowCancelModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to cancel your appointment with {appointmentToCancel.doctorName} on {formatDate(appointmentToCancel.date)} at {appointmentToCancel.time}?</p>
              <p className="modal-warning">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-outline"
                onClick={() => setShowCancelModal(false)}
              >
                Keep Appointment
              </button>
              <button 
                className="btn btn-danger"
                onClick={confirmCancelAppointment}
              >
                Cancel Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;