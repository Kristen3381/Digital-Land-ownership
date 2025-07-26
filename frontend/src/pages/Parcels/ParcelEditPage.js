import React from 'react';
import { useParams } from 'react-router-dom';
import styles from '../Admin/Admin.module.css';

function ParcelEditPage() {
  const { id } = useParams();
  return (
    <div className={styles.adminContainer}>
      <h2 className={styles.title}>Edit Parcel: {id}</h2>
      <p>This page will allow editing of parcel details. (TODO: Implement edit form)</p>
    </div>
  );
}
export default ParcelEditPage;