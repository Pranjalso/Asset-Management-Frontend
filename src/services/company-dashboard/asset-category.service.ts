import { orgService } from '../org.service';
import type { AssetCategory, AssetCategoriesResponse } from '@/src/types';

export const assetCategoryService = {
  getAll: async (
    page = 1,
    pageSize = 20
  ): Promise<AssetCategoriesResponse> => {
    const response = await orgService.listCategories({ page, pageSize });
    return {
      data: response.data.map((category) => ({
        id: category.id,
        categoryName: category.categoryName,
        categoryCode: category.categoryCode,
      })),
      total: response.total,
      page: response.page,
      pageSize: response.pageSize,
    };
  },

  create: async (data: Omit<AssetCategory, 'id'>): Promise<AssetCategory> => {
    const category = await orgService.createCategory({
      category_name: data.categoryName,
      category_code: data.categoryCode,
    });
    return {
      id: category.id,
      categoryName: category.categoryName,
      categoryCode: category.categoryCode,
    };
  },

  delete: async (id: string): Promise<void> => {
    await orgService.deleteCategory(id);
  },

  listRecycled: async (): Promise<AssetCategoriesResponse> => {
    const { apiRequest } = await import('@/src/lib/api-client');
    const res = await apiRequest<{ success: boolean; data: Array<{ id: string; categoryName: string; categoryCode: string | null }>; total: number }>(
      '/api/dashboard/org/categories/recycled'
    );
    return {
      data: (res.data || []).map((c) => ({
        id: String(c.id),
        categoryName: c.categoryName,
        categoryCode: c.categoryCode || undefined,
      })),
      total: res.total || 0,
      page: 1,
      pageSize: 50,
    };
  },

  restore: async (id: string): Promise<void> => {
    const { apiRequest } = await import('@/src/lib/api-client');
    await apiRequest(`/api/dashboard/org/categories/${id}/restore`, { method: 'POST' });
  },

  hardDelete: async (id: string): Promise<void> => {
    const { apiRequest } = await import('@/src/lib/api-client');
    await apiRequest(`/api/dashboard/org/categories/${id}/permanent`, { method: 'DELETE' });
  },

  update: async (id: string, data: Partial<Omit<AssetCategory, 'id'>>): Promise<AssetCategory> => {
    const category = await orgService.updateCategory(id, {
      category_name: data.categoryName,
      category_code: data.categoryCode,
    });
    return {
      id: category.id,
      categoryName: category.categoryName,
      categoryCode: category.categoryCode,
    };
  },
};
