'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { Asset, AssetCategory } from '@/src/types';
import { validators, validateForm } from '@/src/lib/validations';
import DatePicker from '@/src/components/ui/DatePicker';

interface AddAssetViewProps {
  categories?: AssetCategory[];
  vendors?: string[];
  companies?: string[];
  onSubmit?: (assetData: Omit<Asset, 'id' | 'createdAt'>) => Promise<void> | void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function AddAssetView({
  categories = [],
  vendors = [],
  companies = [],
  onSubmit,
  onCancel,
  isLoading = false,
}: AddAssetViewProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [assetName, setAssetName] = useState('');
  const [assetCategory, setAssetCategory] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [assetQuantity, setAssetQuantity] = useState('');
  const [assetCompanyName, setAssetCompanyName] = useState('');
  const [assetShelfLife, setAssetShelfLife] = useState('');
  const [assetImageName, setAssetImageName] = useState('');

  const [invoiceNo, setInvoiceNo] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [vendorName, setVendorName] = useState('');

  const [acquisitionCost, setAcquisitionCost] = useState('');
  const [acquisitionDate, setAcquisitionDate] = useState('');

  const [assetDescription, setAssetDescription] = useState('');

  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [vendorDropdownOpen, setVendorDropdownOpen] = useState(false);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAssetImageName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      assetName,
      assetCategory,
      categoryId,
      assetCompanyName,
      assetQuantity,
      assetShelfLife,
      invoiceNo,
      invoiceDate,
      vendorName,
      acquisitionCost,
      acquisitionDate,
    };

    const validationRules: Record<string, (value: string) => string | null> = {
      assetName: (v) => validators.required(v, 'Asset Name'),
      assetCategory: (v) => validators.required(v, 'Asset Category'),
      assetCompanyName: (v) => validators.required(v, 'Company Name'),
      assetQuantity: (v) => {
        if (!v) return null;
        return validators.positiveNumber(v, 'Asset Quantity');
      },
      assetShelfLife: (v) => {
        if (!v) return null;
        return validators.positiveNumber(v, 'Asset Shelf Life');
      },
      invoiceDate: (v) => {
        if (!v) return null;
        return validators.date(v, 'Invoice Date');
      },
      acquisitionCost: (v) => {
        if (!v) return null;
        return validators.positiveNumber(v, 'Acquisition Cost');
      },
      acquisitionDate: (v) => {
        if (!v) return null;
        return validators.date(v, 'Acquisition Date');
      },
    };

    const validationErrors = validateForm(formData, validationRules);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const payload: Omit<Asset, 'id' | 'createdAt'> = {
      assetName: assetName.trim(),
      assetCategory: assetCategory.trim(),
      categoryId: categoryId || undefined,
      assetQuantity: assetQuantity.trim() || '1',
      assetCompanyName: assetCompanyName.trim(),
      assetShelfLife: assetShelfLife.trim() ? `${assetShelfLife.trim()} Days` : '0 Days',
      assetImage: assetImageName || undefined,
      invoiceNo: invoiceNo.trim() || '',
      invoiceDate: invoiceDate.trim() || '',
      vendorName: vendorName.trim() || '',
      acquisitionCost: acquisitionCost.trim() || '0',
      acquisitionDate: acquisitionDate.trim() || '',
      assetDescription: assetDescription.trim() || undefined,
    };

    if (onSubmit) {
      await onSubmit(payload);
    }

    setSaveSuccess(true);
    setTimeout(() => {
      if (onCancel) {
        onCancel();
      } else {
        router.back();
      }
    }, 1000);
  };

  const handleBack = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <div className="w-full bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-7 lg:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#E9EFF6]">

      <div className="flex items-center gap-3 mb-8">
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
          Add Assets
        </h2>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
          <svg viewBox="0 0 20 20" className="w-5 h-5 fill-emerald-600 shrink-0">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Asset successfully added! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">

        <div className="space-y-4">
          <h3 className="text-[15px] sm:text-[16px] font-bold text-gray-900">
            Asset Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            <div className="flex flex-col">
              <label className="text-[13px] font-bold text-gray-800 mb-2">
                Asset Name
              </label>
              <input
                type="text"
                placeholder="Name"
                value={assetName}
                onChange={(e) => {
                  setAssetName(e.target.value);
                  if (errors.assetName) setErrors((prev) => ({ ...prev, assetName: '' }));
                }}
                className={`w-full bg-[#F0F4FA] text-gray-800 text-[13.5px] font-medium py-3 px-4 rounded-xl border-0 placeholder-[#8B9EB7] focus:outline-none focus:ring-2 focus:ring-[#1A7DE8]/40 transition-all ${
                  errors.assetName ? 'ring-2 ring-red-400' : ''
                }`}
              />
              {errors.assetName && (
                <span className="text-[11px] text-red-500 mt-1 font-medium">{errors.assetName}</span>
              )}
            </div>

            <div className="flex flex-col relative">
              <label className="text-[13px] font-bold text-gray-800 mb-2">
                Asset Category
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Category"
                  value={assetCategory}
                  onChange={(e) => {
                    setAssetCategory(e.target.value);
                    setCategoryId(''); // Reset ID if typed manually
                    if (errors.assetCategory) setErrors((prev) => ({ ...prev, assetCategory: '' }));
                  }}
                  onClick={() => setCategoryDropdownOpen(true)}
                  className={`w-full bg-[#F0F4FA] text-gray-800 text-[13.5px] font-medium py-3 pl-4 pr-10 rounded-xl border-0 placeholder-[#8B9EB7] focus:outline-none focus:ring-2 focus:ring-[#1A7DE8]/40 transition-all cursor-pointer ${
                    errors.assetCategory ? 'ring-2 ring-red-400' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setCategoryDropdownOpen((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-700 hover:text-gray-900"
                >
                  <svg
                    viewBox="0 0 20 20"
                    className={`w-4 h-4 stroke-gray-800 stroke-[2.4] transition-transform ${
                      categoryDropdownOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    strokeLinecap="round"
                  >
                    <polyline points="5 8 10 13 15 8" />
                  </svg>
                </button>
              </div>
              {errors.assetCategory && (
                <span className="text-[11px] text-red-500 mt-1 font-medium">{errors.assetCategory}</span>
              )}

              {categoryDropdownOpen && (
                <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-100 z-30 py-1 max-h-48 overflow-y-auto">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setAssetCategory(cat.categoryName);
                        setCategoryId(cat.id);
                        setCategoryDropdownOpen(false);
                        if (errors.assetCategory) setErrors((prev) => ({ ...prev, assetCategory: '' }));
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-blue-50 transition-colors"
                    >
                      {cat.categoryName}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-[13px] font-bold text-gray-800 mb-2">
                Asset Quantity
              </label>
              <input
                type="text"
                placeholder=""
                value={assetQuantity}
                onChange={(e) => {
                  setAssetQuantity(e.target.value);
                  if (errors.assetQuantity) setErrors((prev) => ({ ...prev, assetQuantity: '' }));
                }}
                className={`w-full bg-[#F0F4FA] text-gray-800 text-[13.5px] font-medium py-3 px-4 rounded-xl border-0 placeholder-[#8B9EB7] focus:outline-none focus:ring-2 focus:ring-[#1A7DE8]/40 transition-all ${
                  errors.assetQuantity ? 'ring-2 ring-red-400' : ''
                }`}
              />
              {errors.assetQuantity && (
                <span className="text-[11px] text-red-500 mt-1 font-medium">{errors.assetQuantity}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 pt-2">
            <div className="flex flex-col relative">
              <label className="text-[13px] font-bold text-gray-800 mb-2">
                Asset Company Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Company Name"
                  value={assetCompanyName}
                  onChange={(e) => {
                    setAssetCompanyName(e.target.value);
                    if (errors.assetCompanyName) setErrors((prev) => ({ ...prev, assetCompanyName: '' }));
                  }}
                  onClick={() => setCompanyDropdownOpen(true)}
                  className={`w-full bg-[#F0F4FA] text-gray-800 text-[13.5px] font-medium py-3 pl-4 pr-10 rounded-xl border-0 placeholder-[#8B9EB7] focus:outline-none focus:ring-2 focus:ring-[#1A7DE8]/40 transition-all cursor-pointer ${
                    errors.assetCompanyName ? 'ring-2 ring-red-400' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setCompanyDropdownOpen((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-700 hover:text-gray-900"
                >
                  <svg
                    viewBox="0 0 20 20"
                    className={`w-4 h-4 stroke-gray-800 stroke-[2.4] transition-transform ${
                      companyDropdownOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    strokeLinecap="round"
                  >
                    <polyline points="5 8 10 13 15 8" />
                  </svg>
                </button>
              </div>
              {errors.assetCompanyName && (
                <span className="text-[11px] text-red-500 mt-1 font-medium">{errors.assetCompanyName}</span>
              )}

              {companyDropdownOpen && (
                <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-100 z-30 py-1 max-h-48 overflow-y-auto">
                  {companies.map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setAssetCompanyName(c);
                        setCompanyDropdownOpen(false);
                        if (errors.assetCompanyName) setErrors((prev) => ({ ...prev, assetCompanyName: '' }));
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-blue-50 transition-colors"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-[13px] font-bold text-gray-800 mb-2">
                Asset Shelf Life
              </label>
              <input
                type="text"
                placeholder="Days"
                value={assetShelfLife}
                onChange={(e) => {
                  setAssetShelfLife(e.target.value);
                  if (errors.assetShelfLife) setErrors((prev) => ({ ...prev, assetShelfLife: '' }));
                }}
                className={`w-full bg-[#F0F4FA] text-gray-800 text-[13.5px] font-medium py-3 px-4 rounded-xl border-0 placeholder-[#8B9EB7] focus:outline-none focus:ring-2 focus:ring-[#1A7DE8]/40 transition-all ${
                  errors.assetShelfLife ? 'ring-2 ring-red-400' : ''
                }`}
              />
              {errors.assetShelfLife && (
                <span className="text-[11px] text-red-500 mt-1 font-medium">{errors.assetShelfLife}</span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-[13px] font-bold text-gray-800 mb-2">
                Asset Image
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-[#F0F4FA] text-gray-800 text-[13.5px] font-medium py-3 px-4 rounded-xl border-0 flex items-center justify-between cursor-pointer hover:bg-[#E8EFF8] transition-colors"
              >
                <span className={assetImageName ? 'text-gray-900 font-semibold truncate' : 'text-[#8B9EB7]'}>
                  {assetImageName || 'Upload'}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-[#1A7DE8] shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="text-[15px] sm:text-[16px] font-bold text-gray-900">
            Invoice Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            <div className="flex flex-col">
              <label className="text-[13px] font-bold text-gray-800 mb-2">
                Invoice No
              </label>
              <input
                type="text"
                placeholder="Invoice Number"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                className="w-full bg-[#F0F4FA] text-gray-800 text-[13.5px] font-medium py-3 px-4 rounded-xl border-0 placeholder-[#8B9EB7] focus:outline-none focus:ring-2 focus:ring-[#1A7DE8]/40 transition-all"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[13px] font-bold text-gray-800 mb-2">
                Invoice Date
              </label>
              <DatePicker
                value={invoiceDate}
                onChange={(v) => {
                  setInvoiceDate(v);
                  if (errors.invoiceDate) setErrors((prev) => ({ ...prev, invoiceDate: '' }));
                }}
                placeholder="Select date"
                error={errors.invoiceDate}
              />
            </div>

            <div className="flex flex-col relative">
              <label className="text-[13px] font-bold text-gray-800 mb-2">
                Vendor Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Vendor Name"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  onClick={() => setVendorDropdownOpen(true)}
                  className="w-full bg-[#F0F4FA] text-gray-800 text-[13.5px] font-medium py-3 pl-4 pr-10 rounded-xl border-0 placeholder-[#8B9EB7] focus:outline-none focus:ring-2 focus:ring-[#1A7DE8]/40 transition-all cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => setVendorDropdownOpen((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-700 hover:text-gray-900"
                >
                  <svg
                    viewBox="0 0 20 20"
                    className={`w-4 h-4 stroke-gray-800 stroke-[2.4] transition-transform ${
                      vendorDropdownOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    strokeLinecap="round"
                  >
                    <polyline points="5 8 10 13 15 8" />
                  </svg>
                </button>
              </div>

              {vendorDropdownOpen && (
                <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-100 z-30 py-1 max-h-48 overflow-y-auto">
                  {vendors.map((v, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setVendorName(v);
                        setVendorDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-blue-50 transition-colors"
                    >
                      {v}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="text-[15px] sm:text-[16px] font-bold text-gray-900">
            Acquisition Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            <div className="flex flex-col">
              <label className="text-[13px] font-bold text-gray-800 mb-2">
                Acquisition Cost
              </label>
              <input
                type="text"
                placeholder="₹ 000000"
                value={acquisitionCost}
                onChange={(e) => {
                  setAcquisitionCost(e.target.value);
                  if (errors.acquisitionCost) setErrors((prev) => ({ ...prev, acquisitionCost: '' }));
                }}
                className={`w-full bg-[#F0F4FA] text-gray-800 text-[13.5px] font-medium py-3 px-4 rounded-xl border-0 placeholder-[#8B9EB7] focus:outline-none focus:ring-2 focus:ring-[#1A7DE8]/40 transition-all ${
                  errors.acquisitionCost ? 'ring-2 ring-red-400' : ''
                }`}
              />
              {errors.acquisitionCost && (
                <span className="text-[11px] text-red-500 mt-1 font-medium">{errors.acquisitionCost}</span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-[13px] font-bold text-gray-800 mb-2">
                Acquisition Date
              </label>
              <DatePicker
                value={acquisitionDate}
                onChange={(v) => {
                  setAcquisitionDate(v);
                  if (errors.acquisitionDate) setErrors((prev) => ({ ...prev, acquisitionDate: '' }));
                }}
                placeholder="Select date"
                error={errors.acquisitionDate}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="text-[15px] sm:text-[16px] font-bold text-gray-900">
            Asset Description
          </h3>

          <textarea
            rows={4}
            placeholder="Type Message"
            value={assetDescription}
            onChange={(e) => setAssetDescription(e.target.value)}
            className="w-full bg-[#F0F4FA] text-gray-800 text-[13.5px] font-medium p-4 rounded-2xl border-0 placeholder-[#8B9EB7] focus:outline-none focus:ring-2 focus:ring-[#1A7DE8]/40 transition-all resize-y min-h-[120px]"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#E9EFF6]">
          <button
            type="button"
            onClick={handleBack}
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-7 py-2.5 rounded-xl text-sm font-semibold bg-[#1A7DE8] hover:bg-[#1669C9] text-white shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Asset'}
          </button>
        </div>

      </form>
    </div>
  );
}
export default AddAssetView;
