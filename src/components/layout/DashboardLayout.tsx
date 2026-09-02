'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/src/components/layout/Sidebar';
import TopBar from '@/src/components/layout/TopBar';
import { useAuthContext } from '@/src/providers/AuthProvider';
import { ROUTES } from '@/src/constants/routes';

interface DashboardLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function DashboardLayout({ title, children }: DashboardLayoutProps) {
  const router = useRouter();
  const { adminUser, isLoading } = useAuthContext();

  useEffect(() => {
    if (!isLoading && !adminUser) {
      router.replace(ROUTES.LOGIN);
    }
  }, [isLoading, adminUser, router]);

  // Show spinner while checking auth
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F4F6FB]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Don't render layout while redirecting
  if (!adminUser) return null;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      <TopBar title={title} />
      <div className="flex flex-1 overflow-hidden bg-[#F4F6FB]">
        <Sidebar />
        <main className="flex-1 overflow-hidden flex flex-col p-5">
          <div className="flex-1 bg-white rounded-2xl overflow-hidden flex flex-col shadow-sm">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

