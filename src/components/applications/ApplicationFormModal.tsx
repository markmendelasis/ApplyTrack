import React, { useState } from 'react';
import { Building2, Briefcase, Calendar, Link as LinkIcon, FileText } from 'lucide-react';
import type { Application, ApplicationStatus, CreateApplicationDTO, UpdateApplicationDTO } from '../../types';
import { APPLICATION_STATUSES } from '../../utils/constants';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

const getTodayDate = (): string => new Date().toISOString().split('T')[0];

interface ApplicationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateApplicationDTO | UpdateApplicationDTO) => Promise<void>;
  application?: Application | null;
  isLoading?: boolean;
}

interface FormInnerProps {
  application?: Application | null;
  onClose: () => void;
  onSubmit: (data: CreateApplicationDTO | UpdateApplicationDTO) => Promise<void>;
  isLoading: boolean;
}

const FormInner: React.FC<FormInnerProps> = ({
  application,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const isEditing = Boolean(application);

  const [companyName, setCompanyName] = useState(() => application?.company_name || '');
  const [jobPosition, setJobPosition] = useState(() => application?.job_position || '');
  const [applicationDate, setApplicationDate] = useState(() =>
    application?.application_date ? application.application_date.split('T')[0] : getTodayDate()
  );
  const [status, setStatus] = useState<ApplicationStatus>(() => application?.status || 'Applied');
  const [jobUrl, setJobUrl] = useState(() => application?.job_url || '');
  const [notes, setNotes] = useState(() => application?.notes || '');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!companyName.trim()) {
      errs.companyName = 'Company name is required.';
    }
    if (!jobPosition.trim()) {
      errs.jobPosition = 'Job position is required.';
    }
    if (!applicationDate) {
      errs.applicationDate = 'Application date is required.';
    }
    if (jobUrl.trim() && !/^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(jobUrl.trim())) {
      errs.jobUrl = 'Please enter a valid URL (e.g. https://company.com/jobs/123).';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      company_name: companyName.trim(),
      job_position: jobPosition.trim(),
      application_date: applicationDate,
      status,
      job_url: jobUrl.trim() || null,
      notes: notes.trim() || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Company Name */}
      <Input
        label="Company Name"
        placeholder="e.g. Google, Stripe, Linear"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        error={errors.companyName}
        leftIcon={<Building2 className="w-4 h-4" />}
        disabled={isLoading}
        required
      />

      {/* Job Position */}
      <Input
        label="Job Position"
        placeholder="e.g. Senior Frontend Engineer, Full Stack Developer"
        value={jobPosition}
        onChange={(e) => setJobPosition(e.target.value)}
        error={errors.jobPosition}
        leftIcon={<Briefcase className="w-4 h-4" />}
        disabled={isLoading}
        required
      />

      {/* Date and Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Application Date"
          type="date"
          value={applicationDate}
          onChange={(e) => setApplicationDate(e.target.value)}
          error={errors.applicationDate}
          leftIcon={<Calendar className="w-4 h-4" />}
          disabled={isLoading}
          required
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 tracking-wide">
            Status <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
              disabled={isLoading}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50 disabled:text-slate-500"
            >
              {APPLICATION_STATUSES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Job Posting URL */}
      <Input
        label="Job Posting URL"
        placeholder="https://boards.greenhouse.io/company/jobs/..."
        value={jobUrl}
        onChange={(e) => setJobUrl(e.target.value)}
        error={errors.jobUrl}
        helperText="Optional link to original listing for future reference."
        leftIcon={<LinkIcon className="w-4 h-4" />}
        disabled={isLoading}
      />

      {/* Notes */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-700 tracking-wide flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span>Notes & Context</span>
        </label>
        <textarea
          rows={3}
          placeholder="Recruiter contact, referral details, interview stages, salary range..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={isLoading}
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50 disabled:text-slate-500"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" size="sm" isLoading={isLoading}>
          {isEditing ? 'Save Changes' : 'Create Application'}
        </Button>
      </div>
    </form>
  );
};

export const ApplicationFormModal: React.FC<ApplicationFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  application,
  isLoading = false,
}) => {
  const isEditing = Boolean(application);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Job Application' : 'Add New Application'}
      description={
        isEditing
          ? 'Update the position, status, or details for this application.'
          : 'Record a new job submission to track your recruiting journey.'
      }
      maxWidth="lg"
    >
      {isOpen && (
        <FormInner
          key={application?.id || 'new'}
          application={application}
          onClose={onClose}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      )}
    </Modal>
  );
};
