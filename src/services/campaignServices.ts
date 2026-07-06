import { apiClient, unwrap } from './apiClient';

export interface PublicCampaign {
  _id: string;
  id: string;
  caption?: string;
  description?: string;
  status: string;
  organizer?: {
    _id: string;
    name: string;
    avatar?: string | null;
  };
  categories?: Array<{
    _id: string;
    name: string;
  }>;
  attachments?: Array<{
    url: string;
    type: 'image' | 'video';
  }>;
  goalAmount?: number;
  raisedAmount?: number;
  viewsCount?: number;
  donationsCount?: number;
  location?: string;
  createdAt: string;
}

export interface CampaignListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ListPublicCampaignsParams {
  page?: number;
  limit?: number;
  scope?: 'discover' | 'trending' | 'latest';
  categories?: string | string[];
}

export const campaignServices = {
  /**
   * GET /v1/campaigns
   * List public campaigns with optional scope/filter/pagination params.
   */
  listCampaigns: (params: ListPublicCampaignsParams = {}) =>
    unwrap<{ campaigns: PublicCampaign[]; meta: CampaignListMeta }>(
      apiClient.get('/campaigns', { params })
    ),

  /**
   * GET /v1/campaigns/:id
   * Fetch a single campaign by ID.
   */
  getCampaign: (id: string) =>
    unwrap<{ campaign: PublicCampaign }>(
      apiClient.get(`/campaigns/${id}`)
    ),
};
