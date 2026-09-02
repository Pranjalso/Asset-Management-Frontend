'use client';

import React from 'react';

import { useRouter } from 'next/navigation';
import { CompanyDashboardLayout } from '@/src/components/layout/company-dashboard';
import { AssetCategoriesTable } from '@/src/components/features/company-dashboard/asset-categories';
import { useAssetCategories } from '@/src/hooks/company-dashboard/useAssetCategories';
import { ROUTES } from '@/src/constants/routes';
import toast from 'react-hot-toast';

export default function AssetCategoriesPage() {
  const router = useRouter();
  const { categories, loading, error, deleteCategory } = useAssetCategories();

  const [searchQuery, setSearchQuery] = React.useState('');

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      toast.success('Category moved to Recycle Bin!');
    } catch (e) {
      toast.error('Failed to delete category');
      console.error(e);
    }
  };

  const handleCreate = () => {
    router.push(`${ROUTES.COMPANY_DASHBOARD_ASSET_CATEGORIES}/add`);
  };

  const handleEdit = (id: string) => {
    router.push(`${ROUTES.COMPANY_DASHBOARD_ASSET_CATEGORIES}/add?editId=${id}`);
  };

  const filteredCategories = categories.filter(c => 
    !searchQuery || 
    c.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.categoryCode && c.categoryCode.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <CompanyDashboardLayout title="Asset Categories" onSearchChange={setSearchQuery}>
      <div className="p-5 flex flex-col h-full overflow-hidden">
        {error && (
          <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
            {error}
          </div>
        )}
        <AssetCategoriesTable
          categories={filteredCategories}
          loading={loading}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onCreate={handleCreate}
        />
      </div>
    </CompanyDashboardLayout>
  );
}
