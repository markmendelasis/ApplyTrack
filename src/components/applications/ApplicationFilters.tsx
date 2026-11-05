import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import type { ApplicationStatus, ApplicationFiltersState, SortOption } from '../../types';
import { APPLICATION_STATUSES } from '../../utils/constants';

interface ApplicationFiltersProps {
  filters: ApplicationFiltersState;
  onChange: (updated: Partial<ApplicationFiltersState>) => void;
  onReset: () => void;
  totalResults: number;
}

export const ApplicationFilters: React.FC<ApplicationFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalResults,
}) => {
  const isFiltered =
    filters.status !== 'All' || filters.searchQuery.trim() !== '' || filters.sortBy !== 'date_desc';

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search input */}
        <div className="md:col-span-5 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by company or role..."
            value={filters.searchQuery}
            onChange={(e) => onChange({ searchQuery: e.target.value })}
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-8 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => onChange({ searchQuery: '' })}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status filter */}
        <div className="md:col-span-4 flex items-center gap-2">
          <div className="relative w-full">
            <select
              value={filters.status}
              onChange={(e) => onChange({ status: e.target.value as ApplicationStatus | 'All' })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              <option value="All">All Statuses</option>
              {APPLICATION_STATUSES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort filter */}
        <div className="md:col-span-3">
          <select
            value={filters.sortBy}
            onChange={(e) => onChange({ sortBy: e.target.value as SortOption })}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            <option value="date_desc">Applied: Newest First</option>
            <option value="date_asc">Applied: Oldest First</option>
            <option value="company_asc">Company: A to Z</option>
            <option value="company_desc">Company: Z to A</option>
          </select>
        </div>
      </div>

      {/* Filter summary and reset */}
      <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <span>
            Showing <strong className="text-slate-800 font-semibold">{totalResults}</strong> {totalResults === 1 ? 'application' : 'applications'}
          </span>
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-medium text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            <span>Reset filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
