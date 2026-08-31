import { apiClient, unwrap } from './apiClient';

export interface Author {
  _id: string;
  name: string;
  avatar?: string | null;
  role?: string;
}

export interface Category {
  _id: string;
  name: string;
}

export interface MediaItem {
  url: string;
  type: 'image' | 'video';
}

export interface AdminNewsPost {
  _id: string;
  id: string;
  author: Author;
  media: MediaItem[];
  caption: string;
  description?: string | null;
  location?: string | null;
  categories: Category[];
  status: 'public' | 'flagged' | 'deleted';
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface NewsListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ListNewsParams {
  category?: string;
  author?: string;
  status?: 'public' | 'flagged' | 'deleted';
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface ReportedNewsPost extends AdminNewsPost {
  reportCount: number;
  lastReportedAt: string;
}

export interface ReportReason {
  reason: string;
  count: number;
}

export interface ReportRecord {
  id: string;
  reporter: { _id: string; name: string; avatar?: string | null };
  news: string;
  reason: string;
  description: string | null;
  createdAt: string;
}

export interface NewsReportsResponse {
  totalReports: number;
  reasons: ReportReason[];
  reports: ReportRecord[];
}

export const adminNewsServices = {
  /**
   * GET /v1/admin/news
   */
  listNews: (params: ListNewsParams = {}) =>
    unwrap<{ posts: AdminNewsPost[]; meta: NewsListMeta }>(
      apiClient.get('/admin/news', { params })
    ),

  /**
   * GET /v1/admin/news/reports
   */
  listReportedNews: (params: { page?: number; limit?: number } = {}) =>
    unwrap<{ posts: ReportedNewsPost[]; meta: NewsListMeta }>(
      apiClient.get('/admin/news/reports', { params })
    ),

  /**
   * GET /v1/admin/news/:id/reports
   */
  getNewsReports: (id: string) =>
    unwrap<NewsReportsResponse>(apiClient.get(`/admin/news/${id}/reports`)),

  /**
   * POST /v1/admin/news/:id/reports/dismiss
   */
  dismissNewsReports: (id: string) => unwrap(apiClient.post(`/admin/news/${id}/reports/dismiss`, {})),

  /**
   * GET /v1/admin/news/:id
   */
  getNews: (id: string) =>
    unwrap<{ news: AdminNewsPost }>(
      apiClient.get(`/admin/news/${id}`)
    ),

  /**
   * DELETE /v1/admin/news/:id
   */
  deleteNews: (id: string) =>
    unwrap<void>(
      apiClient.delete(`/admin/news/${id}`)
    ),
};
