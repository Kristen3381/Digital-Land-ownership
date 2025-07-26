import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext';
import { getAllUsers, deleteUser } from '../../services/adminService'; // Admin API calls
import { useAuth } from '../../contexts/AuthContext'; // To check current user ID (prevent self-deletion)
import Button from '../../components/Button/Button';
import styles from './Admin.module.css'; // Admin-specific styling

function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();
  const { user: currentUser } = useAuth(); // Get currently logged-in user
  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllUsers(); // API call to backend
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      showNotification(error.response?.data?.msg || 'Failed to load users.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (userId, username) => {
    if (currentUser && currentUser.userId === userId) {
      showNotification("You cannot delete your own account here. Please contact another admin.", "warn");
      return;
    }

    if (window.confirm(`Are you sure you want to delete user: ${username}? This action cannot be undone.`)) {
      try {
        await deleteUser(userId); // API call to backend
        showNotification(`User '${username}' deleted successfully!`, 'success');
        fetchUsers(); // Refresh the list
      } catch (error) {
        console.error('Failed to delete user:', error);
        showNotification(error.response?.data?.msg || 'Failed to delete user.', 'error');
      }
    }
  };

  if (loading) {
    return <div className={styles.adminContainer}>Loading users...</div>;
  }

  return (
    <div className={styles.adminContainer}>
      <h2 className={styles.title}>User Management</h2>
      <div className={styles.actionHeader}>
        <Button onClick={() => navigate('/admin/users/new')} variant="primary">
          Add New User
        </Button>
      </div>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Registered On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className={styles.actions}>
                  <Button
                    onClick={() => navigate(`/admin/users/${user._id}/edit`)}
                    variant="secondary"
                    className={styles.actionButton}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(user._id, user.username)}
                    variant="danger"
                    className={styles.actionButton}
                    disabled={currentUser && currentUser.userId === user._id}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserManagementPage;