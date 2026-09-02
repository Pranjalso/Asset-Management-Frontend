'use client';

import { useRouter } from 'next/navigation';
import type { CompanyUser } from '@/src/types';

interface BlockedUserTableProps {
  users: CompanyUser[];
  loading?: boolean;
  onEdit?: (user: CompanyUser) => void;
}

const COLUMNS: { key: keyof CompanyUser; label: string }[] = [
  { key: 'companyName', label: 'Company\nName' }, { key: 'companyGST', label: 'Company\nGST' },
  { key: 'mobileNumber', label: 'Mobile\nNumber' }, { key: 'companyEmail', label: 'Company\nG mail' },
  { key: 'uniqueCode', label: 'Unique\nCode' }, { key: 'subscriptionName', label: 'Subcription\nName' },
  { key: 'subscriptionFromDate', label: 'Subcription\nFrom Date' }, { key: 'subscriptionToDate', label: 'Subcription\nTo Date' },
  { key: 'totalUserInCompany', label: 'Total User\nIn Company' },
];

export default function BlockedUserTable({ users, loading = false, onEdit }: BlockedUserTableProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <button type="button" onClick={() => router.back()} className="text-gray-900 hover:text-gray-600 transition-colors">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <h2 className="text-xl font-bold text-gray-900">Blocked User</h2>
      </div>
      <div className="flex-1 overflow-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm border-collapse min-w-[860px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {COLUMNS.map((col) => (
                <th key={col.key} className={`px-3 py-3 text-xs font-semibold text-gray-700 whitespace-pre-line leading-snug ${col.key === 'companyName' ? 'text-left pl-4' : 'text-center'}`}>{col.label}</th>
              ))}
              <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700">Edit</th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700">Block</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={11} className="px-4 py-10 text-center text-sm text-gray-500">Loading blocked companies...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-4 py-10 text-center text-sm text-gray-500">No blocked companies found.</td>
              </tr>
            ) : (
              users.map((user, idx) => (
                <tr key={user.id} className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>
                  <td className="px-4 py-2.5 text-left text-gray-900 font-medium whitespace-nowrap">{user.companyName}</td>
                  <td className="px-3 py-2.5 text-center text-gray-900 whitespace-nowrap">{user.companyGST}</td>
                  <td className="px-3 py-2.5 text-center text-gray-900 whitespace-nowrap">{user.mobileNumber}</td>
                  <td className="px-3 py-2.5 text-center text-gray-900 whitespace-nowrap">{user.companyEmail}</td>
                  <td className="px-3 py-2.5 text-center text-gray-900 whitespace-nowrap">{user.uniqueCode}</td>
                  <td className="px-3 py-2.5 text-center text-gray-900 whitespace-nowrap">{user.subscriptionName}</td>
                  <td className="px-3 py-2.5 text-center text-gray-900 whitespace-nowrap">{user.subscriptionFromDate}</td>
                  <td className="px-3 py-2.5 text-center text-gray-900 whitespace-nowrap">{user.subscriptionToDate}</td>
                  <td className="px-3 py-2.5 text-center text-gray-900 whitespace-nowrap">{user.totalUserInCompany}</td>
                  <td className="px-3 py-2.5 text-center">
                    <button onClick={() => onEdit?.(user)} className="text-[#1A7DE8] hover:text-[#1669C9] transition-colors">
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </button>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span className="text-red-500 font-semibold text-sm">Blocked</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
