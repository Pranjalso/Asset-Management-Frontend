'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/src/constants/routes';
import { assetOpsService, AssetTransfer } from '@/src/services/assetOps.service';

export function DepartmentTransferView({ searchQuery = '' }: { searchQuery?: string }) {
  const router = useRouter();
  const [data, setData] = useState<AssetTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await assetOpsService.listTransfers({ pageSize: 100 });
        if (!cancelled) setData(response.data.filter((t) => t.transferType === 'department'));
      } catch {
        if (!cancelled) setError('Failed to load department transfers.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleBack = () => {
    router.back();
  };

  const filteredData = data.filter(row => 
    !searchQuery || 
    (row.assetName && row.assetName.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (row.employeeName && row.employeeName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (row.toDepartmentName && row.toDepartmentName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full h-full flex flex-col max-w-[1200px] mx-auto overflow-hidden p-2 sm:p-4">
      
      <div className="w-full bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#E9EFF6] flex-1 flex flex-col min-h-0">
        
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0">
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
              Department Asset Information
            </h2>
          </div>

          <button
            type="button"
            onClick={() => router.push(`${ROUTES.COMPANY_DASHBOARD_ASSET_TRANSFER}/department/add`)}
            className="flex items-center gap-2 bg-[#1A7DE8] hover:bg-[#1669C9] text-white px-5 py-2.5 rounded-xl text-[14px] font-medium transition-colors shadow-sm"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 stroke-white stroke-[2]"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Create
          </button>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-auto custom-scrollbar border border-[#E9EFF6] rounded-xl">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-[#DCEBFE] sticky top-0 z-10">
              <tr>
                <th className="py-4 px-6 text-[13px] font-bold text-gray-800 text-center">Asset Name</th>
                <th className="py-4 px-6 text-[13px] font-bold text-gray-800 text-center">Transfer Date</th>
                <th className="py-4 px-6 text-[13px] font-bold text-gray-800 text-center">Employee Name</th>
                <th className="py-4 px-6 text-[13px] font-bold text-gray-800 text-center">Transfer Dept Name</th>
                <th className="py-4 px-6 text-[13px] font-bold text-gray-800 text-center">Transfer Cost</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-[13.5px] font-medium text-gray-500">
                    Loading department transfers...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-[13.5px] font-medium text-red-500">
                    {error}
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-[13.5px] font-medium text-gray-500">
                    No department transfers found matching your search.
                  </td>
                </tr>
              ) : (
                filteredData.map((row) => (
                  <tr key={row.id} className="border-b border-[#E9EFF6] last:border-0 hover:bg-gray-50/50">
                    <td className="py-4 px-6 text-[13.5px] font-medium text-gray-700 text-center">
                      {row.assetName || '-'}
                    </td>
                    <td className="py-4 px-6 text-[13.5px] font-medium text-gray-700 text-center">
                      {row.transferDate ? new Date(row.transferDate).toLocaleDateString('en-IN') : '-'}
                    </td>
                    <td className="py-4 px-6 text-[13.5px] font-medium text-gray-700 text-center">
                      {row.employeeName || '-'}
                    </td>
                    <td className="py-4 px-6 text-[13.5px] font-medium text-gray-700 text-center">
                      {row.toDepartmentName || '-'}
                    </td>
                    <td className="py-4 px-6 text-[13.5px] font-medium text-gray-700 text-center">
                      {row.transferCost != null ? `₹${Number(row.transferCost).toLocaleString('en-IN')}` : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default DepartmentTransferView;
