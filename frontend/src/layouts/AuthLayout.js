import React from 'react';
import { Outlet } from 'react-router-dom';
// You can add global auth styling or components here
const AuthLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--color-background)' }}>
      <Outlet />
    </div>
  );
};
export default AuthLayout;