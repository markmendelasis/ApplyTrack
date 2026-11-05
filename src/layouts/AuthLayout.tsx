import React from 'react';
import { Outlet } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ConfigWarningBanner } from '../components/common/ConfigWarningBanner';

export const AuthLayout: React.FC = () => {
  const { isConfigured } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-brand-500 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Briefcase className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            Apply<span className="text-brand-600">Track</span>
          </span>
        </div>
        <p className="mt-2 text-center text-sm text-slate-500 font-normal">
          Personal Job Application Tracker
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {!isConfigured && <ConfigWarningBanner />}

        <div className="bg-white py-8 px-6 sm:px-10 shadow-sm border border-slate-200/80 rounded-2xl">
          <Outlet />
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Secured with Supabase Authentication & PostgreSQL Row Level Security
        </p>
      </div>
    </div>
  );
};
