import type { ApplicationStatus } from '../types';

export const APPLICATION_STATUSES: {
  value: ApplicationStatus;
  label: string;
  badgeClass: string;
  dotClass: string;
}[] = [
  {
    value: 'Applied',
    label: 'Applied',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-600/10',
    dotClass: 'bg-blue-500',
  },
  {
    value: 'Assessment',
    label: 'Assessment',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-600/10',
    dotClass: 'bg-amber-500',
  },
  {
    value: 'Interview',
    label: 'Interview',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-600/10',
    dotClass: 'bg-purple-500',
  },
  {
    value: 'Offer',
    label: 'Offer',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/10',
    dotClass: 'bg-emerald-500',
  },
  {
    value: 'Rejected',
    label: 'Rejected',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-600/10',
    dotClass: 'bg-rose-500',
  },
  {
    value: 'Withdrawn',
    label: 'Withdrawn',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-600/10',
    dotClass: 'bg-slate-400',
  },
];

// Active statuses for calculating the "Active Applications" metric
export const ACTIVE_STATUSES: ApplicationStatus[] = ['Applied', 'Assessment', 'Interview'];

export const STATUS_CONFIG_MAP = APPLICATION_STATUSES.reduce(
  (acc, item) => {
    acc[item.value] = item;
    return acc;
  },
  {} as Record<ApplicationStatus, (typeof APPLICATION_STATUSES)[number]>
);
