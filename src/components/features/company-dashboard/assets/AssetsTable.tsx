'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import type { Asset, AssetCategory } from '@/src/types';
import { DeleteButton } from '@/src/components/ui/DeleteButton';

interface AssetsTableProps {
  assets: Asset[];
  categories?: AssetCategory[];
  loading?: boolean;
  onEdit?: (asset: Asset) => void;
  onMoveToBin?: (id: string) => void;
  onCreate?: () => void;
  onViewMore?: (asset: Asset) => void;
  onCategoryFilter?: (categoryId: string | null) => void;
}

export default function AssetsTable({
  assets,
  categories = [],
  loading = false,
  onEdit,
  onMoveToBin,
  onCreate,
  onViewMore,
  onCategoryFilter,
}: AssetsTableProps) {
  void loading;
  const router = useRouter();
  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  // Close categories dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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
          <h2 className="text-xl font-bold text-gray-900">Asset</h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Categories filter dropdown */}
          <div className="relative" ref={catRef}>
            <button
              type="button"
              onClick={() => setCatOpen((o) => !o)}
              className="flex items-center gap-2 bg-[#1A7DE8] hover:bg-[#1669C9] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Catergories
              <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
                <polyline points="5 8 10 13 15 8" />
              </svg>
            </button>

            {catOpen && (
              <div className="absolute right-0 top-[calc(100%+6px)] bg-white rounded-xl shadow-xl border border-gray-100 z-30 min-w-[180px] py-1 overflow-hidden">
                <button
                  onClick={() => { onCategoryFilter?.(null); setCatOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { onCategoryFilter?.(cat.id); setCatOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                  >
                    {cat.categoryName}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Create button */}
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
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[#EEF4FC] border-b border-gray-200">
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Asset Name</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Asset Category</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Asset Company Name</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Vendor Name</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Asset Quantity</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">More</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Edit Access</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Delete</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, idx) => (
              <tr
                key={asset.id}
                className={`border-b border-gray-100 hover:bg-blue-50/20 transition-colors ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFF]'
                }`}
              >
                <td className="px-4 py-2.5 text-center text-gray-900 whitespace-nowrap">{asset.assetName}</td>
                <td className="px-4 py-2.5 text-center text-gray-900 whitespace-nowrap">{asset.assetCategory}</td>
                <td className="px-4 py-2.5 text-center text-gray-900 whitespace-nowrap">{asset.assetCompanyName}</td>
                <td className="px-4 py-2.5 text-center text-gray-900 whitespace-nowrap">{asset.vendorName}</td>
                <td className="px-4 py-2.5 text-center text-gray-900 whitespace-nowrap">{asset.assetQuantity}</td>

                {/* View More */}
                <td className="px-4 py-2.5 text-center">
                  <button
                    onClick={() => onViewMore?.(asset)}
                    className="text-[#1A7DE8] hover:text-[#1669C9] text-sm font-medium underline underline-offset-2 transition-colors whitespace-nowrap"
                  >
                    View More
                  </button>
                </td>

                {/* Edit Access */}
                <td className="px-4 py-2.5 text-center">
                  <button
                    onClick={() => onEdit?.(asset)}
                    aria-label={`Edit ${asset.assetName}`}
                    className="text-[#1A7DE8] hover:text-[#1669C9] transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                </td>

                {/* Move to Bin (Delete) */}
                <td className="px-4 py-2.5 text-center">
                  <DeleteButton onClick={() => onMoveToBin?.(asset.id)} className="mx-auto scale-90" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
