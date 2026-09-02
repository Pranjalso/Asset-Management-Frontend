import { useState, useEffect, useCallback } from 'react';
import { orgService } from '@/src/services';
import type { Branch } from '@/src/types';


export function useBranches(initialSearch?: string) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const fetchAll = useCallback(async (showLoading = false, search?: string) => {
    if (showLoading) setLoading(true);
    try {
      setError(null);
      const res = await orgService.listBranches({ search });
      setBranches(res.data);
    } catch (err: unknown) {
      console.error('Failed to fetch branches:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch branches');
      setBranches([]);
    } finally {
      setLoading(false);
    }
  }, []);

   
  useEffect(() => { void fetchAll(false, initialSearch); }, [fetchAll, initialSearch]);

  const deleteBranch = async (id: string) => {
    await orgService.deleteBranch(id);
    await fetchAll(true);
  };

  const addBranch = async (data: Parameters<typeof orgService.createBranch>[0]) => {
    await orgService.createBranch(data);
    await fetchAll(true);
  };

  const updateBranch = async (id: string, data: Parameters<typeof orgService.updateBranch>[1]) => {
    await orgService.updateBranch(id, data);
    await fetchAll(true);
  };

  const listRecycledBranches = async () => {
    return await orgService.listRecycledBranches();
  };

  const restoreBranch = async (id: string) => {
    await orgService.restoreBranch(id);
    await fetchAll(true);
  };

  const hardDeleteBranch = async (id: string) => {
    await orgService.hardDeleteBranch(id);
    await fetchAll(true);
  };

  return { branches, loading, error, refetch: fetchAll, deleteBranch, addBranch, updateBranch, listRecycledBranches, restoreBranch, hardDeleteBranch };
}
