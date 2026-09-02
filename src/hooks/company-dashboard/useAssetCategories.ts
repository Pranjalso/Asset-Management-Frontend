import { useState, useEffect, useCallback } from 'react';
import { assetCategoryService } from '@/src/services/company-dashboard/asset-category.service';
import type { AssetCategory } from '@/src/types';


export function useAssetCategories() {
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await assetCategoryService.getAll();
      setCategories(res.data);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchAll(); }, [fetchAll]);

  const deleteCategory = async (id: string) => {
    await assetCategoryService.delete(id);
    await fetchAll();
  };

  const addCategory = async (data: Omit<AssetCategory, 'id'>) => {
    await assetCategoryService.create(data);
    await fetchAll();
  };

  const updateCategory = async (id: string, data: Partial<AssetCategory>) => {
    await assetCategoryService.update(id, data);
    await fetchAll();
  };

  return {
    categories,
    loading,
    error,
    refetch: fetchAll,
    deleteCategory,
    addCategory,
    updateCategory,
  };
}
