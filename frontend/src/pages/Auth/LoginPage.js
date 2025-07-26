import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import Button from '../../components/Button/Button'; // Feminine touch button
import styles from './Auth.module.css'; // Page-specific styling

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Frontend validation (e.g., using Zod/Yup for more complex forms)
    if (!username || !password) {
      showNotification('Please enter both username and password.', 'warn');
      setLoading(false);
      return;
    }

    const success = await login({ username, password });
    if (success) {
      navigate('/dashboard'); // Redirect to dashboard on success
    }
    setLoading(false);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h2 className={styles.title}>Welcome Back, Cherie!</h2> {/* Feminine touch in text */}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={loading} className={styles.authButton}>
            {loading ? 'Logging In...' : 'Login'}
          </Button>
        </form>
        <p className={styles.linkText}>
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;