import { apiClient, unwrap } from './apiClient';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CampaignStatus = 'active' | 'pending' | 'suspended' | 'completed' | 'rejected';

export interface CampaignOrganizer {
  _id: string;
  name: string;
  avatar?: string | null;
  role?: string;
}

export interface CampaignCategory {
  _id: string;
  name: string;
}

export interface CampaignAttachment {
  url: string;
  type: 'image' | 'video';
  _id?: string;
}

export interface AdminCampaign {
  _id: string;
  id: string;
  caption?: string;
  description?: string;
  status: CampaignStatus;
  organizer?: CampaignOrganizer;
  categories?: CampaignCategory[];
  attachments?: CampaignAttachment[];
  goalAmount?: number;
  raisedAmount?: number;
  viewsCount?: number;
  donationsCount?: number;
  location?: string;
  createdAt: string;
  updatedAt?: string;
  approvedAt?: string | null;
  completedAt?: string | null;
  suspensionReasons?: string[];
  suspensionNote?: string | null;
}

export interface CampaignStats {
  totalCampaigns: number;
  totalRaised: number;
  activeCampaigns: number;
  activeRaised: number;
  completedCampaigns: number;
  completedRaised: number;
  fansThisWeek: number;
  newThisWeek: number;
  newThisMonth: number;
  activeNewThisWeek: number;
  activeNewThisMonth: number;
  completedNewThisWeek: number;
  completedNewThisMonth: number;
}

export interface CampaignListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type CampaignTab = 'overview' | 'active' | 'completed' | 'requests' | 'suspended' | 'rejected';

export interface ListCampaignsParams {
  tab?: CampaignTab;
  page?: number;
  limit?: number;
  categories?: string | string[];
  organizer?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const suspensionReasonValues = [
  'Violation of Platform Guidelines',
  'Misleading or False Information',
  'Inappropriate Content',
  'Reported for Fraudulent Activity',
  'Other',
] as const;

export type SuspensionReason = (typeof suspensionReasonValues)[number];

// ─── Service ──────────────────────────────────────────────────────────────────

export const adminCampaignServices = {
  /**
   * GET /v1/admin/campaigns
   * List campaigns with optional tab/filter/pagination params.
   */
  listCampaigns: (params: ListCampaignsParams = {}) =>
    unwrap<{ campaigns: AdminCampaign[]; meta: CampaignListMeta }>(
      apiClient.get('/admin/campaigns', { params })
    ),

  /**
   * GET /v1/admin/campaigns/stats
   * Get aggregate campaign statistics.
   */
  getCampaignStats: () =>
    unwrap<{ stats: CampaignStats }>(
      apiClient.get('/admin/campaigns/stats')
    ),

  /**
   * GET /v1/admin/campaigns/:id
   * Fetch a single campaign by ID.
   */
  getCampaign: (id: string) =>
    unwrap<{ campaign: AdminCampaign }>(
      apiClient.get(`/admin/campaigns/${id}`)
    ),

  /**
   * POST /v1/admin/campaigns/:id/approve
   * Approve a pending campaign (status: pending → active).
   */
  approveCampaign: (id: string) =>
    unwrap<{ campaign: AdminCampaign }>(
      apiClient.post(`/admin/campaigns/${id}/approve`, {})
    ),

  /**
   * POST /v1/admin/campaigns/:id/reject
   * Reject a pending campaign.
   */
  rejectCampaign: (id: string) =>
    unwrap<{ campaign: AdminCampaign }>(
      apiClient.post(`/admin/campaigns/${id}/reject`, {})
    ),

  /**
   * POST /v1/admin/campaigns/:id/suspend
   * Suspend an active campaign.
   * - suspensionReasons: required, at least one value from suspensionReasonValues.
   * - suspensionNote: required only when 'Other' is among the reasons.
   */
  suspendCampaign: (
    id: string,
    payload: { suspensionReasons: SuspensionReason[]; suspensionNote?: string }
  ) =>
    unwrap<{ campaign: AdminCampaign }>(
      apiClient.post(`/admin/campaigns/${id}/suspend`, payload)
    ),

  /**
   * POST /v1/admin/campaigns/:id/complete
   * Mark an active campaign as completed.
   */
  completeCampaign: (id: string) =>
    unwrap<{ campaign: AdminCampaign }>(
      apiClient.post(`/admin/campaigns/${id}/complete`, {})
    ),
};
