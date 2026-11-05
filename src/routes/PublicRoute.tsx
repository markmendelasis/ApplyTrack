import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const PublicRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner size="lg" label="Checking credentials..." />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
