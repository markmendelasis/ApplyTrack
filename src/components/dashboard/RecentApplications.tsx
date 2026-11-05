import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight, Briefcase } from 'lucide-react';
import type { Application } from '../../types';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { formatDate, getRelativeDate, sanitizeUrl } from '../../utils/formatters';

interface RecentApplicationsProps {
  applications: Application[];
  loading: boolean;
  onAddNew: () => void;
}

export const RecentApplications: React.FC<RecentApplicationsProps> = ({
  applications,
  loading,
  onAddNew,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Recent Applications</h2>
          <p className="text-xs text-slate-500 mt-0.5">Your latest job submissions</p>
        </div>
        {applications.length > 0 && (
          <Link
            to="/applications"
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {loading ? (
        <div className="p-6 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-slate-50 last:border-0">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-100 rounded w-1/3 animate-pulse" />
                <div className="h-3 bg-slate-50 rounded w-1/4 animate-pulse" />
              </div>
              <div className="h-6 w-20 bg-slate-100 rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="p-6">
          <EmptyState
            icon={<Briefcase className="w-6 h-6 text-slate-400" />}
            title="No applications tracked yet"
            description="Start recording your job applications to track progress, monitor statuses, and keep a clean application history."
            actionLabel="Add Your First Application"
            onAction={onAddNew}
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-5">Company</th>
                <th className="py-3 px-5">Position</th>
                <th className="py-3 px-5">Applied Date</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Job Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
              {applications.map((app) => {
                const targetUrl = sanitizeUrl(app.job_url);
                return (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-slate-900">
                      {app.company_name}
                    </td>
                    <td className="py-3.5 px-5 text-slate-600">
                      {app.job_position}
                    </td>
                    <td className="py-3.5 px-5 text-slate-500">
                      <span className="font-medium text-slate-700">{formatDate(app.application_date)}</span>
                      <span className="text-[11px] text-slate-400 block sm:inline sm:ml-1.5">
                        ({getRelativeDate(app.application_date)})
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <Badge status={app.status} />
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      {targetUrl ? (
                        <a
                          href={targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-slate-500 hover:text-brand-600 font-medium text-xs transition-colors"
                          title="Open job posting"
                        >
                          <span>Posting</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
