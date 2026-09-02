'use client';

import { DashboardLayout } from '@/src/components/layout';
import { NotificationList } from '@/src/components/features/shared';
import { useNotifications } from '@/src/hooks';

export default function NotificationsPage() {
  const { groups, loading, error } = useNotifications('admin');

  return (
    <DashboardLayout title="Notification">
      <div className="p-6 flex flex-col h-full overflow-hidden">
        <NotificationList
          groups={groups}
          loading={loading}
          error={error}
          title="Notification"
          emptyMessage="No admin notifications yet."
        />
      </div>
    </DashboardLayout>
  );
}
