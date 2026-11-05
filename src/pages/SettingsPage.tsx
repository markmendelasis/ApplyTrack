import React from 'react';
import {
  User,
  ShieldCheck,
  Info,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Server,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';
import { formatDate } from '../utils/formatters';

export const SettingsPage: React.FC = () => {
  const { user, isConfigured, signOut } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Settings & Account
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review your account details, security configuration, and application status.
        </p>
      </div>

      {/* User Account Information */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center gap-2.5">
          <User className="w-5 h-5 text-brand-600" />
          <h2 className="text-base font-semibold text-slate-900">User Account</h2>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Email Address
              </p>
              <p className="text-sm font-semibold text-slate-900 mt-1">
                {user?.email || 'N/A'}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                User Identifier (UUID)
              </p>
              <p className="text-xs font-mono text-slate-700 mt-1 truncate" title={user?.id}>
                {user?.id || 'N/A'}
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Account Created
              </p>
              <p className="text-sm font-medium text-slate-800 mt-0.5">
                {formatDate(user?.created_at)}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Authenticated
            </span>
          </div>
        </div>
      </div>

      {/* Security & Database Status */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-semibold text-slate-900">Database & Security</h2>
        </div>

        <div className="p-5 space-y-4 text-xs sm:text-sm text-slate-600">
          <div className="flex items-start gap-3 p-3.5 rounded-lg bg-emerald-50/60 border border-emerald-200 text-emerald-950">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-emerald-900">
                Row Level Security (RLS) Active
              </p>
              <p className="text-emerald-800 text-xs mt-0.5 leading-relaxed">
                PostgreSQL database policies enforce that all queries, inserts, updates, and deletes are isolated strictly to your authenticated <code className="bg-emerald-100 px-1 py-0.5 rounded text-emerald-950 font-mono text-[11px]">auth.uid()</code>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-100">
            <Server className="w-5 h-5 text-slate-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-slate-800">
                Supabase Environment Status
              </p>
              <p className="text-slate-500 text-xs mt-0.5">
                {isConfigured ? (
                  <span className="text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Connected to remote Supabase instance
                  </span>
                ) : (
                  <span className="text-amber-600 font-medium flex items-center gap-1 mt-0.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Placeholder credentials in use. Update your .env file with your real Supabase API credentials.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* About ApplyTrack */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
        <div className="flex items-center gap-2.5 mb-3">
          <Info className="w-5 h-5 text-slate-500" />
          <h2 className="text-base font-semibold text-slate-900">About ApplyTrack</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          ApplyTrack is a personal job application management system built with React, TypeScript, Vite, Tailwind CSS, and Supabase PostgreSQL. Designed for high performance, maintainability, and clean user experience.
        </p>
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">Version 1.0.0 &bull; Developer Portfolio Project</span>
          <Button
            variant="danger"
            size="sm"
            onClick={signOut}
            leftIcon={<LogOut className="w-3.5 h-3.5" />}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};
