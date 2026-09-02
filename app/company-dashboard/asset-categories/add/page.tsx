'use client';

import { CompanyDashboardLayout } from '@/src/components/layout/company-dashboard';
import AddCategoryForm from '@/src/components/features/company-dashboard/asset-categories/AddCategoryForm';
import { assetCategoryService } from '@/src/services/company-dashboard/asset-category.service';
import type { AddCategoryFormState } from '@/src/components/features/company-dashboard/asset-categories/AddCategoryForm';

export default function AddAssetCategoryPage() {
  const handleSubmit = async (data: AddCategoryFormState, editId?: string) => {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!API_BASE) return; // No backend yet

    if (editId) {
      // Edit existing
      await assetCategoryService.update(editId, data);
    } else {
      // Create new
      await assetCategoryService.create(data);
    }
  };

  return (
    <CompanyDashboardLayout title="Asset Categories">
      <AddCategoryForm onSubmit={handleSubmit} />
    </CompanyDashboardLayout>
  );
}
