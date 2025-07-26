import React from 'react';
import { useParams } from 'react-router-dom';
import styles from '../Admin/Admin.module.css';

function EditUserPage() {
  const { userId } = useParams();
  return (
    <div className={styles.adminContainer}>
      <h2 className={styles.title}>Edit User: {userId}</h2>
      <p>This page will allow editing of user details. (TODO: Implement user edit form)</p>
    </div>
  );
}
export default EditUserPage;