'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/src/components/layout';
import { ReasonForBlocking } from '@/src/components/features/company-user';
import { companyUserService } from '@/src/services/company-user.service';

function BlockContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');

  const handleBlock = async (reason: string) => {
    if (!userId) {
      throw new Error('Company id is required');
    }
    await companyUserService.block(userId, reason);
  };

  return (
    <DashboardLayout title="Company User">
      <div className="p-6 flex flex-col h-full overflow-hidden">
        <ReasonForBlocking onBlock={handleBlock} />
      </div>
    </DashboardLayout>
  );
}

export default function BlockPage() {
  return <Suspense><BlockContent /></Suspense>;
}
