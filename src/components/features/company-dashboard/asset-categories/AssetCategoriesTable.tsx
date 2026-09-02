'use client';

import { useRouter } from 'next/navigation';
import type { AssetCategory } from '@/src/types';
import { DeleteButton } from '@/src/components/ui/DeleteButton';

interface AssetCategoriesTableProps {
  categories: AssetCategory[];
  loading?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onCreate?: () => void;
}

export default function AssetCategoriesTable({
  categories,
  loading = false,
  onDelete,
  onEdit,
  onCreate,
}: AssetCategoriesTableProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="text-gray-900 hover:text-gray-600 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h2 className="text-xl font-bold text-gray-900">Asset Categories</h2>
        </div>

        <button
          onClick={onCreate}
          className="flex items-center gap-2 bg-[#1A7DE8] hover:bg-[#1669C9] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Create
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[#EEF4FC] border-b border-gray-200">
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">Category Name</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">Category Code</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">Actions</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">Delete</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">Loading categories...</td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">No categories found. Create one to get started.</td>
              </tr>
            ) : (
              categories.map((cat, idx) => (
                <tr
                  key={cat.id}
                  className={`border-b border-gray-100 hover:bg-blue-50/20 transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFF]'
                  }`}
                >
                  <td className="px-6 py-3 text-center text-gray-900 whitespace-nowrap">{cat.categoryName}</td>
                  <td className="px-6 py-3 text-center text-gray-900 whitespace-nowrap">{cat.categoryCode || '—'}</td>
                  <td className="px-6 py-3 text-center space-x-4">
                    <button
                      onClick={() => onEdit?.(cat.id)}
                      className="text-[#1A7DE8] hover:text-[#1669C9] text-sm font-medium underline underline-offset-2 transition-colors ml-4"
                    >
                      Edit
                    </button>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <DeleteButton onClick={() => onDelete?.(cat.id)} className="mx-auto scale-90" />
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
