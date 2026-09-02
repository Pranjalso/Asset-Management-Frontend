import Link from 'next/link';
import { ROUTES } from '@/src/constants/routes';
import type { Branch } from '@/src/types';

interface BranchManagementTableProps {
  branches: Branch[];
}

export default function BranchManagementTable({ branches }: BranchManagementTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[16px] font-bold text-gray-900">Branch Management</h3>
        <Link href={ROUTES.COMPANY_DASHBOARD_BRANCH} className="text-xs font-semibold text-gray-500 underline hover:text-[#1A7DE8] transition-colors">
          View All
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[#EEF4FC]">
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700 rounded-l-lg">Name</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">Address</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700 rounded-r-lg">Category</th>
            </tr>
          </thead>
          <tbody>
            {branches.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-sm text-gray-500 text-center">No branches available.</td>
              </tr>
            ) : (
              branches.map((branch, idx) => (
                <tr key={branch.id} className={`border-b border-gray-100 ${idx % 2 === 0 ? '' : 'bg-gray-50/40'}`}>
                  <td className="px-4 py-2.5 text-gray-900 whitespace-nowrap">{branch.name}</td>
                  <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap">{branch.address || '—'}</td>
                  <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap">{branch.category || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
