'use client';

import { CompanyDashboardLayout } from '@/src/components/layout/company-dashboard';
import { AddBranchView } from '@/src/components/features/company-dashboard/branch-management';

export default function AddBranchPage() {
  return (
    <CompanyDashboardLayout title="Branch Management">
      <div className="p-4 sm:p-5 flex flex-col h-full overflow-hidden bg-white/50">
        <AddBranchView />
      </div>
    </CompanyDashboardLayout>
  );
}
