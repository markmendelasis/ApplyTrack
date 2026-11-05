import React from 'react';
import { ExternalLink, Edit2, Trash2, Calendar, FileText, ChevronDown } from 'lucide-react';
import type { Application, ApplicationStatus } from '../../types';
import { APPLICATION_STATUSES } from '../../utils/constants';
import { Badge } from '../common/Badge';
import { formatDate, getRelativeDate, sanitizeUrl } from '../../utils/formatters';

interface ApplicationTableProps {
  applications: Application[];
  onEdit: (app: Application) => void;
  onDelete: (app: Application) => void;
  onStatusChange: (id: string, newStatus: ApplicationStatus) => Promise<void>;
  statusUpdatingId: string | null;
}

export const ApplicationTable: React.FC<ApplicationTableProps> = ({
  applications,
  onEdit,
  onDelete,
  onStatusChange,
  statusUpdatingId,
}) => {
  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-5">Company</th>
              <th className="py-3 px-5">Position</th>
              <th className="py-3 px-5">Applied Date</th>
              <th className="py-3 px-5">Status</th>
              <th className="py-3 px-5">Notes & Link</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {applications.map((app) => {
              const targetUrl = sanitizeUrl(app.job_url);
              const isUpdatingStatus = statusUpdatingId === app.id;

              return (
                <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Company Name */}
                  <td className="py-3.5 px-5 font-semibold text-slate-900">
                    {app.company_name}
                  </td>

                  {/* Position */}
                  <td className="py-3.5 px-5 text-slate-700 font-medium">
                    {app.job_position}
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-5 text-slate-500 whitespace-nowrap">
                    <span className="text-slate-800 font-medium">{formatDate(app.application_date)}</span>
                    <span className="text-xs text-slate-400 block">
                      {getRelativeDate(app.application_date)}
                    </span>
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3.5 px-5">
                    <div className="relative inline-block">
                      <select
                        aria-label={`Change status for ${app.company_name}`}
                        value={app.status}
                        onChange={(e) => onStatusChange(app.id, e.target.value as ApplicationStatus)}
                        disabled={isUpdatingStatus}
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10 disabled:cursor-not-allowed"
                      >
                        {APPLICATION_STATUSES.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                      <div className="flex items-center gap-1.5 cursor-pointer group">
                        <Badge status={app.status} />
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
                      </div>
                    </div>
                  </td>

                  {/* Notes & Job Link */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      {targetUrl && (
                        <a
                          href={targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 hover:underline"
                          title="Open job posting"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Listing</span>
                        </a>
                      )}
                      {app.notes && (
                        <span
                          className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md truncate max-w-[160px]"
                          title={app.notes}
                        >
                          <FileText className="w-3 h-3 shrink-0 text-slate-400" />
                          <span className="truncate">{app.notes}</span>
                        </span>
                      )}
                      {!targetUrl && !app.notes && (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEdit(app)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit application"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(app)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete application"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
        {applications.map((app) => {
          const targetUrl = sanitizeUrl(app.job_url);
          return (
            <div
              key={app.id}
              className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {app.company_name}
                  </h3>
                  <p className="text-xs font-medium text-slate-600 mt-0.5">
                    {app.job_position}
                  </p>
                </div>
                <Badge status={app.status} />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>
                  Applied {formatDate(app.application_date)} ({getRelativeDate(app.application_date)})
                </span>
              </div>

              {app.notes && (
                <div className="p-2 rounded bg-slate-50 border border-slate-100 text-xs text-slate-600 flex items-start gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                  <p className="line-clamp-2">{app.notes}</p>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  {targetUrl ? (
                    <a
                      href={targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Job Posting</span>
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400">No link provided</span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(app)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg text-xs font-medium flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(app)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-medium flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
