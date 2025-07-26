import api from '../config/api';

// Coordinates with Backend: POST /api/auth/register
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  // Backend returns: { message, userId, username, role, token }
  return response.data;
};

// Coordinates with Backend: POST /api/auth/login
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  // Backend returns: { message, userId, username, role, token }
  return response.data;
};

// Coordinates with Backend: GET /api/auth/profile
export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  // Backend returns: { userId, username, email, role, createdAt, updatedAt }
  return response.data;
};