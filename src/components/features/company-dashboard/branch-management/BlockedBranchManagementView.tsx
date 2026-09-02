'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useBranches } from '@/src/hooks/company-dashboard/useBranches';
import type { Branch } from '@/src/types';

interface BlockedBranchCardProps {
  branch: Branch;
}

const BlockedBranchCard = ({ branch }: BlockedBranchCardProps) => {
  return (
    <div className="w-full bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#E9EFF6] mb-6">
      
      {/* Grid Layout for Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-6">
        
        {/* Row 1 */}
        <div className="flex flex-col">
          <label className="text-[13px] font-bold text-gray-700 mb-2.5">
            Branch Name
          </label>
          <div className="w-full bg-[#DCEBFE] text-[#8B9EB7] text-[13.5px] font-medium py-3 px-4 rounded-xl border-0">
            {branch.name}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-[13px] font-bold text-gray-700 mb-2.5">
            Branch Category - Yes
          </label>
          <div className="w-full bg-[#DCEBFE] text-[#8B9EB7] text-[13.5px] font-medium py-3 px-4 rounded-xl border-0">
            {branch.category || '—'}
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex flex-col">
          <label className="text-[13px] font-bold text-gray-700 mb-2.5">
            Branch Address
          </label>
          <div className="w-full bg-[#DCEBFE] text-[#8B9EB7] text-[13.5px] font-medium p-4 rounded-xl border-0 min-h-[100px]">
            {branch.address || '—'}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-[13px] font-bold text-gray-700 mb-2.5">
            Branch Pincode
          </label>
          <div className="w-full bg-[#DCEBFE] text-[#8B9EB7] text-[13.5px] font-medium py-3 px-4 rounded-xl border-0">
            {branch.pincode || '—'}
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="flex items-center justify-end pt-2">
        <button
          type="button"
          className="px-8 py-2.5 rounded-xl text-[14px] font-bold bg-[#E60000] hover:bg-[#CC0000] text-white shadow-sm transition-all"
        >
          Unblock
        </button>
      </div>

    </div>
  );
};

export function BlockedBranchManagementView() {
  const router = useRouter();
  const { branches, loading, error } = useBranches();
  const blockedBranches = branches.filter((branch) => branch.category.toLowerCase().includes('blocked'));

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="w-full h-full flex flex-col max-w-[1200px] mx-auto overflow-hidden p-2 sm:p-4">
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 shrink-0">
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
            Blocked Branch Management
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-[#1A7DE8] hover:bg-[#1669C9] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm">
            Categories
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 stroke-white stroke-[2.5]"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>

      {/* Cards List */}
      <div className="flex-1 overflow-y-auto pb-8 pr-1 custom-scrollbar">
        {error ? (
          <div className="px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-sm text-red-700">
            {error}
          </div>
        ) : loading ? (
          <div className="px-4 py-8 text-sm text-gray-500">Loading branches...</div>
        ) : blockedBranches.length === 0 ? (
          <div className="px-4 py-8 rounded-2xl bg-[#F8FBFF] border border-dashed border-[#D5E3F5] text-sm text-gray-500">
            No blocked branches found. This screen will show blocked branch records once backend support/status data is available.
          </div>
        ) : (
          blockedBranches.map((branch) => (
            <BlockedBranchCard key={branch.id} branch={branch} />
          ))
        )}
      </div>

    </div>
  );
}

export default BlockedBranchManagementView;
