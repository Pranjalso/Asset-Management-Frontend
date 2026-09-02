'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/src/components/layout';
import { CompanyUserTable, EditCompanyUserModal } from '@/src/components/features/company-user';
import { useCompanyUsers } from '@/src/hooks';
import { companyUserService } from '@/src/services';
import { ROUTES } from '@/src/constants/routes';
import type { CompanyUser } from '@/src/types';

export default function CompanyUserPage() {
  const router = useRouter();
  const { users, loading, error, refetch } = useCompanyUsers();
  const [editingUser, setEditingUser] = useState<CompanyUser | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async (updated: CompanyUser) => {
    try {
      setSaving(true);
      await companyUserService.update(updated.id, updated);
      setEditingUser(null);
      refetch();
    } catch (err) {
      console.error('Failed to save company user:', err);
      alert('Failed to save company user. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="Company User">
      <div className="p-5 flex flex-col h-full overflow-hidden">
        {error && (
          <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
            {error}
          </div>
        )}
        <CompanyUserTable 
          users={users} 
          loading={loading} 
          onEdit={setEditingUser} 
          onCreate={() => router.push(ROUTES.COMPANY_USER_ADD)} 
        />
      </div>
      <EditCompanyUserModal 
        user={editingUser} 
        onClose={() => setEditingUser(null)} 
        onSave={handleSave} 
        saving={saving}
      />
    </DashboardLayout>
  );
}
