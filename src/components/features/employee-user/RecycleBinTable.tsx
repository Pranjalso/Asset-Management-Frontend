'use client';

import { useRouter } from 'next/navigation';
import type { EmployeeUser } from '@/src/types';

interface Props {
  users: EmployeeUser[];
  loading?: boolean;
  onRecover?: (user: EmployeeUser) => void;
  onDelete?: (user: EmployeeUser) => void;
}

export default function RecycleBinTable({ users, loading = false, onRecover, onDelete }: Props) {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <button type="button" onClick={() => router.back()} className="text-gray-900 hover:text-gray-600 transition-colors">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <h2 className="text-xl font-bold text-gray-900">Recycle Bin</h2>
      </div>
      <div className="flex-1 overflow-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {['Company Name','Employee Name','Mobile No','Designation','Email','Password'].map((col, i) => (
                <th key={col} className={`px-4 py-3 text-xs font-semibold text-gray-700 ${i === 0 ? 'text-left' : 'text-center'}`}>{col}</th>
              ))}
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-500">Loading recycled employees...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-500">No recycled employees found.</td>
              </tr>
            ) : (
              users.map((user, idx) => (
                <tr key={user.id} className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>
                  <td className="px-4 py-2.5 text-left text-gray-900 font-medium whitespace-nowrap">{user.companyName}</td>
                  <td className="px-4 py-2.5 text-center text-gray-900 whitespace-nowrap">{user.employeeName}</td>
                  <td className="px-4 py-2.5 text-center text-gray-900 whitespace-nowrap">{user.mobileNo}</td>
                  <td className="px-4 py-2.5 text-center text-gray-900 whitespace-nowrap">{user.designation}</td>
                  <td className="px-4 py-2.5 text-center text-gray-900 whitespace-nowrap">{user.email}</td>
                  <td className="px-4 py-2.5 text-center text-gray-900 whitespace-nowrap">{user.password}</td>
                  <td className="px-4 py-2.5 text-center">
                    <div className="flex items-center justify-center gap-4">
                      <button onClick={() => onRecover?.(user)} className="text-[#1A7DE8] hover:underline text-sm font-medium whitespace-nowrap">
                        Recover
                      </button>
                      <button onClick={() => onDelete?.(user)} className="text-red-500 hover:underline text-sm font-medium whitespace-nowrap">
                        Delete
                      </button>
                    </div>
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
