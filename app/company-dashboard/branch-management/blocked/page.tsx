'use client';

import { CompanyDashboardLayout } from '@/src/components/layout/company-dashboard';
import { BlockedBranchManagementView } from '@/src/components/features/company-dashboard/branch-management';

export default function BlockedBranchManagementPage() {
  return (
    <CompanyDashboardLayout title="Branch Management">
      <div className="p-4 sm:p-5 flex flex-col h-full overflow-hidden bg-white/50">
        <BlockedBranchManagementView />
      </div>
    </CompanyDashboardLayout>
  );
}
