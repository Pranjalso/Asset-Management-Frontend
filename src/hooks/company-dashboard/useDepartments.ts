import { useState, useEffect, useCallback } from 'react';
import { orgService } from '@/src/services';
import type { Department } from '@/src/types';


export function useDepartments(initialSearch?: string) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);

  const fetchAll = useCallback(async (showLoading = false, search?: string) => {
    if (showLoading) setLoading(true);
    try {
      setError(null);
      const res = await orgService.listDepartments({ search });
      setDepartments(res.data);
    } catch (err: unknown) {
      console.error('Failed to fetch departments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch departments');
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  }, []);

   
  useEffect(() => { void fetchAll(false, initialSearch); }, [fetchAll, initialSearch]);

  const deleteDepartment = async (id: string) => {
    await orgService.deleteDepartment(id);
    await fetchAll(true);
  };

  const addDepartment = async (data: Parameters<typeof orgService.createDepartment>[0]) => {
    await orgService.createDepartment(data);
    await fetchAll(true);
  };

  const updateDepartment = async (id: string, data: Parameters<typeof orgService.updateDepartment>[1]) => {
    await orgService.updateDepartment(id, data);
    await fetchAll(true);
  };

  const listRecycledDepartments = async () => {
    return await orgService.listRecycledDepartments();
  };

  const restoreDepartment = async (id: string) => {
    await orgService.restoreDepartment(id);
    await fetchAll(true);
  };

  const hardDeleteDepartment = async (id: string) => {
    await orgService.hardDeleteDepartment(id);
    await fetchAll(true);
  };

  return { departments, loading, error, refetch: fetchAll, deleteDepartment, addDepartment, updateDepartment, listRecycledDepartments, restoreDepartment, hardDeleteDepartment };
}
