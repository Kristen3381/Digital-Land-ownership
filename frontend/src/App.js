import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import ParcelListPage from './pages/Parcels/ParcelListPage';
import ParcelRegistrationPage from './pages/Parcels/ParcelRegistrationPage';
import ParcelDetailsPage from './pages/Parcels/ParcelDetailsPage';
import ParcelEditPage from './pages/Parcels/ParcelEditPage';
import MapViewPage from './pages/MapView/MapViewPage';
import UserManagementPage from './pages/Admin/UserManagementPage';
import AddUserPage from './pages/Admin/AddUserPage';
import EditUserPage from './pages/Admin/EditUserPage';

// Reusable Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes - Use AuthLayout */}
            <Route path="/" element={<AuthLayout />}>
              <Route index element={<Navigate to="/login" replace />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>

            {/* Protected Routes - All authenticated users */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<DashboardLayout />}>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="profile" element={<div>User Profile Page (TODO)</div>} />

                {/* Parcel Management Routes */}
                <Route path="parcels" element={<ParcelListPage />} />
                <Route path="parcels/register" element={<ParcelRegistrationPage />} />
                <Route path="parcels/:id" element={<ParcelDetailsPage />} />
                <Route path="parcels/:id/edit" element={<ParcelEditPage />} />
                <Route path="map" element={<MapViewPage />} /> {/* Example for a map page */}
              </Route>
            </Route>

            {/* Admin Protected Routes - Require 'admin' role */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/" element={<DashboardLayout />}> {/* Reuse dashboard layout */}
                <Route path="admin/users" element={<UserManagementPage />} />
                <Route path="admin/users/new" element={<AddUserPage />} />
                <Route path="admin/users/:userId/edit" element={<EditUserPage />} />
              </Route>
            </Route>

            {/* Catch-all for unknown routes */}
            <Route path="*" element={<div>404 - Not Found</div>} />
          </Routes>
        </Router>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;