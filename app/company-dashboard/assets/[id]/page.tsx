'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CompanyDashboardLayout } from '@/src/components/layout/company-dashboard';
import AssetDetailView from '@/src/components/features/company-dashboard/assets/AssetDetailView';
import { ROUTES } from '@/src/constants/routes';
import { assetService } from '@/src/services/company-dashboard/asset.service';
import { normalizeApiError } from '@/src/lib/api-errors';
import type { Asset } from '@/src/types';

export default function AssetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadAsset = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const response = await assetService.getById(id);
        if (!cancelled) setAsset(response);
      } catch (err) {
        if (!cancelled) setError(normalizeApiError(err, 'Failed to load asset details.').message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadAsset();
    return () => { cancelled = true; };
  }, [id]);

  const handleMoveToBin = async (assetId: string) => {
    try {
      await assetService.moveToBin(assetId);
      router.replace(ROUTES.COMPANY_DASHBOARD_RECYCLE_BIN);
    } catch (err) {
      setError(normalizeApiError(err, 'Failed to move asset to recycle bin.').message);
    }
  };

  return (
    <CompanyDashboardLayout title="Assets">
      <div className="p-5 h-full overflow-y-auto">
        {loading ? (
          <div className="rounded-2xl bg-white border border-gray-200 p-6 text-sm text-gray-500">Loading asset details...</div>
        ) : error ? (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-6 text-sm text-red-700">{error}</div>
        ) : asset ? (
          <AssetDetailView
            asset={asset}
            onCreate={() => router.push(`${ROUTES.COMPANY_DASHBOARD_ASSETS}/add`)}
            onMoveToBin={handleMoveToBin}
          />
        ) : (
          <div className="rounded-2xl bg-white border border-gray-200 p-6 text-sm text-gray-500">Asset not found.</div>
        )}
      </div>
    </CompanyDashboardLayout>
  );
}
