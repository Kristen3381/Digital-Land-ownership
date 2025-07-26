import React from 'react';
import styles from '../Admin/Admin.module.css'; // Reusing for container styling

function ParcelListPage() {
  return (
    <div className={styles.adminContainer}>
      <h2 className={styles.title}>All Registered Parcels</h2>
      <p>This page will list all registered parcels. (TODO: Fetch and display parcels from backend)</p>
    </div>
  );
}
export default ParcelListPage;