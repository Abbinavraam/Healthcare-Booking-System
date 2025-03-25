// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles.css";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
    
//     try {
//       const response = await fetch("http://localhost:5000/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password })
//       });
      
//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.error || "Login failed");
//       }
      
//       localStorage.setItem("token", data.token);
//       navigate("/dashboard");
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="login-container">
//       <h2>Login</h2>
//       {error && <p className="error-message">{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>Email:</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label>Password:</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit" className="btn">Login</button>
//       </form>
//     </div>
//   );
// };

// export default Login;


import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import "../styles/styles.css";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirectMessage, setRedirectMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { login, simulateLogin, isAuthenticated } = useAuth();

  // Check if we were redirected from a protected route
  const from = location.state?.from || "/dashboard";

  // If already authenticated, redirect to the intended page
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }

    // Show a message if redirected from a protected route
    if (location.state?.from) {
      setRedirectMessage(`Please log in to access ${location.state.from}`);
    }
  }, [isAuthenticated, navigate, from, location.state]);

  // For demo purposes, let's add some test credentials
  const testCredentials = {
    email: "test@example.com",
    password: "password"
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // For demo purposes, we'll use the simulateLogin function
      // In a real app, you would use the actual login API
      if (email === testCredentials.email && password === testCredentials.password) {
        simulateLogin();
        toast.success("Login successful!");
        navigate(from, { replace: true });
      } else {
        // Try with the real API
        try {
          await login({ email, password });
          toast.success("Login successful!");
          navigate(from, { replace: true });
        } catch (apiError) {
          setError("Invalid email or password. Please try again.");
          toast.error("Login failed. Please check your credentials.");
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
      toast.error("Login failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // For demo purposes, let's add a function to auto-fill test credentials
  const fillTestCredentials = () => {
    setEmail(testCredentials.email);
    setPassword(testCredentials.password);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to access your account</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {redirectMessage && <div className="redirect-message">{redirectMessage}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-footer">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Demo helper buttons */}
          <div className="demo-buttons">
            <button
              type="button"
              className="btn btn-outline btn-block demo-btn"
              onClick={fillTestCredentials}
            >
              Use Test Credentials
            </button>
            <button
              type="button"
              className="btn btn-outline btn-block demo-btn"
              onClick={() => {
                simulateLogin();
                toast.success("Demo login successful!");
                navigate(from, { replace: true });
              }}
              style={{ marginTop: '10px', backgroundColor: '#e9ecef', borderColor: '#6c757d', color: '#495057' }}
            >
              Quick Demo Login
            </button>
          </div>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register" className="auth-link">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;