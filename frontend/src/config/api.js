import axios from 'axios';

// Backend URL from environment variables, ensure REACT_APP_BACKEND_URL is set in your .env
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json', // Default content type for JSON requests
  },
});

// Request Interceptor: Attaches JWT token from localStorage to outgoing requests
// This directly coordinates with your backend's `protect` middleware
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Retrieve the JWT token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token as 'Bearer <token>'
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handles global error responses, particularly 401 Unauthorized
// This coordinates with your backend's authentication failure responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized access or token expired. Clearing session.');
      localStorage.removeItem('token'); // Clear the expired/invalid token
      // You might also clear user data from your AuthContext state here
      // Redirect to login page - using window.location for simplicity, but react-router-dom's navigate is better
      window.location.href = '/login';
    }
    // For other errors, re-throw so individual components can handle them
    return Promise.reject(error);
  }
);

export default api;