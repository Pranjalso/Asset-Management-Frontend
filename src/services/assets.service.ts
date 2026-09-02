import { apiRequest } from '@/src/lib/api-client';
import { ApiError, toApiError } from '@/src/lib/service-errors';

  function unwrap<T>(envelope: { success: boolean; data: T; message?: string }): T {
  if (!envelope.success) {
    throw new ApiError(envelope.message || 'Operation failed');
  }
  return envelope.data;
}

export interface Asset {
  id: string;
  name: string;
  recycleReason?: string;
  recycledAt?: string | null;
  description: string;
  categoryId: string | null;
  categoryName: string;
  branchId: string | null;
  branchName: string;
  departmentId: string | null;
  departmentName: string;
  serialNumber: string;
  purchaseDate: string | null;
  purchasePrice: number | null;
  currentValue: number | null;
  status: string;
  condition: string;
  location: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  vendorName: string;
  quantity: number;
  shelfLife: string;
  invoiceNo: string;
  invoiceDate: string;
  assetCompanyName: string;
}

export interface CreateAssetPayload {
  name: string;
  description?: string;
  category_id?: string;
  branch_id?: string;
  department_id?: string;
  serial_number?: string;
  purchase_date?: string;
  purchase_price?: number;
  current_value?: number;
  condition?: string;
  location?: string;
  image_url?: string;
  vendor_name?: string;
  quantity?: number;
  shelf_life?: string;
  invoice_no?: string;
  invoice_date?: string;
  asset_company_name?: string;
}

export interface UpdateAssetPayload {
  name?: string;
  description?: string;
  category_id?: string;
  branch_id?: string;
  department_id?: string;
  serial_number?: string;
  purchase_date?: string;
  purchase_price?: number;
  current_value?: number;
  status?: string;
  condition?: string;
  location?: string;
  image_url?: string;
  vendor_name?: string;
  quantity?: number;
  shelf_life?: string;
  invoice_no?: string;
  invoice_date?: string;
  asset_company_name?: string;
}

export interface AssetListResponse {
  data: Asset[];
  total: number;
  page: number;
  pageSize: number;
}

export const assetsService = {
  list: async (params?: {
    status?: string;
    category?: string;
    page?: number;
    pageSize?: number;
    search?: string;
  }): Promise<AssetListResponse> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      if (params?.category) queryParams.append('category', params.category);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
      if (params?.search) queryParams.append('search', params.search);

      const response = await apiRequest<{ success: boolean; data: Asset[]; total: number; page: number; pageSize: number }>(
        `/api/dashboard/assets?${queryParams.toString()}`,
        { method: 'GET' }
      );
      return {
        data: response.data,
        total: response.total,
        page: response.page,
        pageSize: response.pageSize
      };
    } catch (error) {
      console.error('Failed to fetch assets:', error);
      throw toApiError(error, 'Failed to load assets. Please try again.');
    }
  },

  getById: async (id: string): Promise<Asset> => {
    try {
      const response = await apiRequest<{ success: boolean; data: Asset }>(
        `/api/dashboard/assets/${id}`,
        { method: 'GET' }
      );
      return unwrap(response);
    } catch (error) {
      console.error(`Failed to fetch asset ${id}:`, error);
      throw toApiError(error, 'Failed to load asset details. Please try again.');
    }
  },

  create: async (data: CreateAssetPayload): Promise<Asset> => {
    try {
      const response = await apiRequest<{ success: boolean; data: Asset; message?: string }>(
        '/api/dashboard/assets',
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
      return unwrap(response);
    } catch (error) {
      console.error('Failed to create asset:', error);
      throw toApiError(error, 'Failed to create asset. Please check your input and try again.');
    }
  },

  update: async (id: string, data: UpdateAssetPayload): Promise<Asset> => {
    try {
      const response = await apiRequest<{ success: boolean; data: Asset; message?: string }>(
        `/api/dashboard/assets/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(data),
        }
      );
      return unwrap(response);
    } catch (error) {
      console.error(`Failed to update asset ${id}:`, error);
      throw toApiError(error, 'Failed to update asset. Please try again.');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiRequest<{ success: boolean; message?: string }>(
        `/api/dashboard/assets/${id}`,
        { method: 'DELETE' }
      );
    } catch (error) {
      console.error(`Failed to delete asset ${id}:`, error);
      throw toApiError(error, 'Failed to delete asset. Please try again.');
    }
  },

  listRecycled: async (): Promise<Asset[]> => {
    try {
      const response = await apiRequest<{ success: boolean; data: Asset[] }>(
        '/api/dashboard/assets/recycled/list',
        { method: 'GET' }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch recycled assets:', error);
      throw toApiError(error, 'Failed to load recycled assets. Please try again.');
    }
  },

  recycle: async (id: string, reason?: string): Promise<void> => {
    try {
      await apiRequest<{ success: boolean; message?: string }>(
        `/api/dashboard/assets/${id}/recycle`,
        {
          method: 'PUT',          // ← backend route: PUT /:id/recycle
          body: JSON.stringify({ reason }),
        }
      );
    } catch (error) {
      console.error(`Failed to recycle asset ${id}:`, error);
      throw toApiError(error, 'Failed to move asset to recycle bin. Please try again.');
    }
  },

  restore: async (id: string): Promise<void> => {
    try {
      await apiRequest<{ success: boolean; message?: string }>(
        `/api/dashboard/assets/${id}/restore`,
        { method: 'PUT' }         // ← backend route: PUT /:id/restore
      );
    } catch (error) {
      console.error(`Failed to restore asset ${id}:`, error);
      throw toApiError(error, 'Failed to restore asset. Please try again.');
    }
  },
};
