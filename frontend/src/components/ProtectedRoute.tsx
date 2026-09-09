import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user, loading } = useAuth();

  // If user state is in transit but localStorage already has the user session, use that
  const activeUser = user || (() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  if (loading && !activeUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!activeUser) {
    return <Navigate to="/login" replace />;
  }

  // Case-insensitive role check
  if (roles && roles.length > 0) {
    const userRoleLower = String(activeUser.role || '').toLowerCase();
    const hasRole = roles.some((r) => r.toLowerCase() === userRoleLower);
    if (!hasRole) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
