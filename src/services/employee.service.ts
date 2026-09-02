import { apiRequest } from '@/src/lib/api-client';
import { ApiError, toApiError } from '@/src/lib/service-errors';

  function unwrap<T>(envelope: { success: boolean; data: T; message?: string }): T {
  if (!envelope.success) {
    throw new ApiError(envelope.message || 'Operation failed');
  }
  return envelope.data;
}

export interface Employee {
  id: string;
  companyId: string;
  companyName: string;
  employeeName: string;
  mobileNo: string;
  designation: string;
  email: string;
  password: string;
  status: string;
  recycleReason: string;
}

export interface CreateEmployeePayload {
  company_id: string;
  employee_name: string;
  mobile_no?: string;
  designation?: string;
  email: string;
  password?: string;
}

export interface UpdateEmployeePayload {
  company_id?: string;
  employee_name?: string;
  mobile_no?: string;
  designation?: string;
  email?: string;
  password?: string;
}

export interface EmployeeListResponse {
  data: Employee[];
  total: number;
  page: number;
  pageSize: number;
}

export const employeeService = {
  list: async (params?: {
    status?: string;
    page?: number;
    pageSize?: number;
    companyId?: string;
  }): Promise<EmployeeListResponse> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
      if (params?.companyId) queryParams.append('companyId', params.companyId);

      const response = await apiRequest<{ success: boolean; data: Employee[]; total: number; page: number; pageSize: number }>(
        `/api/dashboard/employees?${queryParams.toString()}`,
        { method: 'GET' }
      );
      return {
        data: response.data,
        total: response.total,
        page: response.page,
        pageSize: response.pageSize
      };
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      throw toApiError(error, 'Failed to load employees. Please try again.');
    }
  },

  getById: async (id: string): Promise<Employee> => {
    try {
      const response = await apiRequest<{ success: boolean; data: Employee }>(
        `/api/dashboard/employees/${id}`,
        { method: 'GET' }
      );
      return unwrap(response);
    } catch (error) {
      console.error(`Failed to fetch employee ${id}:`, error);
      throw toApiError(error, 'Failed to load employee details. Please try again.');
    }
  },

  create: async (data: CreateEmployeePayload): Promise<Employee> => {
    try {
      const response = await apiRequest<{ success: boolean; data: Employee; message?: string }>(
        '/api/dashboard/employees',
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
      return unwrap(response);
    } catch (error) {
      console.error('Failed to create employee:', error);
      throw toApiError(error, 'Failed to create employee. Please check your input and try again.');
    }
  },

  update: async (id: string, data: UpdateEmployeePayload): Promise<Employee> => {
    try {
      const response = await apiRequest<{ success: boolean; data: Employee; message?: string }>(
        `/api/dashboard/employees/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(data),
        }
      );
      return unwrap(response);
    } catch (error) {
      console.error(`Failed to update employee ${id}:`, error);
      throw toApiError(error, 'Failed to update employee. Please try again.');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiRequest<{ success: boolean; message?: string }>(
        `/api/dashboard/employees/${id}`,
        { method: 'DELETE' }
      );
    } catch (error) {
      console.error(`Failed to delete employee ${id}:`, error);
      throw toApiError(error, 'Failed to delete employee. Please try again.');
    }
  },

  recycle: async (id: string, reason: string): Promise<Employee> => {
    try {
      const response = await apiRequest<{ success: boolean; data: Employee; message?: string }>(
        `/api/dashboard/employees/${id}/recycle`,
        {
          method: 'POST',
          body: JSON.stringify({ reason }),
        }
      );
      return unwrap(response);
    } catch (error) {
      console.error(`Failed to recycle employee ${id}:`, error);
      throw toApiError(error, 'Failed to recycle employee. Please try again.');
    }
  },

  recover: async (id: string): Promise<Employee> => {
    try {
      const response = await apiRequest<{ success: boolean; data: Employee; message?: string }>(
        `/api/dashboard/employees/${id}/recover`,
        { method: 'POST' }
      );
      return unwrap(response);
    } catch (error) {
      console.error(`Failed to recover employee ${id}:`, error);
      throw toApiError(error, 'Failed to recover employee. Please try again.');
    }
  },
};
