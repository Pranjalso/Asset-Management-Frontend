'use client';

import React from 'react';

import { CompanyDashboardLayout } from '@/src/components/layout/company-dashboard';
import { SaleOfAssetView } from '@/src/components/features/company-dashboard/asset-decommission';

export default function SaleOfAssetPage() {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <CompanyDashboardLayout title="Asset Decommission" onSearchChange={setSearchQuery}>
      <div className="p-4 sm:p-5 flex flex-col h-full overflow-hidden bg-[#F8FAFC]">
        <SaleOfAssetView searchQuery={searchQuery} />
      </div>
    </CompanyDashboardLayout>
  );
}
