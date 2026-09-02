import { apiRequest } from '@/src/lib/api-client';
import type { Notification, NotificationGroup } from '@/src/types';

interface NotificationsResponse {
  success: boolean;
  data: {
    items: Notification[];
    groups: NotificationGroup[];
  };
}

export const notificationsService = {
  getAdminNotifications: async (): Promise<{ items: Notification[]; groups: NotificationGroup[] }> => {
    const response = await apiRequest<NotificationsResponse>('/api/auth/notifications', {
      method: 'GET',
    });
    return response.data;
  },

  markAdminNotificationsRead: async (): Promise<{ items: Notification[]; groups: NotificationGroup[] }> => {
    const response = await apiRequest<NotificationsResponse>('/api/auth/notifications/read', {
      method: 'POST',
    });
    return response.data;
  },

  getDashboardNotifications: async (): Promise<{ items: Notification[]; groups: NotificationGroup[] }> => {
    const response = await apiRequest<NotificationsResponse>('/api/dashboard/notifications', {
      method: 'GET',
    });
    return response.data;
  },

  markDashboardNotificationsRead: async (): Promise<{ items: Notification[]; groups: NotificationGroup[] }> => {
    const response = await apiRequest<NotificationsResponse>('/api/dashboard/notifications/read', {
      method: 'POST',
    });
    return response.data;
  },
};
