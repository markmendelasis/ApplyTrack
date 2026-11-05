import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Briefcase, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { applicationService } from '../services/applicationService';
import type {
  Application,
  ApplicationStatus,
  ApplicationFiltersState,
  CreateApplicationDTO,
  UpdateApplicationDTO,
} from '../types';
import { ApplicationFilters } from '../components/applications/ApplicationFilters';
import { ApplicationTable } from '../components/applications/ApplicationTable';
import { ApplicationFormModal } from '../components/applications/ApplicationFormModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const initialFilters: ApplicationFiltersState = {
  status: 'All',
  searchQuery: '',
  sortBy: 'date_desc',
};

export const ApplicationsPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ApplicationFiltersState>(initialFilters);

  // Modal & Dialog state
  const isNewFromQuery = searchParams.get('new') === 'true';
  const [isModalExplicitlyOpen, setIsModalExplicitlyOpen] = useState(false);
  const isModalOpen = isModalExplicitlyOpen || isNewFromQuery;

  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const [deletingApplication, setDeletingApplication] = useState<Application | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  const loadApplications = useCallback(async (showSpinner = false) => {
    if (!user) return;
    if (showSpinner) {
      setLoading(true);
    }
    try {
      const data = await applicationService.getApplications(user.id, filters);
      setApplications(data);
    } catch (err: any) {
      console.error('Error fetching applications:', err);
      toast.error(err?.message || 'Failed to load applications.');
    } finally {
      setLoading(false);
    }
  }, [user, filters]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const handleCloseModal = () => {
    setIsModalExplicitlyOpen(false);
    setEditingApplication(null);
    if (searchParams.get('new')) {
      searchParams.delete('new');
      setSearchParams(searchParams, { replace: true });
    }
  };

  const handleFilterChange = (updated: Partial<ApplicationFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  // Create or Update submission
  const handleFormSubmit = async (dto: CreateApplicationDTO | UpdateApplicationDTO) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      if (editingApplication) {
        await applicationService.updateApplication(editingApplication.id, dto as UpdateApplicationDTO);
        toast.success(`Updated application for ${dto.company_name || editingApplication.company_name}`);
      } else {
        await applicationService.createApplication(user.id, dto as CreateApplicationDTO);
        toast.success(`Application for ${dto.company_name} added!`);
      }
      handleCloseModal();
      await loadApplications();
    } catch (err: any) {
      console.error('Form submission error:', err);
      toast.error(err?.message || 'Failed to save application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick inline status change
  const handleStatusChange = async (id: string, newStatus: ApplicationStatus) => {
    setStatusUpdatingId(id);
    try {
      await applicationService.updateApplication(id, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      );
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update status.');
    } finally {
      setStatusUpdatingId(null);
    }
  };

  // Delete submission
  const handleDeleteConfirm = async () => {
    if (!deletingApplication) return;
    setIsDeleting(true);
    try {
      await applicationService.deleteApplication(deletingApplication.id);
      toast.success(`Deleted application for ${deletingApplication.company_name}`);
      setDeletingApplication(null);
      await loadApplications();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete application.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Job Applications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage, filter, and monitor all your recorded job applications.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadApplications(true)}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setEditingApplication(null);
              setIsModalExplicitlyOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Application
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <ApplicationFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        totalResults={applications.length}
      />

      {/* Content Area */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200/90 p-12 flex justify-center">
          <LoadingSpinner size="lg" label="Loading applications..." />
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="w-6 h-6 text-slate-400" />}
          title={
            filters.status !== 'All' || filters.searchQuery
              ? 'No matching applications'
              : 'No applications yet'
          }
          description={
            filters.status !== 'All' || filters.searchQuery
              ? 'Try modifying your search or status filter to see more results.'
              : 'Keep track of all your job submissions in one organized place.'
          }
          actionLabel={
            filters.status !== 'All' || filters.searchQuery
              ? 'Clear Filters'
              : 'Add Your First Application'
          }
          onAction={
            filters.status !== 'All' || filters.searchQuery
              ? handleResetFilters
              : () => {
                  setEditingApplication(null);
                  setIsModalExplicitlyOpen(true);
                }
          }
        />
      ) : (
        <ApplicationTable
          applications={applications}
          onEdit={(app) => {
            setEditingApplication(app);
            setIsModalExplicitlyOpen(true);
          }}
          onDelete={(app) => setDeletingApplication(app)}
          onStatusChange={handleStatusChange}
          statusUpdatingId={statusUpdatingId}
        />
      )}

      {/* Add / Edit Modal */}
      <ApplicationFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        application={editingApplication}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingApplication)}
        onClose={() => setDeletingApplication(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Job Application"
        message={
          deletingApplication
            ? `Are you sure you want to delete your application for ${deletingApplication.job_position} at ${deletingApplication.company_name}? This action cannot be undone.`
            : ''
        }
        confirmLabel="Yes, Delete Application"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
};
