'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Asset, AssetCategory } from '@/src/types';

interface AssetDetailViewProps {
  asset: Asset;
  categories?: AssetCategory[];
  onCategoryFilter?: (categoryId: string | null) => void;
  onCreate?: () => void;
  onMoveToBin?: (id: string) => void;
}

/** Format ISO / date string to readable DD MMM YYYY */
function formatDate(val?: string | null): string {
  if (!val || val === '—' || val === '') return '—';
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return val;
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return val;
  }
}

const DisplayPill = ({ value }: { value?: string | number | null }) => (
  <div className="px-4 py-2.5 rounded-xl bg-[#DBEAFE] text-sm text-gray-800 min-w-[80px] inline-block">
    {value !== undefined && value !== null && value !== '' ? value : '—'}
  </div>
);

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
    <h3 className="text-[15px] font-bold text-gray-900 mb-5">{title}</h3>
    {children}
  </div>
);

export default function AssetDetailView({
  asset,
  categories = [],
  onCategoryFilter,
  onCreate,
  onMoveToBin,
}: AssetDetailViewProps) {
  const router   = useRouter();
  const [catOpen, setCatOpen] = useState(false);
  const [confirmBin, setConfirmBin] = useState(false);
  const catRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMoveToBin = () => {
    if (confirmBin) {
      onMoveToBin?.(asset.id);
      setConfirmBin(false);
    } else {
      setConfirmBin(true);
      // Auto-reset confirm state after 3 seconds if not clicked again
      setTimeout(() => setConfirmBin(false), 3000);
    }
  };

  const acquisitionCostFormatted = asset.acquisitionCost != null && asset.acquisitionCost !== ''
    ? `₹${Number(asset.acquisitionCost).toLocaleString('en-IN')}`
    : '—';

  return (
    <div className="flex flex-col overflow-y-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-5 shrink-0">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => router.back()} className="text-gray-900 hover:text-gray-600 transition-colors">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h2 className="text-xl font-bold text-gray-900">Asset</h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Move to Recycle Bin */}
          {onMoveToBin && (
            <button
              type="button"
              onClick={handleMoveToBin}
              title={confirmBin ? 'Click again to confirm' : 'Move to Recycle Bin'}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                confirmBin
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100'
              }`}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-.8 11a2 2 0 0 1-2 1.9H7.8a2 2 0 0 1-2-1.9L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
              {confirmBin ? 'Confirm?' : 'Move to Bin'}
            </button>
          )}

          {/* Categories dropdown */}
          <div className="relative" ref={catRef}>
            <button type="button" onClick={() => setCatOpen((o) => !o)}
              className="flex items-center gap-2 bg-[#1A7DE8] hover:bg-[#1669C9] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              Categories
              <svg viewBox="0 0 20 20" className={`w-4 h-4 transition-transform ${catOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
                <polyline points="5 8 10 13 15 8" />
              </svg>
            </button>
            {catOpen && (
              <div className="absolute right-0 top-[calc(100%+6px)] bg-white rounded-xl shadow-xl border border-gray-100 z-30 min-w-[180px] py-1">
                <button onClick={() => { onCategoryFilter?.(null); setCatOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors">
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button key={cat.id} onClick={() => { onCategoryFilter?.(cat.id); setCatOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors">
                    {cat.categoryName}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Create */}
          <button onClick={onCreate}
            className="flex items-center gap-2 bg-[#1A7DE8] hover:bg-[#1669C9] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Create
          </button>
        </div>
      </div>

      {/* Asset Information */}
      <SectionCard title="Asset Information">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {([
            { label: 'Asset Name',         value: asset.assetName },
            { label: 'Asset Category',     value: asset.assetCategory || '—' },
            { label: 'Asset Quantity',     value: asset.assetQuantity },
            { label: 'Asset Company Name', value: asset.assetCompanyName },
            { label: 'Asset Shelf Life',   value: asset.assetShelfLife || '—' },
          ] as { label: string; value: string | number | undefined | null }[]).map(({ label, value }) => (
            <div key={label}>
              <p className="text-sm text-gray-700 mb-2">{label}</p>
              <DisplayPill value={value} />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Invoice Details */}
      <SectionCard title="Invoice Details">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {([
            { label: 'Invoice No',   value: asset.invoiceNo },
            { label: 'Invoice Date', value: formatDate(asset.invoiceDate) },
            { label: 'Vendor Name',  value: asset.vendorName },
          ] as { label: string; value: string | undefined }[]).map(({ label, value }) => (
            <div key={label}>
              <p className="text-sm text-gray-700 mb-2">{label}</p>
              <DisplayPill value={value} />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Acquisition Details */}
      <SectionCard title="Acquisition Details">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-700 mb-2">Acquisition Cost</p>
            <DisplayPill value={acquisitionCostFormatted} />
          </div>
          <div>
            <p className="text-sm text-gray-700 mb-2">Acquisition Date</p>
            <DisplayPill value={formatDate(asset.acquisitionDate)} />
          </div>
        </div>
      </SectionCard>

      {/* Asset Description */}
      <SectionCard title="Asset Description">
        <div className="px-4 py-3 rounded-xl bg-[#DBEAFE] text-sm text-gray-800 min-h-[60px]">
          {asset.assetDescription || '—'}
        </div>
      </SectionCard>
    </div>
  );
}
