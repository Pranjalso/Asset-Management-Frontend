'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/src/components/layout';
import { EmployeeUserTable, EditEmployeeUserModal } from '@/src/components/features/employee-user';
import { useEmployeeUsers } from '@/src/hooks';
import { employeeUserService } from '@/src/services';
import { ROUTES } from '@/src/constants/routes';
import type { EmployeeUser } from '@/src/types';

export default function EmployeeUserPage() {
  const router = useRouter();
  const { users, loading, error, refetch } = useEmployeeUsers();
  const [editingUser, setEditingUser] = useState<EmployeeUser | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async (updated: EmployeeUser) => {
    try {
      setSaving(true);
      await employeeUserService.update(updated.id, updated);
      setEditingUser(null);
      refetch();
    } catch (err) {
      console.error('Failed to save employee:', err);
      alert('Failed to save employee. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="Employee User">
      <div className="p-5 flex flex-col h-full overflow-hidden">
        {error && (
          <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
            {error}
          </div>
        )}
        <EmployeeUserTable
          users={users}
          loading={loading}
          onEdit={setEditingUser}
          onCreate={() => router.push(ROUTES.EMPLOYEE_USER_ADD)}
        />
      </div>

      <EditEmployeeUserModal
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSave={handleSave}
        saving={saving}
      />
    </DashboardLayout>
  );
}
