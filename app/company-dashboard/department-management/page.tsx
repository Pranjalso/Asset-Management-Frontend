'use client';

import React from 'react';

import { CompanyDashboardLayout } from '@/src/components/layout/company-dashboard';
import { DepartmentManagementView } from '@/src/components/features/company-dashboard/department-management';

export default function DepartmentManagementPage() {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <CompanyDashboardLayout title="Department Management" onSearchChange={setSearchQuery}>
      <div className="p-4 sm:p-5 flex flex-col h-full overflow-hidden bg-white/50">
        <DepartmentManagementView searchQuery={searchQuery} />
      </div>
    </CompanyDashboardLayout>
  );
}
