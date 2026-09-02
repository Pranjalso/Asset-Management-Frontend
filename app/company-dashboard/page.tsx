'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CompanyDashboardLayout } from '@/src/components/layout/company-dashboard';
import {
  AssetStatsCards,
  BranchManagementTable,
  DepartmentManagementTable,
  DeptAssetUsageTable,
  BranchAssetUsageTable,
} from '@/src/components/features/company-dashboard';
import { useDashboard } from '@/src/hooks';
import { useAuthContext } from '@/src/providers/AuthProvider';
import { ROUTES } from '@/src/constants/routes';

export default function CompanyDashboardPage() {
  const router = useRouter();
  const { dashboardUser, isLoading: isAuthLoading } = useAuthContext();
  const { stats, branches, departments, deptUsage, branchUsage, loading, error } = useDashboard();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !dashboardUser) {
      router.replace(ROUTES.DASHBOARD_LOGIN);
    }
  }, [isAuthLoading, dashboardUser, router]);

  // Show spinner while auth or data is loading
  if (isAuthLoading || loading) {
    return (
      <CompanyDashboardLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-[#1A7DE8] border-t-transparent rounded-full animate-spin" />
        </div>
      </CompanyDashboardLayout>
    );
  }

  // Don't render dashboard content if not authenticated (redirect is pending)
  if (!dashboardUser) return null;

  return (
    <CompanyDashboardLayout title="Dashboard">
      {error && (
        <div className="mb-4 px-4 py-2 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-700">
          {error}
        </div>
      )}
      {/* Asset stats */}
      <AssetStatsCards stats={stats} />

      {/* Branch + Department tables side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <BranchManagementTable branches={branches} />
        <DepartmentManagementTable departments={departments} />
      </div>

      {/* Dept Asset Usage + Branch Asset Usage side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <DeptAssetUsageTable data={deptUsage} />
        <BranchAssetUsageTable data={branchUsage} />
      </div>
    </CompanyDashboardLayout>
  );
}
