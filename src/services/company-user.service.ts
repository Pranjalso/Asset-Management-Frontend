import { companyService } from './company.service';
import type { CompanyUser, CompanyUsersResponse } from '@/src/types';

// ── helpers ────────────────────────────────────────────────────────────────────
// Backend payloads require string | undefined (not null), number (not string)
const toStr = (v: string | null | undefined): string | undefined =>
  v ?? undefined;

const toNum = (v: string | number | undefined): number | undefined => {
  if (v === undefined || v === null) return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
};

// ── mapper from backend Company → CompanyUser ─────────────────────────────────
const mapCompany = (c: {
  id: string; companyName: string; companyGST: string; mobileNumber: string;
  companyEmail: string; uniqueCode: string; subscriptionName: string;
  subscriptionFromDate: string | null; subscriptionToDate: string | null;
  totalUserInCompany: number; status: string; blockedReason: string;
}): CompanyUser => ({
  id: c.id,
  companyName: c.companyName,
  companyGST: c.companyGST,
  mobileNumber: c.mobileNumber,
  companyEmail: c.companyEmail,
  uniqueCode: c.uniqueCode,
  subscriptionName: c.subscriptionName,
  subscriptionFromDate: c.subscriptionFromDate,
  subscriptionToDate: c.subscriptionToDate,
  totalUserInCompany: c.totalUserInCompany,
  status: c.status,
  blockedReason: c.blockedReason,
});

// ── service ────────────────────────────────────────────────────────────────────
export const companyUserService = {
  getAll: async (
    page = 1,
    pageSize = 20,
    status?: string,
    search?: string
  ): Promise<CompanyUsersResponse> => {
    const response = await companyService.list({ page, pageSize, status, search });
    return {
      data: response.data.map(mapCompany),
      total: response.total,
      page: response.page,
      pageSize: response.pageSize,
    };
  },

  getById: async (id: string): Promise<CompanyUser> => {
    const company = await companyService.getById(id);
    return mapCompany(company);
  },

  create: async (data: Omit<CompanyUser, 'id'>): Promise<CompanyUser> => {
    const company = await companyService.create({
      company_name: data.companyName,
      company_gst: toStr(data.companyGST),
      mobile_number: toStr(data.mobileNumber),
      company_email: data.companyEmail,
      unique_code: data.uniqueCode,
      subscription_name: toStr(data.subscriptionName),
      subscription_from_date: toStr(data.subscriptionFromDate),
      subscription_to_date: toStr(data.subscriptionToDate),
      total_user_in_company: toNum(data.totalUserInCompany),
    });
    return mapCompany(company);
  },

  update: async (id: string, data: Partial<CompanyUser>): Promise<CompanyUser> => {
    const company = await companyService.update(id, {
      company_name: data.companyName,
      company_gst: toStr(data.companyGST),
      mobile_number: toStr(data.mobileNumber),
      company_email: data.companyEmail,
      unique_code: data.uniqueCode,
      subscription_name: toStr(data.subscriptionName),
      subscription_from_date: toStr(data.subscriptionFromDate),
      subscription_to_date: toStr(data.subscriptionToDate),
      total_user_in_company: toNum(data.totalUserInCompany),
      status: data.status,
      blocked_reason: toStr(data.blockedReason),
    });
    return mapCompany(company);
  },

  delete: async (id: string): Promise<void> => {
    await companyService.delete(id);
  },

  block: async (id: string, reason: string): Promise<void> => {
    await companyService.block(id, reason);
  },

  unblock: async (id: string): Promise<void> => {
    await companyService.unblock(id);
  },
};
