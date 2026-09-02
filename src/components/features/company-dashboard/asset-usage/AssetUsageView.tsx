'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AssetUsageCharts } from './AssetUsageCharts';
import { useAssetUsage } from '@/src/hooks/company-dashboard/useAssetUsage';
import { ROUTES } from '@/src/constants/routes';

function formatUsageDate(value: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

export function AssetUsageView({ searchQuery = '' }: { searchQuery?: string }) {
  const router = useRouter();
  const { usageRecords, latestUsage, loading, error } = useAssetUsage();

  const handleBack = () => {
    router.back();
  };

  const filteredRecords = usageRecords.filter(r => 
    !searchQuery || 
    r.assetName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.departmentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col max-w-[1200px] mx-auto overflow-y-auto p-2 sm:p-4 custom-scrollbar">
      
      {/* Charts Section */}
      <AssetUsageCharts />

      {/* Information Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0 mt-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Go back"
            className="w-8 h-8 flex items-center justify-center text-gray-900 hover:text-[#1A7DE8] hover:bg-blue-50 rounded-full transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 stroke-gray-900 stroke-[2.8]"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h2 className="text-[20px] sm:text-[22px] font-bold text-gray-900 tracking-tight">
            Asset Usage Information
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <Link href={ROUTES.COMPANY_DASHBOARD_ASSET_USAGE} className="flex items-center gap-2 bg-[#007AFF] hover:bg-[#0062CC] text-white px-5 py-2.5 rounded-xl text-[14px] font-medium transition-colors shadow-sm">
            Latest Usage
          </Link>
          
          <button
            type="button"
            onClick={() => router.push(`${ROUTES.COMPANY_DASHBOARD_ASSET_USAGE}/add`)}
            className="flex items-center gap-2 bg-[#007AFF] hover:bg-[#0062CC] text-white px-5 py-2.5 rounded-xl text-[14px] font-medium transition-colors shadow-sm"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 stroke-white stroke-[2]"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            Create
          </button>
        </div>
      </div>

      {/* Information Card */}
      <div className="w-full bg-white rounded-[24px] p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#E9EFF6] mb-8">
        {error ? (
          <div className="px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-sm text-red-700">
            {error}
          </div>
        ) : loading ? (
          <div className="px-4 py-8 text-sm text-gray-500">Loading latest asset usage...</div>
        ) : !latestUsage ? (
          <div className="px-4 py-8 text-sm text-gray-500">
            No asset usage records yet. Create a usage entry to see details here.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
            <div className="flex flex-col">
              <label className="text-[13px] font-bold text-gray-600 mb-2">Asset Name</label>
              <div className="w-full bg-[#DCEBFE] text-[#45607C] text-[13.5px] font-medium py-3 px-4 rounded-[12px] border-0">
                {latestUsage.assetName || '—'}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-[13px] font-bold text-gray-600 mb-2">Employee Name</label>
              <div className="w-full bg-[#DCEBFE] text-[#45607C] text-[13.5px] font-medium py-3 px-4 rounded-[12px] border-0">
                {latestUsage.employeeName || '—'}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-[13px] font-bold text-gray-600 mb-2">Usage Department</label>
              <div className="w-full bg-[#DCEBFE] text-[#45607C] text-[13.5px] font-medium py-3 px-4 rounded-[12px] border-0">
                {latestUsage.departmentName || '—'}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-[13px] font-bold text-gray-600 mb-2">Usage Cost</label>
              <div className="w-full bg-[#DCEBFE] text-[#45607C] text-[13.5px] font-medium py-3 px-4 rounded-[12px] border-0">
                {latestUsage.usageCost != null ? String(latestUsage.usageCost) : '—'}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-[13px] font-bold text-gray-600 mb-2">Usage Date</label>
              <div className="w-full bg-[#DCEBFE] text-[#45607C] text-[13.5px] font-medium py-3 px-4 rounded-[12px] border-0">
                {formatUsageDate(latestUsage.usageDate)}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-[13px] font-bold text-gray-600 mb-2">Usage Type</label>
              <div className="w-full bg-[#DCEBFE] text-[#45607C] text-[13.5px] font-medium py-3 px-4 rounded-[12px] border-0">
                {latestUsage.usageType || '—'}
              </div>
            </div>

            {latestUsage.notes && (
              <div className="flex flex-col md:col-span-3">
                <label className="text-[13px] font-bold text-gray-600 mb-2">Notes</label>
                <div className="w-full bg-[#DCEBFE] text-[#45607C] text-[13.5px] font-medium py-3 px-4 rounded-[12px] border-0 min-h-[72px]">
                  {latestUsage.notes}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {!loading && !error && filteredRecords.length > 1 && (
        <div className="w-full bg-white rounded-[24px] p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#E9EFF6] mb-8">
          <h3 className="text-[16px] font-bold text-gray-900 mb-4">Recent Usage Records</h3>
          <div className="space-y-3">
            {filteredRecords.slice(0, 5).map((record) => (
              <div key={record.id} className="rounded-xl bg-[#F8FAFD] border border-[#E8EFF7] px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{record.assetName || 'Unnamed asset'}</p>
                  <p className="text-xs text-gray-500">
                    {record.employeeName || 'Unassigned'} • {record.departmentName || 'No department'}
                  </p>
                </div>
                <div className="text-xs text-gray-500">
                  {formatUsageDate(record.usageDate)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default AssetUsageView;
