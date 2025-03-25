// // src/App.js
// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import Doctors from "./pages/Doctors";
// import BookAppointment from "./pages/BookAppointment";
// import Appointments from "./pages/Appointments";
// import AdminPanel from "./pages/AdminPanel";
// import Navbar from "./components/Navbar";
// import ProtectedRoute from "./components/ProtectedRoute";
// import "./styles/styles.css";

// const App = () => {
//   return (
//     <div>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route
//           path="/dashboard"
//           element={<ProtectedRoute element={<Dashboard />} />}
//         />
//         <Route
//           path="/doctors"
//           element={<ProtectedRoute element={<Doctors />} />}
//         />
//         <Route
//           path="/book-appointment"
//           element={<ProtectedRoute element={<BookAppointment />} />}
//         />
//         <Route
//           path="/appointments"
//           element={<ProtectedRoute element={<Appointments />} />}
//         />
//         <Route
//           path="/admin"
//           element={<ProtectedRoute element={<AdminPanel />} />}
//         />
//       </Routes>
//     </div>
//   );
// };

// export default App;


import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Doctors from "./pages/Doctors";
import DoctorProfile from "./pages/DoctorProfile";
import BookAppointment from "./pages/BookAppointment";
import Appointments from "./pages/Appointments";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import "./styles/styles.css";

// Protected Route Component with better UX
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const location = useLocation();
  const { isAuthenticated, currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login but remember where the user was trying to go
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If a specific role is required, check if the user has it
  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loader">
        <div className="loader-spinner"></div>
        <p>Loading Healthcare Booking System...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctor/:doctorId" element={<DoctorProfile />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/book-appointment/:doctorId"
              element={
                <ProtectedRoute requiredRole="patient">
                  <BookAppointment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <ProtectedRoute>
                  <Appointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reschedule/:appointmentId"
              element={
                <ProtectedRoute requiredRole="patient">
                  <BookAppointment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPanel />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
