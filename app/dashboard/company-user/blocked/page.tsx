'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/src/components/layout';
import { BlockedUserTable, EditCompanyUserModal } from '@/src/components/features/company-user';
import { companyUserService } from '@/src/services/company-user.service';
import type { CompanyUser } from '@/src/types';

export default function BlockedUsersPage() {
  const [editingUser, setEditingUser] = useState<CompanyUser | null>(null);
  const [users, setUsers] = useState<CompanyUser[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBlockedUsers = async () => {
    try {
      setLoading(true);
      const response = await companyUserService.getAll(1, 100, 'blocked');
      setUsers(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlockedUsers();
  }, []);

  const handleSave = async (updated: CompanyUser) => {
    await companyUserService.update(updated.id, updated);
    setEditingUser(null);
    await loadBlockedUsers();
  };

  return (
    <DashboardLayout title="Company User">
      <div className="p-5 flex flex-col h-full overflow-hidden">
        <BlockedUserTable users={users} loading={loading} onEdit={setEditingUser} />
      </div>
      <EditCompanyUserModal user={editingUser} onClose={() => setEditingUser(null)} onSave={handleSave} />
    </DashboardLayout>
  );
}
