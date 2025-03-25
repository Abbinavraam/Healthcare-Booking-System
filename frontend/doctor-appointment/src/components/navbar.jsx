// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "../styles.css";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (
//     <nav className="navbar">
//       <h2>Healthcare Booking</h2>
//       <div className="nav-links">
//         <Link to="/">Home</Link>
//         <Link to="/doctors">Doctors</Link>
//         <Link to="/appointments">Appointments</Link>
//         <button className="btn logout-btn" onClick={handleLogout}>Logout</button>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import "../styles/styles.css";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, simulateLogin } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  // For demo purposes - quick login without form
  const handleQuickLogin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    simulateLogin();
    toast.success("Demo login successful!");
    navigate("/dashboard");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-link">
          <h2>Healthcare Booking</h2>
        </Link>
      </div>
      <div className="navbar-menu">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/doctors" className={`nav-link ${location.pathname.includes('/doctor') ? 'active' : ''}`}>
              Doctors
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link to="/appointments" className={`nav-link ${location.pathname === '/appointments' ? 'active' : ''}`}>
                  Appointments
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <button className="login-btn" onClick={handleLogin}>
                  Login
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="login-btn"
                  onClick={handleQuickLogin}
                  style={{ marginLeft: '10px', backgroundColor: '#e9ecef', borderColor: '#6c757d', color: '#495057' }}
                >
                  Demo Login
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;