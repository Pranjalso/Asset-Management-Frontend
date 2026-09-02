'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/src/components/layout';
import { ReasonForRecycleBin } from '@/src/components/features/employee-user';
import { employeeUserService } from '@/src/services/employee-user.service';

function RecycleReasonContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');

  const handleDelete = async (reason: string) => {
    if (!userId) {
      throw new Error('Employee id is required');
    }
    await employeeUserService.moveToRecycleBin(userId, reason);
  };

  return (
    <DashboardLayout title="Employee User">
      <div className="p-6 flex flex-col h-full overflow-hidden">
        <ReasonForRecycleBin onDelete={handleDelete} />
      </div>
    </DashboardLayout>
  );
}

export default function RecycleReasonPage() {
  return <Suspense><RecycleReasonContent /></Suspense>;
}
