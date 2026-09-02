'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/src/constants/routes';

export default function DashboardRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(ROUTES.COMPANY_USER);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#1A7DE8] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Redirecting…</p>
      </div>
    </div>
  );
}

