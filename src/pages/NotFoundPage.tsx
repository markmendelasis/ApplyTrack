import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md p-8 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
        <p className="text-4xl font-extrabold text-brand-600">404</p>
        <h1 className="text-xl font-bold text-slate-900 mt-2">Page Not Found</h1>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link to="/dashboard">
            <Button size="sm" leftIcon={<Home className="w-4 h-4" />}>
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
