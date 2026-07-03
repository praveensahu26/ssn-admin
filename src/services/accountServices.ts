import { apiClient, unwrap } from './apiClient';

export type AccountRole = 'user' | 'reporter';
export type AccountListTab =
  | 'overview'
  | 'all'
  | 'active'
  | 'inactive'
  | 'reported'
  | 'blocked'
  | 'suspended'
  | 'verification';

export interface AccountStat {
  total: number;
  weeklyNew: number;
  monthlyNew: number;
  changePercent: number;
}

export interface AccountStats {
  total: AccountStat;
  active: AccountStat;
  blocked: AccountStat;
}

export interface AdminAccount {
  id: string;
  name: string;
  username: string;
  email: string;
  phoneNumber: string | null;
  profileImage?: string;
  profilePicture?: string;
  coverImage?: string | null;
  bio?: string | null;
  socialLink?: string | null;
  link?: string | null;
  location?: string;
  locationDetails?: {
    city: string | null;
    state: string | null;
    country: string;
  };
  role: AccountRole | 'reporter_pending';
  status: {
    value: string;
    reason?: string | null;
  };
  newsReportCount: number;
  activeCampaignCount: number;
  isReported: boolean;
  reportCount?: number;
  gender?: string | null;
  journalistId?: string | null;
  verificationRequest?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AccountListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface AccountListParams {
  role: AccountRole;
  tab?: AccountListTab;
  search?: string;
  page?: number;
  limit?: number;
}

export const accountServices = {
  getStats: (role: AccountRole) =>
    unwrap<{ stats: AccountStats }>(
      apiClient.get('/admin/accounts/stats', { params: { role } })
    ),

  listAccounts: (params: AccountListParams) =>
    unwrap<{ accounts: AdminAccount[]; meta: AccountListMeta }>(
      apiClient.get('/admin/accounts', { params })
    ),

  deleteAccount: (id: string) =>
    unwrap(apiClient.delete(`/admin/accounts/${id}`)),

  restoreAccount: (id: string) =>
    unwrap<{ account: AdminAccount }>(
      apiClient.post(`/admin/accounts/${id}/restore`, {})
    ),

  bulkUpdateStatus: (ids: string[], status: string) =>
    unwrap(
      apiClient.post('/admin/accounts/bulk-status', { ids, status })
    ),
};
