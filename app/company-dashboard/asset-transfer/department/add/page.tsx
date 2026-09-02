'use client';

import { CompanyDashboardLayout } from '@/src/components/layout/company-dashboard';
import { AddDepartmentTransferView } from '@/src/components/features/company-dashboard/asset-transfer';

export default function AddDepartmentTransferPage() {
  return (
    <CompanyDashboardLayout title="Asset Transfer">
      <div className="p-4 sm:p-5 flex flex-col h-full overflow-y-auto bg-[#F8FAFC] custom-scrollbar">
        <AddDepartmentTransferView />
      </div>
    </CompanyDashboardLayout>
  );
}
