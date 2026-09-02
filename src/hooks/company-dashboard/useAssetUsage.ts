import { useCallback, useEffect, useState } from 'react';
import type { AssetUsage } from '@/src/services/assetOps.service';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export function useAssetUsage(assetId?: string) {
  const [usageRecords, setUsageRecords] = useState<AssetUsage[]>([]);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (!API_BASE) return;
    try {
      setLoading(true);
      setError(null);
      const { assetOpsService } = await import('@/src/services/assetOps.service');
      const res = await assetOpsService.listUsage({ assetId, page: 1, pageSize: 50 });
      setUsageRecords(res.data);
    } catch {
      setUsageRecords([]);
    } finally {
      setLoading(false);
    }
  }, [assetId]);

  useEffect(() => { void fetchAll(); }, [fetchAll]);

  return {
    usageRecords,
    loading,
    error,
    refetch: fetchAll,
    latestUsage: usageRecords[0] ?? null,
  };
}
