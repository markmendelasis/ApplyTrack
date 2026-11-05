import React from 'react';

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  loading?: boolean;
  description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  iconBgColor,
  iconColor,
  loading = false,
  description,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs transition-all hover:shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconBgColor} ${iconColor}`}>
          {icon}
        </div>
      </div>
      <div className="mt-3">
        {loading ? (
          <div className="h-8 w-16 bg-slate-100 rounded animate-pulse" />
        ) : (
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </div>
        )}
        {description && (
          <p className="text-xs text-slate-400 mt-1 font-normal">{description}</p>
        )}
      </div>
    </div>
  );
};
