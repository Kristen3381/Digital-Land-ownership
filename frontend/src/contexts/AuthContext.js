import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, getProfile as apiGetProfile } from '../services/authService';
import { useNotification } from './NotificationContext'; // For displaying notifications

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true); // To check if auth state is loaded
  const { showNotification } = useNotification();

  // Effect to load user profile if token exists on app start
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const profile = await apiGetProfile(); // Fetch full profile from backend
          setUser(profile);
          showNotification('Welcome back!', 'success');
        } catch (error) {
          console.error('Failed to load user profile:', error);
          localStorage.removeItem('token'); // Clear invalid token
          setToken(null);
          setUser(null);
          showNotification('Session expired or invalid. Please log in again.', 'error');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token, showNotification]);

  const login = async (credentials) => {
    try {
      const data = await apiLogin(credentials);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser({ userId: data.userId, username: data.username, role: data.role, email: data.email }); // Store essential user data
      showNotification('Logged in successfully!', 'success');
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      const backendMsg = error.response?.data?.message || (error.response?.data?.errors?.[0]?.msg) || error.response?.data?.msg;
      showNotification(backendMsg || 'Login failed. Please check your credentials.', 'error');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const data = await apiRegister(userData);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser({ userId: data.userId, username: data.username, role: data.role, email: data.email });
      showNotification('Registration successful! Welcome!', 'success');
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      const backendMsg = error.response?.data?.message || (error.response?.data?.errors?.[0]?.msg) || error.response?.data?.msg;
      showNotification(backendMsg || 'Registration failed. User may already exist.', 'error');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    showNotification('Logged out successfully.', 'info');
  };

  const hasRole = (roles) => {
    if (!user || !user.role) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, hasRole, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);