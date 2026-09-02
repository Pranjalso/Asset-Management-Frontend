import { useCallback, useEffect, useState } from 'react';
import type { Notification, NotificationGroup } from '@/src/types';
import { notificationsService } from '@/src/services';
import { useAuthContext } from '@/src/providers/AuthProvider';

export function useNotifications(mode: 'admin' | 'dashboard') {
  const { isLoading: isAuthLoading, adminUser, dashboardUser } = useAuthContext();
  const [groups, setGroups] = useState<NotificationGroup[]>([]);
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyData = useCallback((data: { items: Notification[]; groups: NotificationGroup[] }) => {
    setGroups(data.groups ?? []);
    setItems(data.items ?? []);
  }, []);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = mode === 'admin'
        ? await notificationsService.getAdminNotifications()
        : await notificationsService.getDashboardNotifications();

      applyData(data);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Failed to load notifications.';
      setError(message);
      setGroups([]);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [applyData, mode]);

  useEffect(() => {
    const relevantUser = mode === 'admin' ? adminUser : dashboardUser;
    if (isAuthLoading || !relevantUser) {
      return;
    }

    const run = async () => {
      await load();
    };

    void run();
  }, [load, mode, isAuthLoading, adminUser, dashboardUser]);

  const markAllRead = useCallback(async () => {
    try {
      const data = mode === 'admin'
        ? await notificationsService.markAdminNotificationsRead()
        : await notificationsService.markDashboardNotificationsRead();
      applyData(data);
      setError(null);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Failed to update notifications.';
      setError(message);
    }
  }, [applyData, mode]);

  return {
    groups,
    items,
    loading: isAuthLoading || (((mode === 'admin' ? adminUser : dashboardUser) != null) && loading),
    error,
    reload: load,
    markAllRead,
    unreadCount: items.filter((item) => !item.read).length,
  };
}
