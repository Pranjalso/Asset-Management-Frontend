'use client';

import React from 'react';

import { CompanyDashboardLayout } from '@/src/components/layout/company-dashboard';
import { AssetUsageView } from '@/src/components/features/company-dashboard/asset-usage';

export default function AssetUsagePage() {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <CompanyDashboardLayout title="Asset Usage" onSearchChange={setSearchQuery}>
      <div className="p-4 sm:p-5 flex flex-col h-full overflow-hidden bg-[#F8FAFC]">
        <AssetUsageView searchQuery={searchQuery} />
      </div>
    </CompanyDashboardLayout>
  );
}
