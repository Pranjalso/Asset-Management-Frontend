'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/src/constants/routes';
import type { CompanyUser } from '@/src/types';

interface CompanyUserTableProps {
  users: CompanyUser[];
  loading?: boolean;
  onEdit?: (user: CompanyUser) => void;
  onCreate?: () => void;
}

const COLUMNS: { key: keyof CompanyUser; label: string }[] = [
  { key: 'companyName',          label: 'Company\nName' },
  { key: 'companyGST',           label: 'Company\nGST' },
  { key: 'mobileNumber',         label: 'Mobile\nNumber' },
  { key: 'companyEmail',         label: 'Company\ne mail' },
  { key: 'uniqueCode',           label: 'Unique\nCode' },
  { key: 'subscriptionName',     label: 'Subcription\nName' },
  { key: 'subscriptionFromDate', label: 'Subcription\nFrom Date' },
  { key: 'subscriptionToDate',   label: 'Subcription\nTo Date' },
  { key: 'totalUserInCompany',   label: 'Total User\nIn Company' },
];

const SKELETON_COUNT = 6;

function SkeletonRow({ idx }: { idx: number }) {
  return (
    <tr className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>
      <td className="px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 shrink-0 rounded-lg bg-gray-200 animate-pulse" />
          <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
        </div>
      </td>
      {COLUMNS.slice(1).map((col) => (
        <td key={col.key} className="px-3 py-2.5 text-center">
          <div className="h-4 w-20 mx-auto bg-gray-200 rounded animate-pulse" />
        </td>
      ))}
      <td className="px-3 py-2.5 text-center">
        <div className="h-5 w-5 mx-auto bg-gray-200 rounded animate-pulse" />
      </td>
      <td className="px-3 py-2.5 text-center">
        <div className="h-5 w-5 mx-auto bg-gray-200 rounded animate-pulse" />
      </td>
    </tr>
  );
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={COLUMNS.length + 2} className="px-4 py-16 text-center">
        <div className="flex flex-col items-center gap-3">
          <svg viewBox="0 0 24 24" className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M20 13V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7m16 0v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5m16 0h-2.586a1 1 0 0 0-.707.293l-2.414 2.414a1 1 0 0 1-.707.293h-3.172a1 1 0 0 1-.707-.293l-2.414-2.414A1 1 0 0 0 6.586 13H4" />
          </svg>
          <p className="text-sm text-gray-500 font-medium">No company users found</p>
          <p className="text-xs text-gray-400">Click &ldquo;Create&rdquo; to add your first company user</p>
        </div>
      </td>
    </tr>
  );
}

export default function CompanyUserTable({ users, loading = false, onEdit, onCreate }: CompanyUserTableProps) {
  const router = useRouter();
  const showSkeleton = loading;
  const showEmpty = !loading && users.length === 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h2 className="text-xl font-bold text-gray-900">Company User</h2>
        <button onClick={onCreate} className="flex items-center gap-2 bg-[#1A7DE8] hover:bg-[#1669C9] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Create
        </button>
      </div>

      <div className="flex-1 overflow-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm border-collapse min-w-[860px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {COLUMNS.map((col) => (
                <th key={col.key} className={`px-3 py-3 text-xs font-semibold text-gray-700 whitespace-pre-line leading-snug ${col.key === 'companyName' ? 'text-left pl-4' : 'text-center'}`}>
                  {col.label}
                </th>
              ))}
              <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700">Edit</th>
              <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700">Block</th>
            </tr>
          </thead>
          <tbody>
            {showSkeleton && Array.from({ length: SKELETON_COUNT }, (_, i) => <SkeletonRow key={`sk-${i}`} idx={i} />)}
            {showEmpty && <EmptyState />}
            {!showSkeleton && !showEmpty && users.map((user, idx) => (
              <tr key={user.id} className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 shrink-0 rounded-lg overflow-hidden border border-gray-100 bg-white flex items-center justify-center">
                      <Image src="/Image/icon.svg" alt="logo" width={26} height={26} />
                    </div>
                    <span className="text-gray-900 font-medium whitespace-nowrap">{user.companyName}</span>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-center text-gray-900 whitespace-nowrap">{user.companyGST}</td>
                <td className="px-3 py-2.5 text-center text-gray-900 whitespace-nowrap">{user.mobileNumber}</td>
                <td className="px-3 py-2.5 text-center text-gray-900 whitespace-nowrap">{user.companyEmail}</td>
                <td className="px-3 py-2.5 text-center text-gray-900 whitespace-nowrap">{user.uniqueCode}</td>
                <td className="px-3 py-2.5 text-center text-gray-900 whitespace-nowrap">{user.subscriptionName}</td>
                <td className="px-3 py-2.5 text-center text-gray-900 whitespace-nowrap">{user.subscriptionFromDate}</td>
                <td className="px-3 py-2.5 text-center text-gray-900 whitespace-nowrap">{user.subscriptionToDate}</td>
                <td className="px-3 py-2.5 text-center text-gray-900 whitespace-nowrap">{user.totalUserInCompany}</td>
                <td className="px-3 py-2.5 text-center">
                  <button onClick={() => onEdit?.(user)} aria-label={`Edit ${user.companyName}`} className="text-[#1A7DE8] hover:text-[#1669C9] transition-colors">
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                </td>
                <td className="px-3 py-2.5 text-center">
                  <button onClick={() => router.push(`${ROUTES.COMPANY_USER_BLOCK}?id=${user.id}`)} aria-label={`Block ${user.companyName}`} className="text-red-500 hover:text-red-600 transition-colors">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 inline-block" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
