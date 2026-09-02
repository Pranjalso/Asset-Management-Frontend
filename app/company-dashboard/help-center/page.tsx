'use client';

import { CompanyDashboardLayout } from '@/src/components/layout/company-dashboard';
import { HelpCenterView } from '@/src/components/features/company-dashboard/help';

export default function HelpCenterPage() {
  return (
    <CompanyDashboardLayout title="Help Center">
      <div className="p-4 sm:p-5 flex flex-col h-full overflow-hidden bg-[#F8FAFC]">
        <HelpCenterView />
      </div>
    </CompanyDashboardLayout>
  );
}
