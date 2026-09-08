import { apiClient, unwrap } from './apiClient';

export interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryPayload {
  name: string;
  description?: string | null;
}

export interface CategoryDeletionCheck {
  canDelete: boolean;
  newsCount: number;
  campaignCount: number;
  liveStreamCount: number;
}

export const categoryServices = {
  list: () => unwrap<{ categories: Category[] }>(apiClient.get('/admin/categories')),

  get: (id: string) => unwrap<{ category: Category }>(apiClient.get(`/admin/categories/${id}`)),

  create: (payload: CategoryPayload) => unwrap<{ category: Category }>(apiClient.post('/admin/categories', payload)),

  update: (id: string, payload: CategoryPayload) =>
    unwrap<{ category: Category }>(apiClient.put(`/admin/categories/${id}`, payload)),

  checkDeletable: (id: string) => unwrap<CategoryDeletionCheck>(apiClient.get(`/admin/categories/${id}/deletion-check`)),

  remove: (id: string) => unwrap(apiClient.delete(`/admin/categories/${id}`)),
};
