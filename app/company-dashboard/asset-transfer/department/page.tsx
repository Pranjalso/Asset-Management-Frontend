'use client';

import React from 'react';

import { CompanyDashboardLayout } from '@/src/components/layout/company-dashboard';
import { DepartmentTransferView } from '@/src/components/features/company-dashboard/asset-transfer';

export default function DepartmentTransferPage() {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <CompanyDashboardLayout title="Asset Transfer" onSearchChange={setSearchQuery}>
      <div className="p-4 sm:p-5 flex flex-col h-full overflow-hidden bg-[#F8FAFC]">
        <DepartmentTransferView searchQuery={searchQuery} />
      </div>
    </CompanyDashboardLayout>
  );
}
