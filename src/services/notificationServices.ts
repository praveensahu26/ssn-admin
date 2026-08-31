import { apiClient, unwrap } from './apiClient';

export type NotificationType =
  | 'follow'
  | 'follow_accepted'
  | 'connection_request'
  | 'connection_accepted'
  | 'message'
  | 'comment'
  | 'like'
  | 'share'
  | 'live_started'
  | 'live_scheduled'
  | 'campaign_started'
  | 'breaking_news'
  | 'trending_news'
  | 'admin_warning'
  | 'admin_blocked'
  | 'admin_suspended'
  | 'admin_report_post'
  | 'admin_report_campaign'
  | 'admin_reporter_signup';

export interface AppNotification {
  id: string;
  recipient: string;
  sender?: { id: string; name: string; avatar?: string | null } | null;
  type: NotificationType;
  read: boolean;
  data: {
    newsId?: string | null;
    commentId?: string | null;
    campaignId?: string | null;
    reporterId?: string | null;
    scheduledAt?: string | null;
    message?: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

interface NotificationListParams {
  page?: number;
  limit?: number;
  unread?: 'true';
}

export const notificationServices = {
  list: (params?: NotificationListParams) =>
    unwrap<{ notifications: AppNotification[] }>(apiClient.get('/notifications', { params })),

  getUnreadCount: () => unwrap<{ count: number }>(apiClient.get('/notifications/unread-count')),

  markAsRead: (id: string) => unwrap<{ notification: AppNotification }>(apiClient.patch(`/notifications/${id}/read`, {})),

  markAllAsRead: () => unwrap(apiClient.patch('/notifications/read-all', {})),
};
