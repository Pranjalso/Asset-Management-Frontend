import { useState, useEffect, useCallback } from 'react';
import { companyUserService } from '@/src/services';
import type { CompanyUser } from '@/src/types';


export function useCompanyUsers() {
  const [users, setUsers]   = useState<CompanyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  const fetchUsers = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      setError(null);
      const res = await companyUserService.getAll();
      setUsers(res.data);
    } catch (err: unknown) {
      console.error('Failed to fetch company users:', err);
      setError(err instanceof Error ? err.message : 'Failed to load company users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

   
  useEffect(() => { void fetchUsers(false); }, [fetchUsers]);

  return { users, loading, error, refetch: fetchUsers };
}
