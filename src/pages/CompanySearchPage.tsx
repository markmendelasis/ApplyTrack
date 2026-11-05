import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Building2,
  Calendar,
  ExternalLink,
  Plus,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { applicationService } from '../services/applicationService';
import { useDebounce } from '../hooks/useDebounce';
import type { Application, CreateApplicationDTO, UpdateApplicationDTO } from '../types';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ApplicationFormModal } from '../components/applications/ApplicationFormModal';
import { formatDate, getRelativeDate, sanitizeUrl } from '../utils/formatters';

const getTodayDate = (): string => new Date().toISOString().split('T')[0];

export const CompanySearchPage: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [results, setResults] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Modal for adding a new application (optionally with pre-filled company name)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prefilledCompany, setPrefilledCompany] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const runSearch = async () => {
      if (!user) return;
      const query = debouncedSearchTerm.trim();

      if (!query) {
        setResults([]);
        setHasSearched(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      setHasSearched(true);
      try {
        const data = await applicationService.searchByCompany(user.id, query);
        setResults(data);
      } catch (err: any) {
        console.error('Search error:', err);
        toast.error(err?.message || 'Failed to search companies.');
      } finally {
        setLoading(false);
      }
    };

    runSearch();
  }, [debouncedSearchTerm, user]);

  // Group applications by company name (preserving case variation while grouping uniformly)
  const groupedResults = useMemo(() => {
    const groups: { [key: string]: { companyName: string; applications: Application[] } } = {};

    results.forEach((app) => {
      const key = app.company_name.toLowerCase().trim();
      if (!groups[key]) {
        groups[key] = {
          companyName: app.company_name,
          applications: [],
        };
      }
      groups[key].applications.push(app);
    });

    return Object.values(groups);
  }, [results]);

  const handleOpenAddModal = (companyToPrefill = '') => {
    setPrefilledCompany(companyToPrefill || searchTerm.trim());
    setIsModalOpen(true);
  };

  const handleCreateApplication = async (dto: CreateApplicationDTO | UpdateApplicationDTO) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await applicationService.createApplication(user.id, dto as CreateApplicationDTO);
      toast.success(`Application for ${dto.company_name} successfully recorded!`);
      setIsModalOpen(false);
      // Re-run search if user applied to matching company
      if (debouncedSearchTerm.trim()) {
        const updated = await applicationService.searchByCompany(user.id, debouncedSearchTerm.trim());
        setResults(updated);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to record application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Company Search
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Check if you&apos;ve previously submitted an application to any company before applying again.
        </p>
      </div>

      {/* Prominent Search Hero Box */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
        <label htmlFor="company-search-input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Search by Company Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            id="company-search-input"
            type="text"
            autoFocus
            placeholder="Type a company name (e.g. Netflix, Amazon, Figma)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white pl-12 pr-10 py-3 text-base text-slate-900 placeholder-slate-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              aria-label="Clear company search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-[11px] text-slate-400">
          Case-insensitive search. Partial names like <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">micro</span> match <span className="font-semibold text-slate-700">Microsoft</span>.
        </p>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="py-12 flex justify-center">
          <LoadingSpinner size="md" label="Searching your application history..." />
        </div>
      )}

      {/* Results Section */}
      {!loading && hasSearched && (
        <div className="space-y-4">
          {groupedResults.length > 0 ? (
            <>
              {/* Clear confirmation banner */}
              <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-900 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold">
                    Previous Applications Found
                  </p>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    You have previously applied to <span className="font-semibold">{groupedResults.length}</span> matching {groupedResults.length === 1 ? 'company' : 'companies'}. Review your past roles and statuses below.
                  </p>
                </div>
              </div>

              {/* Grouped Company Cards */}
              {groupedResults.map((group) => (
                <div
                  key={group.companyName.toLowerCase()}
                  className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden"
                >
                  {/* Company Header */}
                  <div className="p-5 bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-100/70 border border-brand-200/80 flex items-center justify-center text-brand-700 font-bold text-lg shrink-0">
                        {group.companyName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-bold text-slate-900">
                            {group.companyName}
                          </h2>
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Previously Applied
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {group.applications.length} {group.applications.length === 1 ? 'recorded application' : 'recorded applications'}
                        </p>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenAddModal(group.companyName)}
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                    >
                      Add Another Role
                    </Button>
                  </div>

                  {/* List of Previous Applications for this Company */}
                  <div className="divide-y divide-slate-100">
                    {group.applications.map((app) => {
                      const targetUrl = sanitizeUrl(app.job_url);
                      return (
                        <div key={app.id} className="p-4 sm:p-5 hover:bg-slate-50/40 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <h3 className="text-sm font-semibold text-slate-900">
                                {app.job_position}
                              </h3>
                              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>Applied on {formatDate(app.application_date)}</span>
                                <span className="text-slate-400">({getRelativeDate(app.application_date)})</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <Badge status={app.status} size="sm" />
                              {targetUrl && (
                                <a
                                  href={targetUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 hover:underline"
                                  title="Original Job Posting"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  <span>Posting</span>
                                </a>
                              )}
                            </div>
                          </div>

                          {app.notes && (
                            <div className="mt-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-start gap-2">
                              <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                              <p className="leading-relaxed">{app.notes}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </>
          ) : (
            /* Empty State: No previous applications found */
            <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-10 text-center shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200/60 ring-8 ring-amber-50/50">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                No previous applications found
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6 leading-relaxed">
                You haven&apos;t recorded any applications for &ldquo;<span className="font-semibold text-slate-800">{searchTerm.trim()}</span>&rdquo; yet. It looks like you haven&apos;t applied here!
              </p>
              <Button
                onClick={() => handleOpenAddModal(searchTerm.trim())}
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Record Application for &ldquo;{searchTerm.trim()}&rdquo;
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Initial Guidance State before typing */}
      {!loading && !hasSearched && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 sm:p-12 text-center text-slate-500">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">
            Search your complete application history
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
            Quickly check whether you&apos;ve applied to a company before, view all past positions, and avoid duplicate inquiries.
          </p>
        </div>
      )}

      {/* Add Application Modal with prefilled company */}
      <ApplicationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateApplication}
        application={
          prefilledCompany
            ? ({
                id: '',
                user_id: user?.id || '',
                company_name: prefilledCompany,
                job_position: '',
                application_date: getTodayDate(),
                status: 'Applied',
                created_at: '',
                updated_at: '',
              } as Application)
            : null
        }
        isLoading={isSubmitting}
      />
    </div>
  );
};
