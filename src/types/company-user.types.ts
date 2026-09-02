export interface CompanyUser {
  id: string;
  companyName: string;
  companyGST: string;
  mobileNumber: string;
  companyEmail: string;
  uniqueCode: string;
  subscriptionName: string;
  subscriptionFromDate: string | null;
  subscriptionToDate: string | null;
  totalUserInCompany: number | string;
  status?: string;
  blockedReason?: string;
}

export interface CompanyUsersResponse {
  data: CompanyUser[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AddCompanyUserFormState {
  companyName: string;
  companyGST: string;
  mobileNumber: string;
  companyGmail: string;
  uniqueCode: string;
  subscriptionName: string;
  subscriptionFromDate: string;
  subscriptionToDate: string;
  totalUserInCompany: string;
}
