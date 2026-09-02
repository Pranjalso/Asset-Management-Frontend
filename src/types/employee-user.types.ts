export interface EmployeeUser {
  id: string;
  companyName: string;
  employeeName: string;
  mobileNo: string;
  designation: string;
  email: string;
  password: string;
  // Extended fields
  companyId?: string;
  status?: string;
  recycleReason?: string;
}

export interface EmployeeUsersResponse {
  data: EmployeeUser[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AddEmployeeUserFormState {
  companyId: string;
  companyName: string;
  employeeName: string;
  mobileNumber: string;
  designation: string;
  email: string;
  password: string;
}
