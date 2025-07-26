import React from 'react';
import { useParams } from 'react-router-dom';
import styles from '../Admin/Admin.module.css';

function ParcelDetailsPage() {
  const { id } = useParams();
  return (
    <div className={styles.adminContainer}>
      <h2 className={styles.title}>Parcel Details for ID: {id}</h2>
      <p>This page will show detailed information about a specific parcel. (TODO: Fetch parcel by ID)</p>
    </div>
  );
}
export default ParcelDetailsPage;