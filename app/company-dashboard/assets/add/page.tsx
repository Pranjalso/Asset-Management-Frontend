'use client';

import React from 'react';

import { useRouter } from 'next/navigation';
import { CompanyDashboardLayout } from '@/src/components/layout/company-dashboard';
import { AddAssetView } from '@/src/components/features/company-dashboard/assets';
import { useAssets } from '@/src/hooks/company-dashboard/useAssets';
import { useAssetCategories } from '@/src/hooks/company-dashboard/useAssetCategories';
import { ROUTES } from '@/src/constants/routes';

export default function AddAssetPage() {
  const router = useRouter();
  const { createAsset, assets } = useAssets();
  const { categories, addCategory } = useAssetCategories();

  const [decommissionVendors, setDecommissionVendors] = React.useState<string[]>([]);

  React.useEffect(() => {
    let cancelled = false;
    import('@/src/services/assetOps.service').then(({ assetOpsService }) => {
      assetOpsService.listDecommissions({ pageSize: 500 }).then((res) => {
        if (!cancelled) {
          const unique = Array.from(new Set(res.data.map((d) => d.vendorName).filter(Boolean)));
          setDecommissionVendors(unique);
        }
      }).catch(() => {});
    });
    return () => { cancelled = true; };
  }, []);

  const vendors = Array.from(new Set([
    ...assets.map((a) => a.vendorName),
    ...decommissionVendors
  ].filter(Boolean)));
  const companies = Array.from(new Set(assets.map((a) => a.assetCompanyName).filter(Boolean)));

  const handleSave = async (data: Parameters<typeof createAsset>[0]) => {
    if (data.assetCategory) {
      const catName = data.assetCategory.trim();
      const exists = categories.some((c) => c.categoryName.toLowerCase() === catName.toLowerCase());
      if (!exists && catName) {
        try {
          await addCategory({ 
            categoryName: catName, 
            categoryCode: catName.substring(0, 3).toUpperCase()
          } as any);
        } catch (e) {
          console.error('Failed to create new category', e);
        }
      }
    }

    await createAsset(data);
    router.push(ROUTES.COMPANY_DASHBOARD_ASSETS);
  };

  return (
    <CompanyDashboardLayout title="Assets">
      <div className="flex flex-col max-w-7xl mx-auto w-full pb-8">
        <AddAssetView
          categories={categories}
          vendors={vendors}
          companies={companies}
          onSubmit={handleSave}
          onCancel={() => router.push(ROUTES.COMPANY_DASHBOARD_ASSETS)}
        />
      </div>
    </CompanyDashboardLayout>
  );
}
