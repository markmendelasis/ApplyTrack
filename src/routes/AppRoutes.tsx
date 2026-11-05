import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { AuthLayout } from '../layouts/AuthLayout';
import { AppLayout } from '../layouts/AppLayout';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ApplicationsPage } from '../pages/ApplicationsPage';
import { CompanySearchPage } from '../pages/CompanySearchPage';
import { SettingsPage } from '../pages/SettingsPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Public Auth Routes */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      {/* Protected App Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/search" element={<CompanySearchPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
