import { apiClient, unwrap } from './apiClient';

export type ReporterApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface AdminReporterUser {
  id: string;
  name: string;
  username?: string;
  email: string;
  mobile?: string;
  phoneNumber?: string;
  avatar?: string | null;
  gender?: 'Male' | 'Female' | null;
  createdAt?: string;
  updatedAt?: string;
  reporterProfile?: {
    journalistId?: string | null;
    approvalStatus?: ReporterApprovalStatus | null;
    rejectionReason?: string | null;
  };
}

export interface ReporterListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

async function listReporterGroup(status: ReporterApprovalStatus) {
  const response = await unwrap<{ reporters: AdminReporterUser[]; meta: ReporterListMeta }>(
    apiClient.get('/admin/reporters', {
      params: { status, page: 1, limit: 100 },
    })
  );

  return response.data?.reporters ?? [];
}

export const adminReporterServices = {
  listReporters: (params: { status?: ReporterApprovalStatus; page?: number; limit?: number } = {}) =>
    unwrap<{ reporters: AdminReporterUser[]; meta: ReporterListMeta }>(
      apiClient.get('/admin/reporters', { params })
    ),

  listAllVerificationReporters: async () => {
    const [pending, approved, rejected] = await Promise.all([
      listReporterGroup('pending'),
      listReporterGroup('approved'),
      listReporterGroup('rejected'),
    ]);

    return [...pending, ...rejected, ...approved];
  },

  approveReporter: (id: string) =>
    unwrap<{ user: AdminReporterUser }>(
      apiClient.post(`/admin/reporters/${id}/approve`, {})
    ),

  rejectReporter: (id: string, reason: string) =>
    unwrap<{ user: AdminReporterUser }>(
      apiClient.post(`/admin/reporters/${id}/reject`, { reason })
    ),
};
