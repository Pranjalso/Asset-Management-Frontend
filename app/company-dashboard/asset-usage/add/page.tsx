'use client';

import { CompanyDashboardLayout } from '@/src/components/layout/company-dashboard';
import { AddAssetUsageView } from '@/src/components/features/company-dashboard/asset-usage';

export default function AddAssetUsagePage() {
  return (
    <CompanyDashboardLayout title="Asset Usage">
      <div className="p-4 sm:p-5 flex flex-col h-full overflow-y-auto bg-[#F8FAFC] custom-scrollbar">
        <AddAssetUsageView />
      </div>
    </CompanyDashboardLayout>
  );
}
