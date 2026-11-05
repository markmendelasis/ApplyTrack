import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { MobileNav } from '../components/layout/MobileNav';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Determine current page title
  const getPageTitle = (pathname: string): string => {
    switch (pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/applications':
        return 'Applications';
      case '/search':
        return 'Company Search';
      case '/settings':
        return 'Settings';
      default:
        return 'ApplyTrack';
    }
  };

  const title = getPageTitle(location.pathname);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block w-64 shrink-0">
        <Sidebar className="fixed inset-y-0 left-0 w-64" />
      </div>

      {/* Mobile Drawer Navigation */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title={title}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
