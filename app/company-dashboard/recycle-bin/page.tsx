'use client';

import { CompanyDashboardLayout } from '@/src/components/layout/company-dashboard';
import { RecycleBinView } from '@/src/components/features/company-dashboard/recycle-bin';

export default function RecycleBinPage() {
  return (
    <CompanyDashboardLayout title="Recycle Bin">
      <RecycleBinView />
    </CompanyDashboardLayout>
  );
}
