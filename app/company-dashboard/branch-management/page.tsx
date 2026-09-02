'use client';

import React from 'react';

import { CompanyDashboardLayout } from '@/src/components/layout/company-dashboard';
import { BranchManagementView } from '@/src/components/features/company-dashboard/branch-management';

export default function BranchManagementPage() {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <CompanyDashboardLayout title="Branch Management" onSearchChange={setSearchQuery}>
      <div className="p-4 sm:p-5 flex flex-col h-full overflow-hidden bg-white/50">
        <BranchManagementView searchQuery={searchQuery} />
      </div>
    </CompanyDashboardLayout>
  );
}
