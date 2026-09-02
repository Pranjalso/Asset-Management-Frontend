'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CompanyDashboardLayout } from '@/src/components/layout/company-dashboard';
import { AssetDetailsView, CreateAssetModal } from '@/src/components/features/company-dashboard/assets';
import { useAssets } from '@/src/hooks/company-dashboard/useAssets';
import { useAssetCategories } from '@/src/hooks/company-dashboard/useAssetCategories';
import { ROUTES } from '@/src/constants/routes';
import toast from 'react-hot-toast';


export default function AssetsPage() {
  const router = useRouter();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const {
    assets,
    activeAsset,
    selectedCategory,
    setSelectedCategory,
    setSearchQuery,
    createAsset,
    setSelectedAssetId,
    loading: assetsLoading,
    error: assetsError,
    moveToBin,
  } = useAssets();

  const { categories, loading: categoriesLoading } = useAssetCategories();

  const handleCategorySelect = (categoryId: string | null) => {
    const categoryName = categoryId
      ? categories.find((category) => category.id === categoryId)?.categoryName ?? null
      : null;
    setSelectedCategory(categoryName);
  };

  const handleCreateNew = () => {
    router.push(`${ROUTES.COMPANY_DASHBOARD_ASSETS}/add`);
  };

  const handleSaveAsset = async (formData: Parameters<typeof createAsset>[0]) => {
    try {
      await createAsset(formData);
      toast.success('Asset created successfully!');
    } catch (e) {
      toast.error('Failed to create asset');
      console.error(e);
    }
  };

  const handleDeleteAsset = async (id: string) => {
    try {
      await moveToBin(id);
      toast.success('Asset moved to Recycle Bin!');
    } catch (e) {
      toast.error('Failed to delete asset');
      console.error("Failed to delete asset", e);
    }
  };

  if (assetsLoading || categoriesLoading) {
    return (
      <CompanyDashboardLayout title="Assets">
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-[#1A7DE8] border-t-transparent rounded-full animate-spin" />
        </div>
      </CompanyDashboardLayout>
    );
  }

  return (
    <CompanyDashboardLayout title="Assets" onSearchChange={setSearchQuery}>
      <div className="flex flex-col max-w-7xl mx-auto w-full pb-8">
        {assetsError && (
          <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
            {assetsError}
          </div>
        )}
        
        {/* Exact Asset View Matching Screenshot */}
        <AssetDetailsView
          asset={activeAsset}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          onCreateClick={handleCreateNew}
          onBackClick={() => router.back()}
          onDeleteClick={handleDeleteAsset}
        />

        {/* Quick Asset Switcher if multiple assets exist */}
        {assets.length > 1 && (
          <div className="mt-6 bg-white rounded-2xl p-4 sm:p-5 border border-[#E9EFF6] shadow-xs">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Company Assets ({assets.length})
            </h4>
            <div className="flex flex-wrap gap-2.5">
              {assets.map((asset) => {
                const isSelected = asset.id === activeAsset.id;
                return (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => setSelectedAssetId(asset.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#1A7DE8] text-white shadow-xs'
                        : 'bg-[#EEF4FC] text-gray-700 hover:bg-blue-100/70'
                    }`}
                  >
                    {asset.assetName} {asset.assetQuantity ? `(${asset.assetQuantity})` : ''}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Create Asset Modal */}
        <CreateAssetModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={handleSaveAsset}
          categories={categories}
        />
      </div>
    </CompanyDashboardLayout>
  );
}

