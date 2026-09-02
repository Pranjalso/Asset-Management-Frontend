'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/src/components/layout';
import { RecycleBinTable } from '@/src/components/features/employee-user';
import { employeeUserService } from '@/src/services/employee-user.service';
import type { EmployeeUser } from '@/src/types';

export default function RecycleBinPage() {
  const [users, setUsers] = useState<EmployeeUser[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRecycledUsers = async () => {
    try {
      setLoading(true);
      const response = await employeeUserService.getAll(1, 100, 'recycled');
      setUsers(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecycledUsers();
  }, []);

  const handleRecover = async (user: EmployeeUser) => {
    await employeeUserService.recover(user.id);
    await loadRecycledUsers();
  };

  const handleDelete = async (user: EmployeeUser) => {
    await employeeUserService.delete(user.id);
    await loadRecycledUsers();
  };

  return (
    <DashboardLayout title="Employee User">
      <div className="p-5 flex flex-col h-full overflow-hidden">
        <RecycleBinTable users={users} loading={loading} onRecover={handleRecover} onDelete={handleDelete} />
      </div>
    </DashboardLayout>
  );
}
