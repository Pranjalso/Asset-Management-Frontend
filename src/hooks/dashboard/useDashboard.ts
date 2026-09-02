import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '@/src/services';
import type {
  AssetStats,
  Branch,
  Department,
  DeptAssetUsage,
  BranchAssetUsage,
} from '@/src/types';

// ── Placeholder data (no real data until backend is connected) ────────────────
const PLACEHOLDER_STATS: AssetStats = { total: 0, active: 0, sold: 0, scraped: 0, recycled: 0, totalValue: 0 };

const PLACEHOLDER_BRANCHES: Branch[] = [
  { id: '1', name: 'Haripriya', address: 'Devangar Streer,Thugili', category: 'Yes, Long term' },
  { id: '2', name: 'Dinesh',    address: 'Devangar Streer,Thugili', category: 'No' },
  { id: '3', name: 'Jithesh',   address: 'Devangar Streer,Thugili', category: 'Yes, Short term' },
  { id: '4', name: 'Maha',      address: 'Devangar Streer,Thugili', category: 'Yes, Short term' },
  { id: '5', name: 'Haripriya', address: 'Devangar Streer,Thugili', category: 'No' },
];

const PLACEHOLDER_DEPARTMENTS: Department[] = Array.from({ length: 5 }, (_, i) => ({
  id: String(i + 1),
  departmentName: 'Lorem',
  deptManagerName: 'Lorem',
}));

const PLACEHOLDER_DEPT_USAGE: DeptAssetUsage[] = Array.from({ length: 5 }, (_, i) => ({
  id: String(i + 1),
  departmentName: 'Lorem',
  assetCount: 0,
}));

const PLACEHOLDER_BRANCH_USAGE: BranchAssetUsage[] = Array.from({ length: 5 }, (_, i) => ({
  id: String(i + 1),
  branchName: 'Lorem',
  assetCount: 0,
}));

// ─────────────────────────────────────────────────────────────────────────────
// IMPORTANT: Never call any backend endpoint until NEXT_PUBLIC_API_BASE_URL is
// set.  This prevents 404 console errors when running the UI in isolation.
// ─────────────────────────────────────────────────────────────────────────────
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export function useDashboard() {
  const [stats, setStats]             = useState<AssetStats>(PLACEHOLDER_STATS);
  const [branches, setBranches]       = useState<Branch[]>(PLACEHOLDER_BRANCHES);
  const [departments, setDepartments] = useState<Department[]>(PLACEHOLDER_DEPARTMENTS);
  const [deptUsage, setDeptUsage]     = useState<DeptAssetUsage[]>(PLACEHOLDER_DEPT_USAGE);
  const [branchUsage, setBranchUsage] = useState<BranchAssetUsage[]>(PLACEHOLDER_BRANCH_USAGE);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);

  const fetchAll = useCallback(async (showLoading = false) => {
    if (!API_BASE) {
      setLoading(false);
      return;
    }

    if (showLoading) setLoading(true);
    setError(null);

    const results = await Promise.allSettled([
      dashboardService.getAssetStats(),
      dashboardService.getBranches(),
      dashboardService.getDepartments(),
      dashboardService.getDeptAssetUsage(),
      dashboardService.getBranchAssetUsage(),
    ]);

    const [s, b, d, du, bu] = results;
    const failed: string[] = [];

    if (s.status === 'fulfilled') { setStats(s.value); }
    else { failed.push('asset stats'); setStats(PLACEHOLDER_STATS); }

    if (b.status === 'fulfilled') { setBranches(b.value.data); }
    else { failed.push('branches'); setBranches(PLACEHOLDER_BRANCHES); }

    if (d.status === 'fulfilled') { setDepartments(d.value.data); }
    else { failed.push('departments'); setDepartments(PLACEHOLDER_DEPARTMENTS); }

    if (du.status === 'fulfilled') { setDeptUsage(du.value); }
    else { failed.push('dept usage'); setDeptUsage(PLACEHOLDER_DEPT_USAGE); }

    if (bu.status === 'fulfilled') { setBranchUsage(bu.value); }
    else { failed.push('branch usage'); setBranchUsage(PLACEHOLDER_BRANCH_USAGE); }

    if (failed.length > 0) {
      setError(`Some sections could not be loaded: ${failed.join(', ')}.`);
    }

    setLoading(false);
  }, []);

   
  useEffect(() => { void fetchAll(false); }, [fetchAll]);

  return { stats, branches, departments, deptUsage, branchUsage, loading, error, refetch: fetchAll };
}
