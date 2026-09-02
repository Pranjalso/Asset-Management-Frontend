'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ROUTES } from '@/src/constants/routes';
import { DeleteButton } from '@/src/components/ui/DeleteButton';
import { DeleteConfirmModal } from '@/src/components/ui/DeleteConfirmModal';
import type { Asset, AssetCategory } from '@/src/types';

interface AssetDetailsViewProps {
  asset?: Asset;
  categories?: AssetCategory[];
  selectedCategory?: string | null;
  onCategorySelect?: (categoryId: string | null) => void;
  onCreateClick?: () => void;
  onBackClick?: () => void;
  onDeleteClick?: (id: string) => void;
}

export function AssetDetailsView({
  asset,
  categories = [],
  selectedCategory,
  onCategorySelect,
  onCreateClick,
  onBackClick,
  onDeleteClick,
}: AssetDetailsViewProps) {
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close categories dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCatDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasAsset = Boolean(asset?.id);
  const assetName = asset?.assetName?.trim() || '—';
  const assetCategory = asset?.assetCategory?.trim() || '—';
  const assetQuantity = asset?.assetQuantity !== undefined && asset?.assetQuantity !== null ? String(asset.assetQuantity) : '—';
  const assetCompanyName = asset?.assetCompanyName?.trim() || '—';
  const assetShelfLife = asset?.assetShelfLife?.trim() || '—';

  const invoiceNo = asset?.invoiceNo?.trim() || '—';
  const invoiceDate = asset?.invoiceDate?.trim() || '—';
  const vendorName = asset?.vendorName?.trim() || '—';

  const acquisitionCost = asset?.acquisitionCost !== undefined && asset?.acquisitionCost !== null ? String(asset.acquisitionCost) : '—';
  const acquisitionDate = asset?.acquisitionDate?.trim() || '—';

  const assetDescription = asset?.assetDescription?.trim() || 'No description available for this asset.';

  return (
    <div className="w-full bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-7 lg:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#E9EFF6] space-y-6">
      
      {/* ── Top Header Row ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
        {/* Left: Back button + Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackClick}
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
            Asset
          </h2>
        </div>

        {/* Right: Catergories dropdown & Create button */}
        <div className="flex items-center gap-3">
          {/* Delete Button */}
          {hasAsset && onDeleteClick && (
            <DeleteButton
              onClick={() => {
                if (asset?.id) {
                  setShowDeleteConfirm(true);
                }
              }}
            />
          )}

          {/* Categories Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setCatDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 bg-[#1A7DE8] hover:bg-[#1669C9] text-white text-[13.5px] font-semibold px-4 sm:px-5 py-2.5 rounded-xl shadow-xs transition-all active:scale-[0.98]"
            >
              <span>{selectedCategory || 'Categories'}</span>
              <svg
                viewBox="0 0 20 20"
                className={`w-4 h-4 stroke-white stroke-[2.4] transition-transform duration-200 ${
                  catDropdownOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                strokeLinecap="round"
              >
                <polyline points="5 8 10 13 15 8" />
              </svg>
            </button>

            {catDropdownOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] bg-white rounded-2xl shadow-xl border border-gray-100 z-30 min-w-[190px] py-1.5 overflow-hidden animate-in fade-in-50 zoom-in-95">
                <button
                  type="button"
                  onClick={() => {
                    onCategorySelect?.(null);
                    setCatDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors ${
                    !selectedCategory ? 'text-[#1A7DE8] bg-blue-50/70 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      onCategorySelect?.(cat.id);
                      setCatDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors ${
                      selectedCategory === cat.categoryName
                        ? 'text-[#1A7DE8] bg-blue-50/70 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {cat.categoryName}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Create Button */}
          <button
            type="button"
            onClick={onCreateClick}
            className="flex items-center gap-2 bg-[#1A7DE8] hover:bg-[#1669C9] text-white text-[13.5px] font-semibold px-4 sm:px-5 py-2.5 rounded-xl shadow-xs transition-all active:scale-[0.98]"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 shrink-0 stroke-white stroke-[2]"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <span>Create</span>
          </button>
        </div>
      </div>

      {!hasAsset && (
        <div className="rounded-2xl border border-dashed border-[#D5E3F5] bg-[#F8FBFF] px-5 py-8 text-center text-sm text-gray-500">
          No assets found for the selected filters. Create an asset to see its details here.
        </div>
      )}

      {/* ── Section 1: Asset Information ───────────────────────────────────── */}
      <div className="bg-white rounded-[20px] p-5 sm:p-6 border border-[#E9EFF6] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <h3 className="text-[15px] sm:text-[16px] font-bold text-gray-900 mb-4">
          Asset Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {/* Asset Name */}
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-gray-800 mb-2">
              Asset Name
            </span>
            <div className="bg-[#E8F1FC] text-gray-800 text-[13.5px] font-medium py-2.5 px-4 rounded-xl text-center flex items-center justify-center min-h-[42px] select-all">
              {assetName}
            </div>
          </div>

          {/* Asset Category */}
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-gray-800 mb-2">
              Asset Category
            </span>
            <div className="bg-[#E8F1FC] text-gray-800 text-[13.5px] font-medium py-2.5 px-4 rounded-xl text-center flex items-center justify-center min-h-[42px] select-all">
              {assetCategory}
            </div>
          </div>

          {/* Asset Quantity */}
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-gray-800 mb-2">
              Asset Quantity
            </span>
            <div className="bg-[#E8F1FC] text-gray-800 text-[13.5px] font-medium py-2.5 px-4 rounded-xl text-center flex items-center justify-center min-h-[42px] select-all">
              {assetQuantity}
            </div>
          </div>

          {/* Asset Company Name */}
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-gray-800 mb-2">
              Asset Company Name
            </span>
            <div className="bg-[#E8F1FC] text-gray-800 text-[13.5px] font-medium py-2.5 px-4 rounded-xl text-center flex items-center justify-center min-h-[42px] select-all truncate">
              {assetCompanyName}
            </div>
          </div>

          {/* Asset Shelf Life */}
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-gray-800 mb-2">
              Asset Shelf Life
            </span>
            <div className="bg-[#E8F1FC] text-gray-800 text-[13.5px] font-medium py-2.5 px-4 rounded-xl text-center flex items-center justify-center min-h-[42px] select-all">
              {assetShelfLife}
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 2: Invoice Details ───────────────────────────────────────── */}
      <div className="bg-white rounded-[20px] p-5 sm:p-6 border border-[#E9EFF6] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <h3 className="text-[15px] sm:text-[16px] font-bold text-gray-900 mb-4">
          Invoice Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {/* Invoice No */}
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-gray-800 mb-2">
              Invoice No
            </span>
            <div className="bg-[#E8F1FC] text-gray-800 text-[13.5px] font-medium py-2.5 px-4 rounded-xl text-center flex items-center justify-center min-h-[42px] select-all">
              {invoiceNo}
            </div>
          </div>

          {/* Invoice Date */}
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-gray-800 mb-2">
              Invoice Date
            </span>
            <div className="bg-[#E8F1FC] text-gray-800 text-[13.5px] font-medium py-2.5 px-4 rounded-xl text-center flex items-center justify-center min-h-[42px] select-all">
              {invoiceDate}
            </div>
          </div>

          {/* Vendor Name */}
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-gray-800 mb-2">
              Vendor Name
            </span>
            <div className="bg-[#E8F1FC] text-gray-800 text-[13.5px] font-medium py-2.5 px-4 rounded-xl text-center flex items-center justify-center min-h-[42px] select-all truncate">
              {vendorName}
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 3: Acquisition Details ───────────────────────────────────── */}
      <div className="bg-white rounded-[20px] p-5 sm:p-6 border border-[#E9EFF6] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <h3 className="text-[15px] sm:text-[16px] font-bold text-gray-900 mb-4">
          Acquisition Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {/* Acquisition Cost */}
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-gray-800 mb-2">
              Acquisition Cost
            </span>
            <div className="bg-[#E8F1FC] text-gray-800 text-[13.5px] font-medium py-2.5 px-4 rounded-xl text-center flex items-center justify-center min-h-[42px] select-all">
              {acquisitionCost}
            </div>
          </div>

          {/* Acquisition Date */}
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-gray-800 mb-2">
              Acquisition Date
            </span>
            <div className="bg-[#E8F1FC] text-gray-800 text-[13.5px] font-medium py-2.5 px-4 rounded-xl text-center flex items-center justify-center min-h-[42px] select-all">
              {acquisitionDate}
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 4: Asset Description ────────────────────────────────────── */}
      <div className="bg-white rounded-[20px] p-5 sm:p-6 border border-[#E9EFF6] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <h3 className="text-[15px] sm:text-[16px] font-bold text-gray-900 mb-3">
          Asset Description
        </h3>

        <div className="bg-[#F8FAFD] border border-[#E8EFF7] rounded-xl p-4 text-[13.5px] text-gray-700 leading-relaxed min-h-[80px]">
          {assetDescription}
        </div>
      </div>

      {/* ── Custom Delete Confirmation Modal ────────────────────────────────── */}
      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete Asset"
        message="Are you sure you want to delete this asset? It will be moved to the Recycle Bin."
        onConfirm={() => {
          if (asset?.id && onDeleteClick) {
            onDeleteClick(asset.id);
          }
          setShowDeleteConfirm(false);
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />

    </div>
  );
}
