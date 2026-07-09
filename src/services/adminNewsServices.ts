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

export const adminNewsServices = {
  /**
   * GET /v1/admin/news
   */
  listNews: (params: ListNewsParams = {}) =>
    unwrap<{ posts: AdminNewsPost[]; meta: NewsListMeta }>(
      apiClient.get('/admin/news', { params })
    ),

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
