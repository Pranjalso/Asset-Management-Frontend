import { apiRequest } from '@/src/lib/api-client';
import { orgService } from './org.service';
import { assetOpsService } from './assetOps.service';
import type {
  AssetStats,
  BranchesResponse,
  DepartmentsResponse,
  DeptAssetUsage,
  BranchAssetUsage,
  AssetTransfer,
  AssetDecommission,
} from '@/src/types';

export interface CompanyDashboardUsage {
  departments: DeptAssetUsage[];
  branches: BranchAssetUsage[];
  departmentCosts: { name: string; cost: number }[];
  branchCosts: { name: string; cost: number }[];
}

export interface AdminDashboardStats {
  companies: { total: number; active: number; blocked: number };
  employees: { total: number; active: number; recycled: number };
  assets: { total: number; active: number; sold: number; scraped: number; totalValue: number };
  recentCompanies: {
    id: string; companyName: string; companyEmail: string; status: string; createdAt: string;
  }[];
}

interface CompanyDashboardSummary {
  counts: {
    total: number; active: number; sold: number; scraped: number; recycled: number;
    // Backend currently serialises this as `totalvalue`; accept both spellings.
    totalValue?: number; totalvalue?: number;
  };
  departments: DeptAssetUsage[];
  branches: BranchAssetUsage[];
}

class ApiError extends Error { constructor(msg: string) { super(msg); this.name = 'ApiError'; } }
function unwrap<T>(e: { success: boolean; data: T; message?: string }) {
  if (!e.success) throw new ApiError(e.message || 'Failed');
  return e.data;
}

// ── Tiny request de-duplication cache ────────────────────────────────────────
// Several widgets need the same /stats/summary payload. Without this, a single
// dashboard render fired 3+ identical requests. Errors are NOT swallowed here:
// if the API fails the caller's error UI shows instead of fake "00" values.
let summaryCache: Promise<CompanyDashboardSummary> | null = null;
const SUMMARY_CACHE_TTL = 5_000; // ms
let summaryCacheAt = 0;

function invalidateSummaryCache() {
  summaryCache = null;
  summaryCacheAt = 0;
}

export const dashboardService = {
  getAdminStats: async (): Promise<AdminDashboardStats> => {
    const r = await apiRequest<{ success: boolean; data: AdminDashboardStats }>(
      '/api/dashboard/admin/stats', { method: 'GET' }
    );
    return unwrap(r);
  },

  getCompanyDashboard: async (): Promise<{
    counts: { total: number; active: number; sold: number; scraped: number; recycled: number; totalValue: number };
    departments: DeptAssetUsage[];
    branches: BranchAssetUsage[];
  }> => {
    const now = Date.now();
    if (!summaryCache || now - summaryCacheAt > SUMMARY_CACHE_TTL) {
      summaryCacheAt = now;
      summaryCache = apiRequest<{ success: boolean; data: CompanyDashboardSummary }>(
        '/api/dashboard/assets/stats/summary', { method: 'GET' }
      ).then((r) => unwrap(r));
      // Do not cache rejected promises: allow immediate retry on failure.
      summaryCache.catch(() => invalidateSummaryCache());
    }
    const summary = await summaryCache;
    return {
      counts: {
        total: summary.counts.total ?? 0,
        active: summary.counts.active ?? 0,
        sold: summary.counts.sold ?? 0,
        scraped: summary.counts.scraped ?? 0,
        recycled: summary.counts.recycled ?? 0,
        totalValue: summary.counts.totalValue ?? summary.counts.totalvalue ?? 0,
      },
      departments: summary.departments ?? [],
      branches: summary.branches ?? [],
    };
  },

  getCompanyUsage: async (categoryId?: string | null): Promise<CompanyDashboardUsage> => {
    const queryParams = new URLSearchParams();
    if (categoryId) queryParams.append('category_id', categoryId);
    
    const r = await apiRequest<{ success: boolean; data: CompanyDashboardUsage }>(
      `/api/dashboard/usage${queryParams.toString() ? `?${queryParams.toString()}` : ''}`, 
      { method: 'GET' }
    );
    return unwrap(r);
  },

  getAssetStats: async (): Promise<AssetStats> => {
    const summary = await dashboardService.getCompanyDashboard();
    
    let soldCount = summary.counts.sold || 0;
    let scrapedCount = summary.counts.scraped || 0;

    // Dynamically calculate missing counts from the actual decommission records
    try {
      if (soldCount === 0) {
        const soldRes = await assetOpsService.listDecommissions({ decommissionType: 'sale', pageSize: 1 });
        soldCount = soldRes.total || 0;
      }
      if (scrapedCount === 0) {
        const scrapRes = await assetOpsService.listDecommissions({ decommissionType: 'scrape', pageSize: 1 });
        scrapedCount = scrapRes.total || 0;
      }
    } catch (e) {
      // Ignore API errors and fallback to summary values
    }

    return {
      total: summary.counts.total || 0,
      active: summary.counts.active || 0,
      sold: soldCount,
      scraped: scrapedCount,
      recycled: summary.counts.recycled || 0,
      totalValue: summary.counts.totalValue || 0,
    };
  },

  getBranches: async (page = 1, pageSize = 5): Promise<BranchesResponse> => {
    const response = await orgService.listBranches({ page, pageSize });
    return {
      data: response.data.map((branch) => ({
        id: branch.id,
        name: branch.name,
        address: branch.address,
        category: branch.category,
      })),
      total: response.total,
    };
  },

  getDepartments: async (
    page = 1,
    pageSize = 5
  ): Promise<DepartmentsResponse> => {
    const response = await orgService.listDepartments({ page, pageSize });
    return {
      data: response.data.map((dept) => ({
        id: dept.id,
        departmentName: dept.departmentName,
        deptManagerName: dept.deptManagerName,
      })),
      total: response.total,
    };
  },

  getDeptAssetUsage: async (): Promise<DeptAssetUsage[]> => {
    const summary = await dashboardService.getCompanyDashboard();
    return summary.departments || [];
  },

  getBranchAssetUsage: async (): Promise<BranchAssetUsage[]> => {
    const summary = await dashboardService.getCompanyDashboard();
    return summary.branches || [];
  },

  getAssetTransfers: async (
    page = 1,
    pageSize = 10
  ): Promise<{ data: AssetTransfer[]; total: number }> => {
    const response = await assetOpsService.listTransfers({ page, pageSize });
    return {
      data: response.data.map((transfer) => ({
        id: transfer.id,
        assetName: transfer.assetName,
        fromBranch: transfer.fromBranchName,
        toBranch: transfer.toBranchName,
        transferDate: transfer.transferDate || '',
        status: transfer.status,
      })),
      total: response.total,
    };
  },

  getAssetDecommissions: async (
    page = 1,
    pageSize = 10
  ): Promise<{ data: AssetDecommission[]; total: number }> => {
    const response = await assetOpsService.listDecommissions({ page, pageSize });
    return {
      data: response.data.map((decommission) => ({
        id: decommission.id,
        assetName: decommission.assetName,
        reason: decommission.reason,
        decommissionDate: decommission.decommissionDate || '',
        approvedBy: 'System',
      })),
      total: response.total,
    };
  },
};