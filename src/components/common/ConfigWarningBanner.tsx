import React from 'react';
import { AlertTriangle, KeyRound } from 'lucide-react';

export const ConfigWarningBanner: React.FC = () => {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-amber-900 shadow-xs mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
        <div className="space-y-1 text-xs sm:text-sm">
          <p className="font-semibold text-amber-900">Supabase Connection Required</p>
          <p className="text-amber-800 leading-relaxed">
            Please configure your Supabase credentials in the <code className="bg-amber-100 px-1.5 py-0.5 rounded text-amber-950 font-mono text-xs">.env</code> file:
          </p>
          <div className="mt-2 bg-amber-900/10 p-2.5 rounded-lg font-mono text-[11px] sm:text-xs text-amber-950 overflow-x-auto space-y-0.5">
            <div>VITE_SUPABASE_URL=https://your-project-id.supabase.co</div>
            <div>VITE_SUPABASE_ANON_KEY=your-anon-key-here</div>
          </div>
          <p className="text-[11px] text-amber-700 pt-1 flex items-center gap-1">
            <KeyRound className="w-3.5 h-3.5 shrink-0" />
            Find these under your Supabase Dashboard &rarr; <strong>Project Settings &rarr; API</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
