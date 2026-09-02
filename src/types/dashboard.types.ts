// ─── Asset Stats ─────────────────────────────────────────────────────────────

export interface AssetStats {
  total: number;
  active?: number;
  sold: number;
  scraped: number;
  recycled?: number;
  totalValue?: number;
}

// ─── Branch ──────────────────────────────────────────────────────────────────

export interface Branch {
  id: string;
  name: string;
  address: string;
  category: string; // e.g. "Yes, Long term" | "No" | "Yes, Short term"
  pincode?: string;
}

export interface BranchesResponse {
  data: Branch[];
  total: number;
}

// ─── Department ───────────────────────────────────────────────────────────────

export interface Department {
  id: string;
  departmentName: string;
  deptManagerName: string;
}

export interface DepartmentsResponse {
  data: Department[];
  total: number;
}

// ─── Asset Usage ─────────────────────────────────────────────────────────────

export interface AssetUsageEntry {
  id: string;
  name: string;
  value: number;
  label: string;
}

export interface DeptAssetUsage {
  id: string;
  departmentName: string;
  assetCount: number;
}

export interface BranchAssetUsage {
  id: string;
  branchName: string;
  assetCount: number;
}

// ─── Asset Transfer ───────────────────────────────────────────────────────────

export interface AssetTransfer {
  id: string;
  assetName: string;
  fromBranch: string;
  toBranch: string;
  transferDate: string;
  status: string;
}

// ─── Asset Decommission ───────────────────────────────────────────────────────

export interface AssetDecommission {
  id: string;
  assetName: string;
  reason: string;
  decommissionDate: string;
  approvedBy: string;
}
