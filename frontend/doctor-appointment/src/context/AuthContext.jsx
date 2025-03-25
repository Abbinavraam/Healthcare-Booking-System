import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../utils/api';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await authAPI.getCurrentUser();
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Register a new user
  const register = async (userData) => {
    try {
      setError(null);
      const response = await authAPI.register(userData);
      localStorage.setItem('token', response.token);
      setCurrentUser(response.user);
      return response;
    } catch (error) {
      setError(error.error || 'Registration failed');
      throw error;
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      setError(null);
      const response = await authAPI.login(credentials);
      localStorage.setItem('token', response.token);
      setCurrentUser(response.user);
      return response;
    } catch (error) {
      setError(error.error || 'Login failed');
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  // Update user data
  const updateUserData = async () => {
    try {
      const userData = await authAPI.getCurrentUser();
      setCurrentUser(userData);
      return userData;
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  };

  // Simulate login for demo purposes
  const simulateLogin = () => {
    const demoUser = {
      id: 'demo123',
      name: 'Demo User',
      email: 'demo@example.com',
      role: 'patient'
    };

    // Set a demo token
    localStorage.setItem('token', 'demo-token-123');
    setCurrentUser(demoUser);
    return { token: 'demo-token-123', user: demoUser };
  };

  // Context value
  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout,
    updateUserData,
    simulateLogin,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
    isDoctor: currentUser?.role === 'doctor',
    isPatient: currentUser?.role === 'patient'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;