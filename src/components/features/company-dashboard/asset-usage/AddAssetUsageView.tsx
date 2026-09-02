'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { assetOpsService } from '@/src/services/assetOps.service';
import { useAssets } from '@/src/hooks/company-dashboard/useAssets';
import { validators, validateForm } from '@/src/lib/validations';
import DatePicker from '@/src/components/ui/DatePicker';

export function AddAssetUsageView() {
  const router = useRouter();
  const { assets } = useAssets();

  const [assetId, setAssetId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [usageDepartment, setUsageDepartment] = useState('');
  const [usageCost, setUsageCost] = useState('');
  const [usageDate, setUsageDate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const formData = {
      assetId,
      employeeName,
      usageCost,
      usageDate,
      usageDepartment,
    };

    const validationRules: Record<string, (value: string) => string | null> = {
      assetId: (v) => validators.required(v, 'Asset'),
      employeeName: (v) => {
        const req = validators.required(v, 'Employee name');
        if (req) return req;
        return validators.minLength(v, 2, 'Employee name');
      },
      usageCost: (v) => validators.positiveNumber(v, 'Usage cost'),
      usageDate: (v) => validators.date(v, 'Usage date'),
      usageDepartment: (v) => {
        if (!v) return null;
        return validators.minLength(v, 2, 'Usage department');
      },
    };

    const validationErrors = validateForm(formData, validationRules);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      await assetOpsService.createUsage({
        asset_id: assetId,
        employee_name: employeeName.trim(),
        usage_department: usageDepartment.trim() || undefined,
        usage_cost: parseFloat(usageCost),
        usage_date: usageDate,
        usage_type: 'assignment',
        notes: notes.trim() || undefined,
      });
      router.back();
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'message' in err
        ? String((err as { message: unknown }).message)
        : 'Failed to create asset usage record';
      setError(message);
    } finally {
      setIsSubmitting(false);
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
          Asset Usage Information
        </h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 mb-8">

          <div className="flex flex-col relative">
            <label className="text-[13px] font-bold text-gray-600 mb-2">
              Asset Name
            </label>
            <div className="relative w-full">
              <select
                value={assetId}
                onChange={(e) => {
                  setAssetId(e.target.value);
                  if (errors.assetId) setErrors((prev) => ({ ...prev, assetId: '' }));
                }}
                className={`w-full appearance-none bg-[#F5F8FC] text-gray-800 text-[13.5px] font-medium py-3 pl-4 pr-10 rounded-[12px] border-0 focus:outline-none focus:ring-2 focus:ring-[#1A7DE8]/40 transition-all cursor-pointer ${
                  errors.assetId ? 'ring-2 ring-red-400' : ''
                }`}
              >
                <option value="" disabled hidden>Select Asset</option>
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.assetName}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                <svg className="w-4 h-4 stroke-gray-900" fill="none" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
            {errors.assetId && (
              <span className="text-[11px] text-red-500 mt-1 font-medium">{errors.assetId}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-[13px] font-bold text-gray-600 mb-2">
              Employee Name
            </label>
            <input
              type="text"
              placeholder="Name"
              value={employeeName}
              onChange={(e) => {
                setEmployeeName(e.target.value);
                if (errors.employeeName) setErrors((prev) => ({ ...prev, employeeName: '' }));
              }}
              className={`w-full bg-[#F5F8FC] text-gray-800 text-[13.5px] font-medium py-3 px-4 rounded-[12px] border-0 placeholder-[#8B9EB7] focus:outline-none focus:ring-2 focus:ring-[#1A7DE8]/40 transition-all ${
                errors.employeeName ? 'ring-2 ring-red-400' : ''
              }`}
            />
            {errors.employeeName && (
              <span className="text-[11px] text-red-500 mt-1 font-medium">{errors.employeeName}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-[13px] font-bold text-gray-600 mb-2">
              Usage Department
            </label>
            <input
              type="text"
              placeholder="Dept Name"
              value={usageDepartment}
              onChange={(e) => {
                setUsageDepartment(e.target.value);
                if (errors.usageDepartment) setErrors((prev) => ({ ...prev, usageDepartment: '' }));
              }}
              className={`w-full bg-[#F5F8FC] text-gray-800 text-[13.5px] font-medium py-3 px-4 rounded-[12px] border-0 placeholder-[#8B9EB7] focus:outline-none focus:ring-2 focus:ring-[#1A7DE8]/40 transition-all ${
                errors.usageDepartment ? 'ring-2 ring-red-400' : ''
              }`}
            />
            {errors.usageDepartment && (
              <span className="text-[11px] text-red-500 mt-1 font-medium">{errors.usageDepartment}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-[13px] font-bold text-gray-600 mb-2">
              Usage cost
            </label>
            <input
              type="text"
              placeholder="COST"
              value={usageCost}
              onChange={(e) => {
                setUsageCost(e.target.value);
                if (errors.usageCost) setErrors((prev) => ({ ...prev, usageCost: '' }));
              }}
              className={`w-full bg-[#F5F8FC] text-gray-800 text-[13.5px] font-medium py-3 px-4 rounded-[12px] border-0 placeholder-[#8B9EB7] focus:outline-none focus:ring-2 focus:ring-[#1A7DE8]/40 transition-all ${
                errors.usageCost ? 'ring-2 ring-red-400' : ''
              }`}
            />
            {errors.usageCost && (
              <span className="text-[11px] text-red-500 mt-1 font-medium">{errors.usageCost}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-[13px] font-bold text-gray-600 mb-2">
              Usage Date
            </label>
            <DatePicker
              value={usageDate}
              onChange={(v) => {
                setUsageDate(v);
                if (errors.usageDate) setErrors((prev) => ({ ...prev, usageDate: '' }));
              }}
              placeholder="Select date"
              error={errors.usageDate}
            />
          </div>

          <div className="flex flex-col md:col-span-3">
            <label className="text-[13px] font-bold text-gray-600 mb-2">
              Notes (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#F5F8FC] text-gray-800 text-[13.5px] font-medium py-3 px-4 rounded-[12px] border-0 placeholder-[#8B9EB7] focus:outline-none focus:ring-2 focus:ring-[#1A7DE8]/40 transition-all resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-[#E9EFF6]">
          <button
            type="button"
            onClick={handleBack}
            disabled={isSubmitting}
            className="px-8 py-2.5 rounded-xl text-[14px] font-bold text-[#1A7DE8] bg-white border-2 border-[#1A7DE8] hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-2.5 rounded-xl text-[14px] font-bold bg-[#1A7DE8] hover:bg-[#1669C9] text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>

      </form>
    </div>
  );
}

export default AddAssetUsageView;
