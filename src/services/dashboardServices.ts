import { apiClient, unwrap } from './apiClient';

export interface DashboardStat {
  total: number;
  weeklyNew: number;
  monthlyNew: number;
  changePercent: number;
}

export interface DashboardStats {
  totalUsers: DashboardStat;
  totalVerifiedReporters: DashboardStat;
  totalWatchHours: DashboardStat;
  totalNewsReported: DashboardStat;
  totalCampaigns: DashboardStat;
}

interface DashboardStatsParams {
  from?: string;
  to?: string;
}

export const dashboardServices = {
  getStats: (params?: DashboardStatsParams) =>
    unwrap<{ stats: DashboardStats }>(apiClient.get('/admin/dashboard/stats', { params })),
};
