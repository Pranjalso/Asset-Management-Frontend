import { apiRequest } from '@/src/lib/api-client';
import { ApiError, toApiError } from '@/src/lib/service-errors';

  function unwrap<T>(envelope: { success: boolean; data: T; message?: string }): T {
  if (!envelope.success) {
    throw new ApiError(envelope.message || 'Operation failed');
  }
  return envelope.data;
}

// Asset Usage
export interface AssetUsage {
  id: string;
  assetId: string | null;
  assetName: string;
  employeeId: string | null;
  employeeName: string;
  departmentName: string;
  usageCost: number | null;
  usageDate: string | null;
  usageType: string;
  notes: string;
  createdAt: string;
}

export interface CreateAssetUsagePayload {
  asset_id: string;
  employee_id?: string;
  employee_name?: string;
  usage_cost?: number;
  usage_department?: string;
  usage_date?: string;
  usage_type: string;
  notes?: string;
}

// Asset Transfer
export interface AssetTransfer {
  id: string;
  assetId: string | null;
  assetName: string;
  fromBranchId: string | null;
  fromBranchName: string;
  toBranchId: string | null;
  toBranchName: string;
  fromDepartmentId: string | null;
  fromDepartmentName: string;
  toDepartmentId: string | null;
  toDepartmentName: string;
  employeeName: string;
  transferCost: number | null;
  transferDate: string | null;
  transferType: string;
  notes: string;
  status: string;
  createdAt: string;
}

export interface CreateAssetTransferPayload {
  asset_id: string;
  from_branch_id?: string;
  to_branch_id?: string;
  from_department_id?: string;
  to_department_id?: string;
  employee_name?: string;
  transfer_cost?: number;
  transfer_date?: string;
  transfer_type: string;
  notes?: string;
}

// Asset Decommission
export interface AssetDecommission {
  id: string;
  assetId: string | null;
  assetName: string;
  customerName: string;
  vendorName: string;
  invoiceNo: string;
  invoiceDate: string;
  invoiceSoldCost: number | null;
  condition: string;
  decommissionType: string;
  decommissionDate: string | null;
  reason: string;
  salePrice: number | null;
  scrapValue: number | null;
  notes: string;
  status: string;
  createdAt: string;
}

export interface CreateAssetDecommissionPayload {
  asset_id: string;
  decommission_type: string;
  decommission_date?: string;
  reason?: string;
  sale_price?: number;
  scrap_value?: number;
  vendor_name?: string;
  customer_name?: string;
  invoice_number?: string;
  invoice_date?: string;
  notes?: string;
}

// List Response
export interface ListResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export const assetOpsService = {
  // Asset Usage
  listUsage: async (params?: {
    assetId?: string;
    page?: number;
    pageSize?: number;
  }): Promise<ListResponse<AssetUsage>> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.assetId) queryParams.append('assetId', params.assetId);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());

      const response = await apiRequest<{ success: boolean; data: AssetUsage[]; total: number; page: number; pageSize: number }>(
        `/api/dashboard/asset-ops/usage?${queryParams.toString()}`,
        { method: 'GET' }
      );
      return {
        data: response.data,
        total: response.total,
        page: response.page,
        pageSize: response.pageSize
      };
    } catch (error) {
      console.error('Failed to fetch asset usage:', error);
      throw toApiError(error, 'Failed to load asset usage records. Please try again.');
    }
  },

  createUsage: async (data: CreateAssetUsagePayload): Promise<AssetUsage> => {
    try {
      const response = await apiRequest<{ success: boolean; data: AssetUsage; message?: string }>(
        '/api/dashboard/asset-ops/usage',
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
      return unwrap(response);
    } catch (error) {
      console.error('Failed to create asset usage:', error);
      throw toApiError(error, 'Failed to create asset usage record. Please check your input and try again.');
    }
  },

  // Asset Transfer
  listTransfers: async (params?: {
    assetId?: string;
    page?: number;
    pageSize?: number;
  }): Promise<ListResponse<AssetTransfer>> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.assetId) queryParams.append('assetId', params.assetId);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());

      const response = await apiRequest<{ success: boolean; data: AssetTransfer[]; total: number; page: number; pageSize: number }>(
        `/api/dashboard/asset-ops/transfers?${queryParams.toString()}`,
        { method: 'GET' }
      );
      return {
        data: response.data,
        total: response.total,
        page: response.page,
        pageSize: response.pageSize
      };
    } catch (error) {
      console.error('Failed to fetch asset transfers:', error);
      throw toApiError(error, 'Failed to load asset transfer records. Please try again.');
    }
  },

  createTransfer: async (data: CreateAssetTransferPayload): Promise<AssetTransfer> => {
    try {
      const response = await apiRequest<{ success: boolean; data: AssetTransfer; message?: string }>(
        '/api/dashboard/asset-ops/transfers',
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
      return unwrap(response);
    } catch (error) {
      console.error('Failed to create asset transfer:', error);
      throw toApiError(error, 'Failed to create asset transfer record. Please check your input and try again.');
    }
  },

  updateTransferStatus: async (id: string, status: string): Promise<AssetTransfer> => {
    try {
      const response = await apiRequest<{ success: boolean; data: AssetTransfer; message?: string }>(
        `/api/dashboard/asset-ops/transfers/${id}/status`,
        {
          method: 'PUT',
          body: JSON.stringify({ status }),
        }
      );
      return unwrap(response);
    } catch (error) {
      console.error(`Failed to update transfer status for ${id}:`, error);
      throw toApiError(error, 'Failed to update transfer status. Please try again.');
    }
  },

  // Asset Decommission
  listDecommissions: async (params?: {
    assetId?: string;
    decommissionType?: string;
    page?: number;
    pageSize?: number;
  }): Promise<ListResponse<AssetDecommission>> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.assetId) queryParams.append('assetId', params.assetId);
      if (params?.decommissionType) queryParams.append('decommissionType', params.decommissionType);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());

      const response = await apiRequest<{ success: boolean; data: AssetDecommission[]; total: number; page: number; pageSize: number }>(
        `/api/dashboard/asset-ops/decommissions?${queryParams.toString()}`,
        { method: 'GET' }
      );
      return {
        data: response.data,
        total: response.total,
        page: response.page,
        pageSize: response.pageSize
      };
    } catch (error) {
      console.error('Failed to fetch asset decommissions:', error);
      throw toApiError(error, 'Failed to load asset decommission records. Please try again.');
    }
  },

  createDecommission: async (data: CreateAssetDecommissionPayload): Promise<AssetDecommission> => {
    try {
      const response = await apiRequest<{ success: boolean; data: AssetDecommission; message?: string }>(
        '/api/dashboard/asset-ops/decommissions',
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
      return unwrap(response);
    } catch (error) {
      console.error('Failed to create asset decommission:', error);
      throw toApiError(error, 'Failed to create asset decommission record. Please check your input and try again.');
    }
  },

  updateDecommissionStatus: async (id: string, status: string): Promise<AssetDecommission> => {
    try {
      const response = await apiRequest<{ success: boolean; data: AssetDecommission; message?: string }>(
        `/api/dashboard/asset-ops/decommissions/${id}/status`,
        {
          method: 'PUT',
          body: JSON.stringify({ status }),
        }
      );
      return unwrap(response);
    } catch (error) {
      console.error(`Failed to update decommission status for ${id}:`, error);
      throw toApiError(error, 'Failed to update decommission status. Please try again.');
    }
  },
};
