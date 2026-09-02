'use client';

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/src/constants/routes';
import type { EmployeeUser } from '@/src/types';

interface Props {
  users: EmployeeUser[];
  loading?: boolean;
  onEdit?: (user: EmployeeUser) => void;
  onCreate?: () => void;
}

const COLUMNS: { key: keyof EmployeeUser; label: string }[] = [
  { key: 'companyName', label: 'Company Name' }, { key: 'employeeName', label: 'Employee Name' },
  { key: 'mobileNo', label: 'Mobile No' }, { key: 'designation', label: 'Designation' },
  { key: 'email', label: 'Email' }, { key: 'password', label: 'Password' },
];

const SKELETON_COUNT = 6;

function SkeletonRow({ idx }: { idx: number }) {
  return (
    <tr className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>
      <td className="px-4 py-2.5 text-left">
        <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
      </td>
      {COLUMNS.slice(1).map((col) => (
        <td key={col.key} className="px-4 py-2.5 text-center">
          <div className="h-4 w-24 mx-auto bg-gray-200 rounded animate-pulse" />
        </td>
      ))}
      <td className="px-4 py-2.5 text-center">
        <div className="h-5 w-5 mx-auto bg-gray-200 rounded animate-pulse" />
      </td>
      <td className="px-4 py-2.5 text-center">
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
            <path d="M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
          </svg>
          <p className="text-sm text-gray-500 font-medium">No employee users found</p>
          <p className="text-xs text-gray-400">Click &ldquo;Create&rdquo; to add your first employee user</p>
        </div>
      </td>
    </tr>
  );
}

export default function EmployeeUserTable({ users, loading = false, onEdit, onCreate }: Props) {
  const router = useRouter();
  const showSkeleton = loading;
  const showEmpty = !loading && users.length === 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h2 className="text-xl font-bold text-gray-900">Employee User</h2>
        <button onClick={onCreate} className="flex items-center gap-2 bg-[#1A7DE8] hover:bg-[#1669C9] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Create
        </button>
      </div>
      <div className="flex-1 overflow-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {COLUMNS.map((col) => (
                <th key={col.key} className={`px-4 py-3 text-xs font-semibold text-gray-700 ${col.key === 'companyName' ? 'text-left' : 'text-center'}`}>{col.label}</th>
              ))}
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Edit</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Recycle Bin</th>
            </tr>
          </thead>
          <tbody>
            {showSkeleton && Array.from({ length: SKELETON_COUNT }, (_, i) => <SkeletonRow key={`sk-${i}`} idx={i} />)}
            {showEmpty && <EmptyState />}
            {!showSkeleton && !showEmpty && users.map((user, idx) => (
              <tr key={user.id} className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>
                <td className="px-4 py-2.5 text-left text-gray-900 font-medium whitespace-nowrap">{user.companyName}</td>
                <td className="px-4 py-2.5 text-center text-gray-900 whitespace-nowrap">{user.employeeName}</td>
                <td className="px-4 py-2.5 text-center text-gray-900 whitespace-nowrap">{user.mobileNo}</td>
                <td className="px-4 py-2.5 text-center text-gray-900 whitespace-nowrap">{user.designation}</td>
                <td className="px-4 py-2.5 text-center text-gray-900 whitespace-nowrap">{user.email}</td>
                <td className="px-4 py-2.5 text-center text-gray-900 whitespace-nowrap">{user.password}</td>
                <td className="px-4 py-2.5 text-center">
                  <button onClick={() => onEdit?.(user)} className="text-[#1A7DE8] hover:text-[#1669C9] transition-colors">
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                </td>
                <td className="px-4 py-2.5 text-center">
                  <button onClick={() => router.push(`${ROUTES.EMPLOYEE_USER_RECYCLE_REASON}?id=${user.id}`)} className="text-red-500 hover:text-red-600 transition-colors">
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
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
