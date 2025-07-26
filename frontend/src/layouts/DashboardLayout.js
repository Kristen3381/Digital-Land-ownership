import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button/Button';
// Add more sophisticated navbar/sidebar here later
const DashboardLayout = () => {
  const { logout, user } = useAuth();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-light)', padding: 'var(--spacing-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', margin: 0, fontSize: '1.5rem' }}>
          <Link to="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>DLOMS</Link>
        </h1>
        <nav>
          <ul style={{ listStyle: 'none', display: 'flex', gap: 'var(--spacing-lg)', margin: 0 }}>
            <li><Link to="/dashboard" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>Dashboard</Link></li>
            <li><Link to="/parcels" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>Parcels</Link></li>
            <li><Link to="/parcels/register" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>Register Parcel</Link></li>
            <li><Link to="/map" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>Map View</Link></li>
            {user?.role === 'admin' && (
                <li><Link to="/admin/users" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>Admin Users</Link></li>
            )}
            <li>
              <Button onClick={logout} variant="secondary" style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-text-dark)', padding: '0.5rem 1rem', borderRadius: '4px' }}>
                Logout ({user?.username})
              </Button>
            </li>
          </ul>
        </nav>
      </header>
      <main style={{ flexGrow: 1, padding: 'var(--spacing-xl)' }}>
        <Outlet />
      </main>
      {/* Optional Footer */}
      <footer style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-light)', textAlign: 'center', padding: 'var(--spacing-md)', fontSize: '0.9rem' }}>
        © {new Date().getFullYear()} Digital Land Ownership Mapping System
      </footer>
    </div>
  );
};
export default DashboardLayout;