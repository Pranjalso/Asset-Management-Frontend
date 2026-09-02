import { useState, useEffect, useCallback } from 'react';
import type { Asset } from '@/src/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export const INITIAL_ASSET: Asset = {
  id: '',
  assetName: '',
  assetCategory: '',
  assetQuantity: '0',
  assetCompanyName: '',
  assetShelfLife: '',
  invoiceNo: '',
  invoiceDate: '',
  vendorName: '',
  acquisitionCost: '0',
  acquisitionDate: '',
  assetDescription: '',
};

export function useAssets(initialCategoryId?: string) {
  const [assets, setAssets]             = useState<Asset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategoryId || null);
  const [searchQuery, setSearchQuery]   = useState<string>('');
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { assetService } = await import('@/src/services/company-dashboard/asset.service');
      const res = await assetService.getAll(1, 50, selectedCategory || undefined);
      setAssets(res.data);
      if (res.data.length > 0 && !selectedAssetId) {
        setSelectedAssetId(res.data[0].id);
      }
    } catch {
      setAssets([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedAssetId]);

  useEffect(() => { void fetchAll(); }, [fetchAll]);

  const activeAsset = assets.find((a) => a.id === selectedAssetId) || assets[0] || INITIAL_ASSET;

  const filteredAssets = assets.filter((asset) =>
    searchQuery
      ? asset.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.assetCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.assetCompanyName.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  const createAsset = async (data: Omit<Asset, 'id'>) => {
    const { assetService } = await import('@/src/services/company-dashboard/asset.service');
    const created = await assetService.create(data);
    setAssets((prev) => [created, ...prev]);
    setSelectedAssetId(created.id);
    return created;
  };

  const updateAsset = async (id: string, data: Partial<Asset>) => {
    const { assetService } = await import('@/src/services/company-dashboard/asset.service');
    const updated = await assetService.update(id, data);
    setAssets((prev) => prev.map((a) => (a.id === id ? updated : a)));
  };

  const deleteAsset = async (id: string) => {
    const { assetService } = await import('@/src/services/company-dashboard/asset.service');
    await assetService.delete(id);
    setAssets((prev) => {
      const remaining = prev.filter((a) => a.id !== id);
      if (selectedAssetId === id && remaining.length > 0) setSelectedAssetId(remaining[0].id);
      return remaining;
    });
  };

  const moveToBin = async (id: string) => {
    const { assetService } = await import('@/src/services/company-dashboard/asset.service');
    await assetService.moveToBin(id);
    // Remove from local state without permanently deleting via API
    setAssets((prev) => {
      const remaining = prev.filter((a) => a.id !== id);
      if (selectedAssetId === id && remaining.length > 0) setSelectedAssetId(remaining[0].id);
      return remaining;
    });
  };

  return {
    assets: filteredAssets,
    allAssets: assets,
    activeAsset,
    selectedAssetId,
    setSelectedAssetId,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    loading,
    error,
    refetch: fetchAll,
    createAsset,
    updateAsset,
    deleteAsset,
    moveToBin,
  };
}
