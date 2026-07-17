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
    reasonTitle?: string | null;
    reasonDescription?: string | null;
  };
  newsReportCount: number;
  activeCampaignCount: number;
  isReported: boolean;
  reportCount?: number;
  isVerified?: boolean;
  gender?: string | null;
  journalistId?: string | null;
  verificationRequest?: string | null;
  createdAt: string;
  updatedAt: string;
  followersCount?: number;
  followingCount?: number;
  followers?: any[];
  following?: any[];
  postsCount?: number;
  campaignsCount?: number;
  connectyCubeUserId?: number;
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

  getAccount: (id: string) =>
    unwrap<{ account: AdminAccount }>(
      apiClient.get(`/admin/accounts/${id}`)
    ),

  getAccountPosts: (id: string, params: { page?: number; limit?: number } = {}) =>
    unwrap<{ posts: any[]; meta: AccountListMeta }>(
      apiClient.get(`/admin/accounts/${id}/posts`, { params })
    ),

  getAccountCampaigns: (id: string, params: { page?: number; limit?: number } = {}) =>
    unwrap<{ campaigns: any[]; meta: AccountListMeta }>(
      apiClient.get(`/admin/accounts/${id}/campaigns`, { params })
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

  warnAccount: (id: string, payload: { reasons: string[]; description: string; notifyUser: boolean }) =>
    unwrap<{ account: AdminAccount }>(
      apiClient.post(`/admin/accounts/${id}/warn`, payload)
    ),

  blockAccount: (id: string, payload: { reasons: string[]; description: string; notifyUser: boolean }) =>
    unwrap<{ account: AdminAccount }>(
      apiClient.post(`/admin/accounts/${id}/block`, payload)
    ),

  suspendAccount: (id: string, payload: { reasons: string[]; description: string; notifyUser: boolean; duration?: string }) =>
    unwrap<{ account: AdminAccount }>(
      apiClient.post(`/admin/accounts/${id}/suspend`, payload)
    ),

  getPostDetails: (postId: string) =>
    unwrap<{ news: any }>(
      apiClient.get(`/admin/news/${postId}`)
    ),

  getPostComments: (postId: string, params: { page?: number; limit?: number } = {}) =>
    unwrap<{ results: any[]; meta: AccountListMeta }>(
      apiClient.get(`/admin/news/${postId}/comments`, { params })
    ),

  getPostLikes: (postId: string, params: { page?: number; limit?: number } = {}) =>
    unwrap<{ results: any[]; meta: AccountListMeta }>(
      apiClient.get(`/admin/news/${postId}/reactions`, { params: { ...params, type: 'like' } })
    ),

  getCampaignDetails: (campaignId: string) =>
    unwrap<{ campaign: any }>(
      apiClient.get(`/admin/campaigns/${campaignId}`)
    ),

  getCampaignSupport: (campaignId: string, params: { page?: number; limit?: number } = {}) =>
    unwrap<{ supporters: any[]; meta?: AccountListMeta }>(
      apiClient.get(`/campaigns/${campaignId}/support`, { params })
    ),
};
