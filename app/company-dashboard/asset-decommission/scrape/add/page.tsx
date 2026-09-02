'use client';

import { CompanyDashboardLayout } from '@/src/components/layout/company-dashboard';
import { AddAssetScrapeView } from '@/src/components/features/company-dashboard/asset-decommission';

export default function AddAssetScrapePage() {
  return (
    <CompanyDashboardLayout title="Asset Decommission">
      <div className="p-4 sm:p-5 flex flex-col h-full overflow-y-auto bg-[#F8FAFC] custom-scrollbar">
        <AddAssetScrapeView />
      </div>
    </CompanyDashboardLayout>
  );
}
