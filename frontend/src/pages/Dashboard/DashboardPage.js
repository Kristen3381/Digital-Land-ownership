import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../Admin/Admin.module.css'; // Reusing for container styling

function DashboardPage() {
  const { user } = useAuth();
  return (
    <div className={styles.adminContainer}>
      <h2 className={styles.title}>Welcome to Your Dashboard, {user?.username}!</h2>
      <p>This is your central hub. You can navigate using the links above.</p>
      {user?.role === 'admin' && (
        <p>As an **Admin**, you have access to user management.</p>
      )}
      {user?.role === 'user' && (
        <p>As a **User**, you can manage land parcels.</p>
      )}
      <p>Explore the features via the navigation bar.</p>
    </div>
  );
}
export default DashboardPage;