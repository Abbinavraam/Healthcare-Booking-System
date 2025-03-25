import axios from 'axios';

// Create an axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include the auth token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle demo mode for development without backend
    if (!error.response && error.message === 'Network Error') {
      console.warn('Network error detected. Using demo mode.');

      // For demo purposes, we'll simulate successful responses
      const url = error.config.url;
      const method = error.config.method;

      // If this is an authentication request, return a demo response
      if (url.includes('/auth/login') && method === 'post') {
        return Promise.resolve({
          data: {
            token: 'demo-token-123',
            user: {
              id: 'demo123',
              name: 'Demo User',
              email: 'demo@example.com',
              role: 'patient'
            }
          }
        });
      }
    }

    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Registration failed' };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Login failed' };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get user data' };
    }
  }
};

// Doctor API calls
export const doctorAPI = {
  // Get all doctors
  getAllDoctors: async () => {
    try {
      const response = await api.get('/doctors');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch doctors' };
    }
  },

  // Get doctor by ID
  getDoctorById: async (doctorId) => {
    try {
      const response = await api.get(`/doctors/${doctorId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch doctor details' };
    }
  },

  // Update doctor profile (for doctors)
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/doctors/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update profile' };
    }
  },

  // Add a review for a doctor
  addReview: async (doctorId, reviewData) => {
    try {
      const response = await api.post(`/doctors/${doctorId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to add review' };
    }
  }
};

// Appointment API calls
export const appointmentAPI = {
  // Book an appointment
  bookAppointment: async (appointmentData) => {
    try {
      const response = await api.post('/appointments/book', appointmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to book appointment' };
    }
  },

  // Get patient appointments
  getPatientAppointments: async () => {
    try {
      const response = await api.get('/appointments/patient');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch appointments' };
    }
  },

  // Get doctor appointments
  getDoctorAppointments: async () => {
    try {
      const response = await api.get('/appointments/doctor');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch appointments' };
    }
  },

  // Get appointment by ID
  getAppointmentById: async (appointmentId) => {
    try {
      const response = await api.get(`/appointments/${appointmentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch appointment details' };
    }
  },

  // Cancel an appointment
  cancelAppointment: async (appointmentId) => {
    try {
      const response = await api.put(`/appointments/cancel/${appointmentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to cancel appointment' };
    }
  },

  // Confirm an appointment (Doctor/Admin)
  confirmAppointment: async (appointmentId) => {
    try {
      const response = await api.put(`/appointments/confirm/${appointmentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to confirm appointment' };
    }
  },

  // Mark appointment as completed (Doctor/Admin)
  completeAppointment: async (appointmentId) => {
    try {
      const response = await api.put(`/appointments/complete/${appointmentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to complete appointment' };
    }
  },

  // Get available time slots for a doctor on a specific date
  getAvailableTimeSlots: async (doctorId, date) => {
    try {
      const response = await api.get(`/appointments/slots/${doctorId}/${date}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch available time slots' };
    }
  }
};

export default {
  auth: authAPI,
  doctors: doctorAPI,
  appointments: appointmentAPI
};