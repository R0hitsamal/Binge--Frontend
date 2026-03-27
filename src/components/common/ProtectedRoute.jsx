import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { isAuth, loading } = useAuth();
  const location = useLocation();

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  );

  if (!isAuth) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};

export const AdminRoute = ({ children }) => {
  const { isAuth, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  );

  if (!isAuth) return <Navigate to="/login" state={{ from: location }} replace />;

  if (!isAdmin) return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      padding: 20,
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '4rem' }}>🚫</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', letterSpacing: '0.05em' }}>Access Denied</h2>
      <p style={{ color: 'var(--text-muted)' }}>You need admin privileges to view this page.</p>
      <a href="/browse" className="btn-primary">Go to Browse</a>
    </div>
  );

  return children;
};
