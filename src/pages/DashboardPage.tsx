import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Clock,
  Calendar,
  Award,
  Plus,
  RefreshCw,
  Search,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { applicationService } from '../services/applicationService';
import type { Application, DashboardStats } from '../types';
import { StatCard } from '../components/dashboard/StatCard';
import { RecentApplications } from '../components/dashboard/RecentApplications';
import { Button } from '../components/common/Button';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    active: 0,
    interviews: 0,
    offers: 0,
  });
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    if (!user) return;
    if (isRefresh) {
      setRefreshing(true);
    }

    try {
      const [fetchedStats, fetchedRecent] = await Promise.all([
        applicationService.getDashboardStats(user.id),
        applicationService.getRecentApplications(user.id, 5),
      ]);
      setStats(fetchedStats);
      setRecentApplications(fetchedRecent);
    } catch (err: any) {
      console.error('Error loading dashboard:', err);
      toast.error(err?.message || 'Failed to refresh dashboard data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleAddNew = () => {
    navigate('/applications?new=true');
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Actions Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Overview of your current job search progress and recent submissions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchDashboardData(true)}
            isLoading={refreshing}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />}
            title="Refresh metrics"
          >
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/search')}
            leftIcon={<Search className="w-3.5 h-3.5" />}
          >
            Check Company
          </Button>

          <Button
            size="sm"
            onClick={handleAddNew}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Application
          </Button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Applications"
          value={stats.total}
          icon={<Briefcase className="w-5 h-5" />}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
          loading={loading}
          description="All recorded submissions"
        />

        <StatCard
          label="Active Applications"
          value={stats.active}
          icon={<Clock className="w-5 h-5" />}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
          loading={loading}
          description="Applied, Assessment & Interview"
        />

        <StatCard
          label="Interviews"
          value={stats.interviews}
          icon={<Calendar className="w-5 h-5" />}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
          loading={loading}
          description="Rounds in progress"
        />

        <StatCard
          label="Offers"
          value={stats.offers}
          icon={<Award className="w-5 h-5" />}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
          loading={loading}
          description="Job offers received"
        />
      </div>

      {/* Recent Applications Section */}
      <RecentApplications
        applications={recentApplications}
        loading={loading}
        onAddNew={handleAddNew}
      />
    </div>
  );
};
