import { apiRequest } from '@/src/lib/api-client';
import { ApiError, toApiError } from '@/src/lib/service-errors';

  function unwrap<T>(envelope: { success: boolean; data: T; message?: string }): T {
  if (!envelope.success) {
    throw new ApiError(envelope.message || 'Operation failed');
  }
  return envelope.data;
}

// Branch
export interface Branch {
  id: string;
  name: string;
  address: string;
  category: string;
  pincode: string;
  status: string;
}

export interface CreateBranchPayload {
  name: string;
  address?: string;
  pincode?: string;
  category?: string;
}

export interface UpdateBranchPayload {
  name?: string;
  address?: string;
  pincode?: string;
  category?: string;
  status?: string;
}

// Department
export interface Department {
  id: string;
  departmentName: string;
  deptManagerName: string;
}

export interface CreateDepartmentPayload {
  department_name: string;
  dept_manager_name?: string;
}

export interface UpdateDepartmentPayload {
  department_name?: string;
  dept_manager_name?: string;
}

// Category
export interface Category {
  id: string;
  categoryName: string;
  categoryCode: string;
}

export interface CreateCategoryPayload {
  category_name: string;
  category_code?: string;
}

export interface UpdateCategoryPayload {
  category_name?: string;
  category_code?: string;
}

// List Response
export interface ListResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export const orgService = {
  // Branch Management
  listBranches: async (params?: {
    status?: string;
    page?: number;
    pageSize?: number;
    search?: string;
  }): Promise<ListResponse<Branch>> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
      if (params?.search) queryParams.append('search', params.search);

      const response = await apiRequest<{ success: boolean; data: Branch[]; total: number; page: number; pageSize: number }>(
        `/api/dashboard/org/branches?${queryParams.toString()}`,
        { method: 'GET' }
      );
      return {
        data: response.data,
        total: response.total,
        page: response.page,
        pageSize: response.pageSize
      };
    } catch (error) {
      console.error('Failed to fetch branches:', error);
      throw toApiError(error, 'Failed to load branches. Please try again.');
    }
  },

  createBranch: async (data: CreateBranchPayload): Promise<Branch> => {
    try {
      const response = await apiRequest<{ success: boolean; data: Branch; message?: string }>(
        '/api/dashboard/org/branches',
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
      return unwrap(response);
    } catch (error) {
      console.error('Failed to create branch:', error);
      throw toApiError(error, 'Failed to create branch. Please check your input and try again.');
    }
  },

  updateBranch: async (id: string, data: UpdateBranchPayload): Promise<Branch> => {
    try {
      const response = await apiRequest<{ success: boolean; data: Branch; message?: string }>(
        `/api/dashboard/org/branches/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(data),
        }
      );
      return unwrap(response);
    } catch (error) {
      console.error(`Failed to update branch ${id}:`, error);
      throw toApiError(error, 'Failed to update branch. Please try again.');
    }
  },

  deleteBranch: async (id: string): Promise<void> => {
    try {
      await apiRequest<{ success: boolean; message?: string }>(
        `/api/dashboard/org/branches/${id}`,
        { method: 'DELETE' }
      );
    } catch (error) {
      console.error(`Failed to delete branch ${id}:`, error);
      throw toApiError(error, 'Failed to delete branch. Please try again.');
    }
  },

  listRecycledBranches: async (): Promise<Branch[]> => {
    try {
      const response = await apiRequest<{ success: boolean; data: Branch[] }>(
        '/api/dashboard/org/branches/recycled',
        { method: 'GET' }
      );
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch recycled branches:', error);
      throw toApiError(error, 'Failed to fetch recycled branches.');
    }
  },

  restoreBranch: async (id: string): Promise<void> => {
    try {
      await apiRequest(`/api/dashboard/org/branches/${id}/restore`, { method: 'POST' });
    } catch (error) {
      console.error(`Failed to restore branch ${id}:`, error);
      throw toApiError(error, 'Failed to restore branch.');
    }
  },

  hardDeleteBranch: async (id: string): Promise<void> => {
    try {
      await apiRequest(`/api/dashboard/org/branches/${id}/permanent`, { method: 'DELETE' });
    } catch (error) {
      console.error(`Failed to permanently delete branch ${id}:`, error);
      throw toApiError(error, 'Failed to permanently delete branch.');
    }
  },

  // Department Management
  listDepartments: async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }): Promise<ListResponse<Department>> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
      if (params?.search) queryParams.append('search', params.search);

      const response = await apiRequest<{ success: boolean; data: Department[]; total: number; page: number; pageSize: number }>(
        `/api/dashboard/org/departments?${queryParams.toString()}`,
        { method: 'GET' }
      );
      return {
        data: response.data,
        total: response.total,
        page: response.page,
        pageSize: response.pageSize
      };
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      throw toApiError(error, 'Failed to load departments. Please try again.');
    }
  },

  createDepartment: async (data: CreateDepartmentPayload): Promise<Department> => {
    try {
      const response = await apiRequest<{ success: boolean; data: Department; message?: string }>(
        '/api/dashboard/org/departments',
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
      return unwrap(response);
    } catch (error) {
      console.error('Failed to create department:', error);
      throw toApiError(error, 'Failed to create department. Please check your input and try again.');
    }
  },

  updateDepartment: async (id: string, data: UpdateDepartmentPayload): Promise<Department> => {
    try {
      const response = await apiRequest<{ success: boolean; data: Department; message?: string }>(
        `/api/dashboard/org/departments/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(data),
        }
      );
      return unwrap(response);
    } catch (error) {
      console.error(`Failed to update department ${id}:`, error);
      throw toApiError(error, 'Failed to update department. Please try again.');
    }
  },

  deleteDepartment: async (id: string): Promise<void> => {
    try {
      await apiRequest<{ success: boolean; message?: string }>(
        `/api/dashboard/org/departments/${id}`,
        { method: 'DELETE' }
      );
    } catch (error) {
      console.error(`Failed to delete department ${id}:`, error);
      throw toApiError(error, 'Failed to delete department. Please try again.');
    }
  },

  listRecycledDepartments: async (): Promise<Department[]> => {
    try {
      const response = await apiRequest<{ success: boolean; data: Department[] }>(
        '/api/dashboard/org/departments/recycled',
        { method: 'GET' }
      );
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch recycled departments:', error);
      throw toApiError(error, 'Failed to fetch recycled departments.');
    }
  },

  restoreDepartment: async (id: string): Promise<void> => {
    try {
      await apiRequest(`/api/dashboard/org/departments/${id}/restore`, { method: 'POST' });
    } catch (error) {
      console.error(`Failed to restore department ${id}:`, error);
      throw toApiError(error, 'Failed to restore department.');
    }
  },

  hardDeleteDepartment: async (id: string): Promise<void> => {
    try {
      await apiRequest(`/api/dashboard/org/departments/${id}/permanent`, { method: 'DELETE' });
    } catch (error) {
      console.error(`Failed to permanently delete department ${id}:`, error);
      throw toApiError(error, 'Failed to permanently delete department.');
    }
  },

  // Asset Categories
  listCategories: async (params?: {
    page?: number;
    pageSize?: number;
  }): Promise<ListResponse<Category>> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());

      const response = await apiRequest<{ success: boolean; data: Category[]; total: number; page: number; pageSize: number }>(
        `/api/dashboard/org/categories?${queryParams.toString()}`,
        { method: 'GET' }
      );
      return {
        data: response.data,
        total: response.total,
        page: response.page,
        pageSize: response.pageSize
      };
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw toApiError(error, 'Failed to load categories. Please try again.');
    }
  },

  createCategory: async (data: CreateCategoryPayload): Promise<Category> => {
    try {
      const response = await apiRequest<{ success: boolean; data: Category; message?: string }>(
        '/api/dashboard/org/categories',
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
      return unwrap(response);
    } catch (error) {
      console.error('Failed to create category:', error);
      throw toApiError(error, 'Failed to create category. Please check your input and try again.');
    }
  },

  updateCategory: async (id: string, data: UpdateCategoryPayload): Promise<Category> => {
    try {
      const response = await apiRequest<{ success: boolean; data: Category; message?: string }>(
        `/api/dashboard/org/categories/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(data),
        }
      );
      return unwrap(response);
    } catch (error) {
      console.error(`Failed to update category ${id}:`, error);
      throw toApiError(error, 'Failed to update category. Please try again.');
    }
  },

  deleteCategory: async (id: string): Promise<void> => {
    try {
      await apiRequest<{ success: boolean; message?: string }>(
        `/api/dashboard/org/categories/${id}`,
        { method: 'DELETE' }
      );
    } catch (error) {
      console.error(`Failed to delete category ${id}:`, error);
      throw toApiError(error, 'Failed to delete category. Please try again.');
    }
  },
};
