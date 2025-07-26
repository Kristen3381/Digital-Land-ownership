import api from '../config/api';

// Coordinates with Backend: GET /api/admin/users
export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  // Backend returns: Array of user objects (without passwords)
  return response.data;
};

// Coordinates with Backend: POST /api/admin/users
export const createUser = async (userData) => {
  const response = await api.post('/admin/users', userData);
  // Backend returns: { message, user: { ... } }
  return response.data;
};

// Coordinates with Backend: PUT /api/admin/users/:id
export const updateUser = async (userId, updateData) => {
  const response = await api.put(`/admin/users/${userId}`, updateData);
  // Backend returns: { message, user: { ... } }
  return response.data;
};

// Coordinates with Backend: DELETE /api/admin/users/:id
export const deleteUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`);
  // Backend returns: { message }
  return response.data;
};