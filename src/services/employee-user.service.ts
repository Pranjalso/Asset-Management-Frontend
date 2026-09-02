import { employeeService } from './employee.service';
import type { EmployeeUser, EmployeeUsersResponse } from '@/src/types';

export const employeeUserService = {
  getAll: async (
    page = 1,
    pageSize = 20,
    status?: string
  ): Promise<EmployeeUsersResponse> => {
    const response = await employeeService.list({ page, pageSize, status });
    return {
      data: response.data.map((employee) => ({
        id: employee.id,
        companyName: employee.companyName,
        employeeName: employee.employeeName,
        mobileNo: employee.mobileNo,
        designation: employee.designation,
        email: employee.email,
        password: employee.password,
        status: employee.status,
        recycleReason: employee.recycleReason,
      })),
      total: response.total,
      page: response.page,
      pageSize: response.pageSize,
    };
  },

  getById: async (id: string): Promise<EmployeeUser> => {
    const employee = await employeeService.getById(id);
    return {
      id: employee.id,
      companyName: employee.companyName,
      employeeName: employee.employeeName,
      mobileNo: employee.mobileNo,
      designation: employee.designation,
      email: employee.email,
      password: employee.password,
      status: employee.status,
      recycleReason: employee.recycleReason,
    };
  },

  create: async (data: Omit<EmployeeUser, 'id'>): Promise<EmployeeUser> => {
    if (!data.companyId) {
      throw new Error('companyId is required to create an employee user');
    }

    const employee = await employeeService.create({
      company_id: data.companyId,
      employee_name: data.employeeName,
      mobile_no: data.mobileNo,
      designation: data.designation,
      email: data.email,
      password: data.password === '••••••••' ? undefined : data.password,
    });
    return {
      id: employee.id,
      companyName: employee.companyName,
      employeeName: employee.employeeName,
      mobileNo: employee.mobileNo,
      designation: employee.designation,
      email: employee.email,
      password: employee.password,
      status: employee.status,
      recycleReason: employee.recycleReason,
    };
  },

  update: async (
    id: string,
    data: Partial<EmployeeUser>
  ): Promise<EmployeeUser> => {
    const employee = await employeeService.update(id, {
      company_id: data.companyId,
      employee_name: data.employeeName,
      mobile_no: data.mobileNo,
      designation: data.designation,
      email: data.email,
      password: data.password === '••••••••' ? undefined : data.password,
    });
    return {
      id: employee.id,
      companyName: employee.companyName,
      employeeName: employee.employeeName,
      mobileNo: employee.mobileNo,
      designation: employee.designation,
      email: employee.email,
      password: employee.password,
      status: employee.status,
      recycleReason: employee.recycleReason,
    };
  },

  delete: async (id: string): Promise<void> => {
    await employeeService.delete(id);
  },

  moveToRecycleBin: async (id: string, reason: string): Promise<void> => {
    await employeeService.recycle(id, reason);
  },

  recover: async (id: string): Promise<EmployeeUser> => {
    const employee = await employeeService.recover(id);
    return {
      id: employee.id,
      companyName: employee.companyName,
      employeeName: employee.employeeName,
      mobileNo: employee.mobileNo,
      designation: employee.designation,
      email: employee.email,
      password: employee.password,
      status: employee.status,
      recycleReason: employee.recycleReason,
    };
  },
};
