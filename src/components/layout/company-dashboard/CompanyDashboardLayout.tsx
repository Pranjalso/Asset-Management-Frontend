'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CompanyDashboardSidebar from './CompanyDashboardSidebar';
import CompanyDashboardTopBar from './CompanyDashboardTopBar';
import { useAuthContext } from '@/src/providers/AuthProvider';
import { ROUTES } from '@/src/constants/routes';

interface CompanyDashboardLayoutProps {
  title: string;
  children: React.ReactNode;
  onSearchChange?: (query: string) => void;
}

export default function CompanyDashboardLayout({
  title,
  children,
  onSearchChange,
}: CompanyDashboardLayoutProps) {
  const router = useRouter();
  const { dashboardUser, isLoading } = useAuthContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !dashboardUser) {
      router.replace(ROUTES.DASHBOARD_LOGIN);
    }
  }, [isLoading, dashboardUser, router]);

  // Show spinner while checking auth
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F4F8FC]">
        <div className="w-10 h-10 border-4 border-[#1A7DE8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Don't render layout while redirecting
  if (!dashboardUser) return null;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#F4F8FC]">
      <CompanyDashboardTopBar
        title={title}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        onSearchChange={onSearchChange}
      />
      <div className="flex flex-1 overflow-hidden">
        <CompanyDashboardSidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-7">
          {children}
        </main>
      </div>
    </div>
  );
}

