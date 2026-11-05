import React from 'react';
import type { ApplicationStatus } from '../../types';
import { STATUS_CONFIG_MAP } from '../../utils/constants';

interface BadgeProps {
  status: ApplicationStatus;
  size?: 'sm' | 'md';
  showDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ status, size = 'sm', showDot = true }) => {
  const config = STATUS_CONFIG_MAP[status] || {
    label: status,
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    dotClass: 'bg-slate-400',
  };

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 gap-1.5',
    md: 'text-xs sm:text-sm px-3 py-1 gap-2',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ring-1 ring-inset ${config.badgeClass} ${sizeClasses[size]}`}
    >
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dotClass}`}
          aria-hidden="true"
        />
      )}
      <span>{config.label}</span>
    </span>
  );
};
