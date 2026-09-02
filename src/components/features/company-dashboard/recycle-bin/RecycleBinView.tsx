'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DeleteButton } from '@/src/components/ui/DeleteButton';
import type { Asset, AssetCategory, Branch, Department } from '@/src/types';

// ── Assets tab ──────────────────────────────────────────────────────────────

function AssetsRecycleBin() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadAssets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { assetService } = await import('@/src/services/company-dashboard/asset.service');
      const data = await assetService.listRecycled();
      setAssets(data);
    } catch (err) {
      console.error('Failed to load recycled assets:', err);
      setError('Could not load recycled assets. Please try again.');
      setAssets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadAssets(); }, [loadAssets]);

  const handleRestore = async (id: string) => {
    try {
      setActionId(id);
      const { assetService } = await import('@/src/services/company-dashboard/asset.service');
      await assetService.restore(id);
      await loadAssets();
    } catch (err) {
      console.error('Failed to restore asset:', err);
      setError('Failed to restore asset. Please try again.');
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setActionId(id);
      const { assetService } = await import('@/src/services/company-dashboard/asset.service');
      await assetService.delete(id);
      await loadAssets();
    } catch (err) {
      console.error('Failed to delete asset:', err);
      setError('Failed to delete asset. Please try again.');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-3 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}
      <div className="overflow-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[#EEF4FC] border-b border-gray-200">
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700">Asset Name</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Category</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Company</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Vendor</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Qty</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Cost (₹)</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Reason</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-[#1A7DE8] border-t-transparent rounded-full animate-spin" />
                    Loading recycled assets…
                  </div>
                </td>
              </tr>
            ) : assets.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-400">No recycled assets found.</td>
              </tr>
            ) : (
              assets.map((asset, idx) => (
                <tr key={asset.id} className={`border-b border-gray-100 hover:bg-blue-50/20 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFF]'}`}>
                  <td className="px-5 py-2.5 text-left text-gray-900 font-medium whitespace-nowrap">{asset.assetName}</td>
                  <td className="px-4 py-2.5 text-center text-gray-700 whitespace-nowrap">{asset.assetCategory || '—'}</td>
                  <td className="px-4 py-2.5 text-center text-gray-700 whitespace-nowrap">{asset.assetCompanyName || '—'}</td>
                  <td className="px-4 py-2.5 text-center text-gray-700 whitespace-nowrap">{asset.vendorName || '—'}</td>
                  <td className="px-4 py-2.5 text-center text-gray-700 whitespace-nowrap">{asset.assetQuantity}</td>
                  <td className="px-4 py-2.5 text-center text-gray-700 whitespace-nowrap">
                    {asset.acquisitionCost != null ? Number(asset.acquisitionCost).toLocaleString('en-IN') : '—'}
                  </td>
                  <td className="px-4 py-2.5 text-center max-w-[180px]">
                    <span className="text-xs text-gray-500 line-clamp-2">{asset.assetDescription || '—'}</span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button type="button" onClick={() => handleRestore(asset.id)} disabled={actionId === asset.id}
                        className="rounded-lg bg-[#1A7DE8] px-3 py-1.5 text-xs text-white hover:bg-[#1669C9] disabled:opacity-40 transition-colors whitespace-nowrap">
                        {actionId === asset.id ? '…' : 'Restore'}
                      </button>
                      <DeleteButton onClick={() => handleDelete(asset.id)} disabled={actionId === asset.id} className="scale-75 origin-left" />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Categories tab ───────────────────────────────────────────────────────────

function CategoriesRecycleBin() {
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { assetCategoryService } = await import('@/src/services/company-dashboard/asset-category.service');
      const res = await assetCategoryService.listRecycled();
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to load recycled categories:', err);
      setError('Could not load recycled categories. Please try again.');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadCategories(); }, [loadCategories]);

  const handleRestore = async (id: string) => {
    try {
      setActionId(id);
      const { assetCategoryService } = await import('@/src/services/company-dashboard/asset-category.service');
      await assetCategoryService.restore(id);
      await loadCategories();
    } catch (err) {
      console.error('Failed to restore category:', err);
      setError('Failed to restore category.');
    } finally {
      setActionId(null);
    }
  };

  const handleHardDelete = async (id: string) => {
    try {
      setActionId(id);
      const { assetCategoryService } = await import('@/src/services/company-dashboard/asset-category.service');
      await assetCategoryService.hardDelete(id);
      await loadCategories();
    } catch (err) {
      console.error('Failed to delete category:', err);
      setError('Failed to permanently delete category.');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-3 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}
      <div className="overflow-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm border-collapse min-w-[500px]">
          <thead>
            <tr className="bg-[#EEF4FC] border-b border-gray-200">
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">Category Name</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">Category Code</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-sm text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-[#1A7DE8] border-t-transparent rounded-full animate-spin" />
                    Loading recycled categories…
                  </div>
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-sm text-gray-400">No recycled categories found.</td>
              </tr>
            ) : (
              categories.map((cat, idx) => (
                <tr key={cat.id} className={`border-b border-gray-100 hover:bg-blue-50/20 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFF]'}`}>
                  <td className="px-6 py-3 text-center text-gray-900">{cat.categoryName}</td>
                  <td className="px-6 py-3 text-center text-gray-700">{cat.categoryCode || '—'}</td>
                  <td className="px-6 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button type="button" onClick={() => handleRestore(cat.id)} disabled={actionId === cat.id}
                        className="rounded-lg bg-[#1A7DE8] px-3 py-1.5 text-xs text-white hover:bg-[#1669C9] disabled:opacity-40 transition-colors">
                        {actionId === cat.id ? '…' : 'Restore'}
                      </button>
                      <DeleteButton onClick={() => handleHardDelete(cat.id)} disabled={actionId === cat.id} className="scale-75 origin-left" />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Branches tab ─────────────────────────────────────────────────────────────

function BranchesRecycleBin() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadBranches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { orgService } = await import('@/src/services');
      const data = await orgService.listRecycledBranches();
      setBranches(data);
    } catch (err) {
      console.error('Failed to load recycled branches:', err);
      setError('Could not load recycled branches. Please try again.');
      setBranches([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadBranches(); }, [loadBranches]);

  const handleRestore = async (id: string) => {
    try {
      setActionId(id);
      const { orgService } = await import('@/src/services');
      await orgService.restoreBranch(id);
      await loadBranches();
    } catch (err) {
      console.error('Failed to restore branch:', err);
      setError('Failed to restore branch.');
    } finally {
      setActionId(null);
    }
  };

  const handleHardDelete = async (id: string) => {
    try {
      setActionId(id);
      const { orgService } = await import('@/src/services');
      await orgService.hardDeleteBranch(id);
      await loadBranches();
    } catch (err) {
      console.error('Failed to delete branch:', err);
      setError('Failed to permanently delete branch.');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-3 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}
      <div className="overflow-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm border-collapse min-w-[500px]">
          <thead>
            <tr className="bg-[#EEF4FC] border-b border-gray-200">
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">Branch Name</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">Category</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-sm text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-[#1A7DE8] border-t-transparent rounded-full animate-spin" />
                    Loading recycled branches…
                  </div>
                </td>
              </tr>
            ) : branches.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-sm text-gray-400">No recycled branches found.</td>
              </tr>
            ) : (
              branches.map((b, idx) => (
                <tr key={b.id} className={`border-b border-gray-100 hover:bg-blue-50/20 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFF]'}`}>
                  <td className="px-6 py-3 text-center text-gray-900">{b.name}</td>
                  <td className="px-6 py-3 text-center text-gray-700">{b.category || '—'}</td>
                  <td className="px-6 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button type="button" onClick={() => handleRestore(b.id)} disabled={actionId === b.id}
                        className="rounded-lg bg-[#1A7DE8] px-3 py-1.5 text-xs text-white hover:bg-[#1669C9] disabled:opacity-40 transition-colors">
                        {actionId === b.id ? '…' : 'Restore'}
                      </button>
                      <DeleteButton onClick={() => handleHardDelete(b.id)} disabled={actionId === b.id} className="scale-75 origin-left" />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Departments tab ──────────────────────────────────────────────────────────

function DepartmentsRecycleBin() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadDepartments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { orgService } = await import('@/src/services');
      const data = await orgService.listRecycledDepartments();
      setDepartments(data);
    } catch (err) {
      console.error('Failed to load recycled departments:', err);
      setError('Could not load recycled departments. Please try again.');
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadDepartments(); }, [loadDepartments]);

  const handleRestore = async (id: string) => {
    try {
      setActionId(id);
      const { orgService } = await import('@/src/services');
      await orgService.restoreDepartment(id);
      await loadDepartments();
    } catch (err) {
      console.error('Failed to restore department:', err);
      setError('Failed to restore department.');
    } finally {
      setActionId(null);
    }
  };

  const handleHardDelete = async (id: string) => {
    try {
      setActionId(id);
      const { orgService } = await import('@/src/services');
      await orgService.hardDeleteDepartment(id);
      await loadDepartments();
    } catch (err) {
      console.error('Failed to delete department:', err);
      setError('Failed to permanently delete department.');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-3 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}
      <div className="overflow-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm border-collapse min-w-[500px]">
          <thead>
            <tr className="bg-[#EEF4FC] border-b border-gray-200">
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">Department Name</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">Manager Name</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-sm text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-[#1A7DE8] border-t-transparent rounded-full animate-spin" />
                    Loading recycled departments…
                  </div>
                </td>
              </tr>
            ) : departments.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-sm text-gray-400">No recycled departments found.</td>
              </tr>
            ) : (
              departments.map((d, idx) => (
                <tr key={d.id} className={`border-b border-gray-100 hover:bg-blue-50/20 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFF]'}`}>
                  <td className="px-6 py-3 text-center text-gray-900">{d.departmentName}</td>
                  <td className="px-6 py-3 text-center text-gray-700">{d.deptManagerName || '—'}</td>
                  <td className="px-6 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button type="button" onClick={() => handleRestore(d.id)} disabled={actionId === d.id}
                        className="rounded-lg bg-[#1A7DE8] px-3 py-1.5 text-xs text-white hover:bg-[#1669C9] disabled:opacity-40 transition-colors">
                        {actionId === d.id ? '…' : 'Restore'}
                      </button>
                      <DeleteButton onClick={() => handleHardDelete(d.id)} disabled={actionId === d.id} className="scale-75 origin-left" />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main RecycleBinView ──────────────────────────────────────────────────────

type Tab = 'assets' | 'categories' | 'branches' | 'departments';

export default function RecycleBinView() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('assets');

  return (
    <div className="p-5 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 shrink-0">
        <button type="button" onClick={() => router.back()} className="text-gray-900 hover:text-gray-600 transition-colors">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-gray-900">Recycle Bin</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-gray-100 p-1 rounded-xl w-fit shrink-0">
        {(['assets', 'categories', 'branches', 'departments'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
              activeTab === tab
                ? 'bg-white text-[#1A7DE8] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'assets' && <AssetsRecycleBin />}
        {activeTab === 'categories' && <CategoriesRecycleBin />}
        {activeTab === 'branches' && <BranchesRecycleBin />}
        {activeTab === 'departments' && <DepartmentsRecycleBin />}
      </div>
    </div>
  );
}
