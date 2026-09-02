'use client';

import React, { useState } from 'react';
import type { Asset, AssetCategory } from '@/src/types';

interface CreateAssetModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (assetData: Omit<Asset, 'id' | 'createdAt'>) => void;
  categories?: AssetCategory[];
}

export function CreateAssetModal({
  open,
  onClose,
  onSubmit,
  categories = [],
}: CreateAssetModalProps) {
  const [formData, setFormData] = useState<Omit<Asset, 'id' | 'createdAt'>>({
    assetName: '',
    assetCategory: categories[0]?.categoryName || '',
    assetQuantity: '1',
    assetCompanyName: '',
    assetShelfLife: '365 Days',
    invoiceNo: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    vendorName: '',
    acquisitionCost: '0',
    acquisitionDate: new Date().toISOString().split('T')[0],
    assetDescription: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!open) return null;

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.assetName.trim()) newErrors.assetName = 'Asset Name is required';
    if (!formData.assetCategory.trim()) newErrors.assetCategory = categories.length === 0
      ? 'Create an asset category first before adding assets'
      : 'Category is required';
    if (!formData.assetCompanyName.trim()) newErrors.assetCompanyName = 'Company Name is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-2xl w-full p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Create New Asset</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Fill in the details below to add an asset to your inventory.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Section 1: Asset Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider text-xs">
              Asset Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Asset Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dell XPS 15"
                  value={formData.assetName}
                  onChange={(e) => handleChange('assetName', e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#1A7DE8] ${
                    errors.assetName ? 'border-red-400 bg-red-50/20' : 'border-gray-200 bg-[#F9FAFB]'
                  }`}
                />
                {errors.assetName && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.assetName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Asset Category *
                </label>
                <select
                  value={formData.assetCategory}
                  onChange={(e) => handleChange('assetCategory', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#F9FAFB] text-sm focus:outline-none focus:ring-2 focus:ring-[#1A7DE8]"
                >
                  <option value="" disabled>
                    {categories.length === 0 ? 'No categories available' : 'Select category'}
                  </option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.categoryName}>
                      {c.categoryName}
                    </option>
                  ))}
                </select>
                {errors.assetCategory && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.assetCategory}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Asset Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="1"
                  value={formData.assetQuantity}
                  onChange={(e) => handleChange('assetQuantity', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#F9FAFB] text-sm focus:outline-none focus:ring-2 focus:ring-[#1A7DE8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Asset Company Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp"
                  value={formData.assetCompanyName}
                  onChange={(e) => handleChange('assetCompanyName', e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#1A7DE8] ${
                    errors.assetCompanyName ? 'border-red-400 bg-red-50/20' : 'border-gray-200 bg-[#F9FAFB]'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Asset Shelf Life
                </label>
                <input
                  type="text"
                  placeholder="e.g. 365 Days"
                  value={formData.assetShelfLife}
                  onChange={(e) => handleChange('assetShelfLife', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#F9FAFB] text-sm focus:outline-none focus:ring-2 focus:ring-[#1A7DE8]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Invoice Details */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider text-xs">
              Invoice Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Invoice No
                </label>
                <input
                  type="text"
                  placeholder="INV-1002"
                  value={formData.invoiceNo}
                  onChange={(e) => handleChange('invoiceNo', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#F9FAFB] text-sm focus:outline-none focus:ring-2 focus:ring-[#1A7DE8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Invoice Date
                </label>
                <input
                  type="date"
                  value={formData.invoiceDate}
                  onChange={(e) => handleChange('invoiceDate', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#F9FAFB] text-sm focus:outline-none focus:ring-2 focus:ring-[#1A7DE8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Vendor Name
                </label>
                <input
                  type="text"
                  placeholder="Supplier Inc."
                  value={formData.vendorName}
                  onChange={(e) => handleChange('vendorName', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#F9FAFB] text-sm focus:outline-none focus:ring-2 focus:ring-[#1A7DE8]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Acquisition Details */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider text-xs">
              Acquisition Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Acquisition Cost ($)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.acquisitionCost}
                  onChange={(e) => handleChange('acquisitionCost', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#F9FAFB] text-sm focus:outline-none focus:ring-2 focus:ring-[#1A7DE8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Acquisition Date
                </label>
                <input
                  type="date"
                  value={formData.acquisitionDate}
                  onChange={(e) => handleChange('acquisitionDate', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#F9FAFB] text-sm focus:outline-none focus:ring-2 focus:ring-[#1A7DE8]"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Asset Description */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider text-xs">
              Asset Description
            </h3>
            <textarea
              rows={3}
              placeholder="Enter comprehensive asset specifications, warranty notes, or serial info..."
              value={formData.assetDescription}
              onChange={(e) => handleChange('assetDescription', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#F9FAFB] text-sm focus:outline-none focus:ring-2 focus:ring-[#1A7DE8]"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={categories.length === 0}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#1A7DE8] hover:bg-[#1669C9] text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Asset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
