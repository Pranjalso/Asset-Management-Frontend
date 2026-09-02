'use client';

import { CompanyDashboardLayout } from '@/src/components/layout/company-dashboard';
import { AddDepartmentView } from '@/src/components/features/company-dashboard/department-management';

export default function AddDepartmentPage() {
  return (
    <CompanyDashboardLayout title="Department Management">
      <div className="p-4 sm:p-5 flex flex-col h-full overflow-hidden bg-white/50">
        <AddDepartmentView />
      </div>
    </CompanyDashboardLayout>
  );
}
