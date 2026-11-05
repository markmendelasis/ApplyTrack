import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Search,
  Settings,
  LogOut,
  Building2,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '', onNavigate }) => {
  const { signOut, user } = useAuth();

  const navItems = [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Applications', to: '/applications', icon: Briefcase },
    { label: 'Company Search', to: '/search', icon: Search },
    { label: 'Settings', to: '/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    if (onNavigate) onNavigate();
    await signOut();
  };

  return (
    <aside className={`flex flex-col h-full bg-white border-r border-slate-200/90 ${className}`}>
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-3">
        <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-sm shadow-brand-500/20">
          <Building2 className="w-4 h-4 stroke-[2.2]" />
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Apply<span className="text-brand-600">Track</span>
          </span>
          <span className="text-[10px] font-medium block text-slate-400 tracking-wider uppercase -mt-0.5">
            Tracker
          </span>
        </div>
      </div>

      {/* Main Nav Links */}
      <div className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Menu
          </p>
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-brand-600' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User profile & Logout */}
      <div className="p-3 border-t border-slate-100 space-y-2">
        <div className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-100/80">
          <p className="text-xs font-semibold text-slate-800 truncate">
            {user?.email || 'Authenticated User'}
          </p>
          <span className="inline-block mt-0.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
            Active Session
          </span>
        </div>

        <button
          onClick={handleLogout}
          type="button"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0 text-rose-500" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
