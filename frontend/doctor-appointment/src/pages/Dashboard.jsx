// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles.css";

// const Dashboard = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch("http://localhost:5000/api/doctor/appointments", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await response.json();
//         if (!response.ok) {
//           throw new Error(data.error || "Failed to fetch appointments");
//         }
//         setAppointments(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAppointments();
//   }, []);

//   return (
//     <div className="doctor-dashboard-container">
//       <h2>Doctor Dashboard</h2>
//       {loading && <p>Loading...</p>}
//       {error && <p className="error-message">{error}</p>}
//       <div className="appointments-list">
//         {appointments.length > 0 ? (
//           appointments.map((appointment) => (
//             <div key={appointment._id} className="appointment-card">
//               <h3>Patient: {appointment.patientName}</h3>
//               <p>Date & Time: {new Date(appointment.date).toLocaleString()}</p>
//               <p>Status: {appointment.status}</p>
//             </div>
//           ))
//         ) : (
//           <p>No appointments scheduled.</p>
//         )}
//       </div>
//       <button className="btn" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
//     </div>
//   );
// };

// export default Dashboard;


// import React from "react";
// import "../styles/styles.css";

// const Dashboard = () => {
//   return (
//     <div className="dashboard-container">
//       <h2>Welcome to Your Dashboard</h2>
//       <p>Manage your appointments, profile, and more.</p>
//     </div>
//   );
// };

// export default Dashboard; 

/* src/pages/Dashboard.jsx */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [upcomingAppointment, setUpcomingAppointment] = useState(null);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    doctorsAvailable: 0,
    pendingRequests: 0
  });
  const [userInfo, setUserInfo] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    role: "patient"
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching data
    const fetchDashboardData = async () => {
      try {
        // In a real app, these would be actual API calls
        setTimeout(() => {
          setAppointments([
            {
              id: 1,
              doctorName: "Dr. Sarah Johnson",
              specialty: "Cardiologist",
              date: new Date(Date.now() + 86400000 * 2), // 2 days from now
              status: "confirmed",
              image: "https://randomuser.me/api/portraits/women/76.jpg"
            },
            {
              id: 2,
              doctorName: "Dr. Michael Chen",
              specialty: "Dermatologist",
              date: new Date(Date.now() + 86400000 * 5), // 5 days from now
              status: "pending",
              image: "https://randomuser.me/api/portraits/men/32.jpg"
            },
            {
              id: 3,
              doctorName: "Dr. Emily Wilson",
              specialty: "Neurologist",
              date: new Date(Date.now() + 86400000 * 7), // 7 days from now
              status: "confirmed",
              image: "https://randomuser.me/api/portraits/women/45.jpg"
            }
          ]);

          setStats({
            totalAppointments: 12,
            doctorsAvailable: 25,
            pendingRequests: 3
          });

          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    // Find the closest upcoming appointment
    if (appointments.length > 0) {
      const confirmed = appointments.filter(app => app.status === "confirmed");
      if (confirmed.length > 0) {
        const sorted = [...confirmed].sort((a, b) => a.date - b.date);
        setUpcomingAppointment(sorted[0]);
      }
    }
  }, [appointments]);

  const handleViewAppointments = () => {
    navigate("/appointments");
  };

  const handleFindDoctor = () => {
    navigate("/doctors");
  };

  const handleUpdateProfile = () => {
    navigate("/profile");
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome, {userInfo.name}</h1>
          <p>Here's an overview of your health appointments and activities</p>
        </div>
        <div className="date-display">
          <div className="current-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
      </div>

      {upcomingAppointment && (
        <div className="upcoming-appointment">
          <div className="upcoming-header">
            <h3>Your Next Appointment</h3>
            <span className="upcoming-badge">Upcoming</span>
          </div>
          <div className="upcoming-details">
            <div className="upcoming-doctor">
              <img src={upcomingAppointment.image} alt={upcomingAppointment.doctorName} className="doctor-avatar" />
              <div className="doctor-info">
                <h4>{upcomingAppointment.doctorName}</h4>
                <p>{upcomingAppointment.specialty}</p>
              </div>
            </div>
            <div className="upcoming-time">
              <div className="date-badge">
                <span className="day">{formatDate(upcomingAppointment.date)}</span>
                <span className="time">{formatTime(upcomingAppointment.date)}</span>
              </div>
            </div>
            <div className="upcoming-actions">
              <button className="btn-primary">Join Video Call</button>
              <button className="btn-outline">Reschedule</button>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-main">
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <div className="card-icon appointments-icon">
              <i className="fas fa-calendar-check"></i>
            </div>
            <div className="card-content">
              <h3>My Appointments</h3>
              <p>View and manage your booked appointments.</p>
              <button className="btn-primary" onClick={handleViewAppointments}>View Appointments</button>
            </div>
          </div>
          <div className="dashboard-card">
            <div className="card-icon doctors-icon">
              <i className="fas fa-user-md"></i>
            </div>
            <div className="card-content">
              <h3>Find a Doctor</h3>
              <p>Browse and book an appointment with a specialist.</p>
              <button className="btn-primary" onClick={handleFindDoctor}>Find Doctor</button>
            </div>
          </div>
          <div className="dashboard-card">
            <div className="card-icon profile-icon">
              <i className="fas fa-user-cog"></i>
            </div>
            <div className="card-content">
              <h3>Manage Profile</h3>
              <p>Update your personal details and preferences.</p>
              <button className="btn-primary" onClick={handleUpdateProfile}>Update Profile</button>
            </div>
          </div>
        </div>

        <div className="dashboard-right">
          <div className="dashboard-stats">
            <h3>Dashboard Statistics</h3>
            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-icon total-icon">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <div className="stat-details">
                  <h4>Total Appointments</h4>
                  <p>{stats.totalAppointments}</p>
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-icon doctors-icon">
                  <i className="fas fa-stethoscope"></i>
                </div>
                <div className="stat-details">
                  <h4>Doctors Available</h4>
                  <p>{stats.doctorsAvailable}</p>
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-icon pending-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="stat-details">
                  <h4>Pending Requests</h4>
                  <p>{stats.pendingRequests}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="recent-activity">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon booked-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="activity-content">
                  <p>Appointment confirmed with Dr. Sarah Johnson</p>
                  <span className="activity-time">2 days ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon profile-icon">
                  <i className="fas fa-user-edit"></i>
                </div>
                <div className="activity-content">
                  <p>Updated your profile information</p>
                  <span className="activity-time">5 days ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon completed-icon">
                  <i className="fas fa-clipboard-check"></i>
                </div>
                <div className="activity-content">
                  <p>Completed appointment with Dr. Robert Smith</p>
                  <span className="activity-time">1 week ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="health-tips">
        <h3>Health Tips & Reminders</h3>
        <div className="tips-container">
          <div className="tip-card">
            <div className="tip-icon">
              <i className="fas fa-heartbeat"></i>
            </div>
            <h4>Regular Check-ups</h4>
            <p>Remember to schedule your annual physical examination to maintain optimal health.</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">
              <i className="fas fa-apple-alt"></i>
            </div>
            <h4>Healthy Diet</h4>
            <p>Maintain a balanced diet rich in fruits, vegetables, and whole grains for better health.</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">
              <i className="fas fa-running"></i>
            </div>
            <h4>Stay Active</h4>
            <p>Aim for at least 30 minutes of moderate exercise most days of the week.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
