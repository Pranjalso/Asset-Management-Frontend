import { apiRequest } from '@/src/lib/api-client';
import { ApiError, toApiError } from '@/src/lib/service-errors';

export interface Company {
  id: string;
  userId: string | null;
  companyName: string;
  companyGST: string;
  mobileNumber: string;
  companyEmail: string;
  uniqueCode: string;
  subscriptionName: string;
  subscriptionFromDate: string | null;
  subscriptionToDate: string | null;
  totalUserInCompany: number;
  status: string;
  blockedReason: string;
  createdAt: string;
}

export interface CreateCompanyPayload {
  user_id?: string;
  company_name: string;
  company_gst?: string;
  mobile_number?: string;
  company_email: string;
  unique_code: string;
  subscription_name?: string;
  subscription_from_date?: string;
  subscription_to_date?: string;
  total_user_in_company?: number;
}

export interface UpdateCompanyPayload {
  company_name?: string;
  company_gst?: string;
  mobile_number?: string;
  company_email?: string;
  unique_code?: string;
  subscription_name?: string;
  subscription_from_date?: string;
  subscription_to_date?: string;
  total_user_in_company?: number;
  status?: string;
  blocked_reason?: string;
}

export interface CompanyListResponse {
  data: Company[];
  total: number;
  page: number;
  pageSize: number;
}

function unwrap<T>(envelope: { success: boolean; data: T; message?: string }): T {
  if (!envelope.success) {
    throw new ApiError(envelope.message || 'Operation failed');
  }
  return envelope.data;
}

export const companyService = {
  list: async (params?: {
    status?: string;
    page?: number;
    pageSize?: number;
    search?: string;
  }): Promise<CompanyListResponse> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
      if (params?.search) queryParams.append('search', params.search);

      const response = await apiRequest<{ success: boolean; data: Company[]; total: number; page: number; pageSize: number }>(
        `/api/dashboard/companies?${queryParams.toString()}`,
        { method: 'GET' }
      );
      return {
        data: response.data,
        total: response.total,
        page: response.page,
        pageSize: response.pageSize
      };
    } catch (error) {
      console.error('Failed to fetch companies:', error);
      throw toApiError(error, 'Failed to load companies. Please try again.');
    }
  },

  getById: async (id: string): Promise<Company> => {
    try {
      const response = await apiRequest<{ success: boolean; data: Company }>(
        `/api/dashboard/companies/${id}`,
        { method: 'GET' }
      );
      return unwrap(response);
    } catch (error) {
      console.error(`Failed to fetch company ${id}:`, error);
      throw toApiError(error, 'Failed to load company details. Please try again.');
    }
  },

  create: async (data: CreateCompanyPayload): Promise<Company> => {
    try {
      const response = await apiRequest<{ success: boolean; data: Company; message?: string }>(
        '/api/dashboard/companies',
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
      return unwrap(response);
    } catch (error) {
      console.error('Failed to create company:', error);
      throw toApiError(error, 'Failed to create company. Please check your input and try again.');
    }
  },

  update: async (id: string, data: UpdateCompanyPayload): Promise<Company> => {
    try {
      const response = await apiRequest<{ success: boolean; data: Company; message?: string }>(
        `/api/dashboard/companies/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(data),
        }
      );
      return unwrap(response);
    } catch (error) {
      console.error(`Failed to update company ${id}:`, error);
      throw toApiError(error, 'Failed to update company. Please try again.');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiRequest<{ success: boolean; message?: string }>(
        `/api/dashboard/companies/${id}`,
        { method: 'DELETE' }
      );
    } catch (error) {
      console.error(`Failed to delete company ${id}:`, error);
      throw toApiError(error, 'Failed to delete company. Please try again.');
    }
  },

  block: async (id: string, blockedReason: string): Promise<Company> => {
    try {
      const response = await apiRequest<{ success: boolean; data: Company; message?: string }>(
        `/api/dashboard/companies/${id}/block`,
        {
          method: 'POST',
          body: JSON.stringify({ blocked_reason: blockedReason }),
        }
      );
      return unwrap(response);
    } catch (error) {
      console.error(`Failed to block company ${id}:`, error);
      throw toApiError(error, 'Failed to block company. Please try again.');
    }
  },

  unblock: async (id: string): Promise<Company> => {
    try {
      const response = await apiRequest<{ success: boolean; data: Company; message?: string }>(
        `/api/dashboard/companies/${id}/unblock`,
        { method: 'POST' }
      );
      return unwrap(response);
    } catch (error) {
      console.error(`Failed to unblock company ${id}:`, error);
      throw toApiError(error, 'Failed to unblock company. Please try again.');
    }
  },
};
