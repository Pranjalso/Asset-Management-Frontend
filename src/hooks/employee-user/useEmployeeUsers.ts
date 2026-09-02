import { useState, useEffect, useCallback } from 'react';
import { employeeUserService } from '@/src/services';
import type { EmployeeUser } from '@/src/types';


export function useEmployeeUsers() {
  const [users, setUsers]     = useState<EmployeeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetchUsers = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      setError(null);
      const res = await employeeUserService.getAll();
      setUsers(res.data);
    } catch (err: unknown) {
      console.error('Failed to fetch employee users:', err);
      setError(err instanceof Error ? err.message : 'Failed to load employee users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

   
  useEffect(() => { void fetchUsers(false); }, [fetchUsers]);

  return { users, loading, error, refetch: fetchUsers };
}
