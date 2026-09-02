import Link from 'next/link';
import { ROUTES } from '@/src/constants/routes';
import type { BranchAssetUsage } from '@/src/types';

interface BranchAssetUsageTableProps {
  data: BranchAssetUsage[];
}

export default function BranchAssetUsageTable({ data }: BranchAssetUsageTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[16px] font-bold text-gray-900">Branch Asset Usage</h3>
        <Link href={ROUTES.COMPANY_DASHBOARD_ASSET_USAGE} className="text-xs font-semibold text-gray-500 underline hover:text-[#1A7DE8] transition-colors">
          View All
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[#EEF4FC]">
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700 rounded-l-lg">Branch</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700 rounded-r-lg">Asset Count</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-4 py-8 text-sm text-gray-500 text-center">No branch asset usage data available.</td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={row.id} className={`border-b border-gray-100 ${idx % 2 === 0 ? '' : 'bg-gray-50/40'}`}>
                  <td className="px-4 py-2.5 text-gray-900 whitespace-nowrap">{row.branchName}</td>
                  <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap">{row.assetCount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
