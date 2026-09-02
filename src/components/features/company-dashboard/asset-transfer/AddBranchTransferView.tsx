'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { assetOpsService } from '@/src/services/assetOps.service';
import { useAssets } from '@/src/hooks/company-dashboard/useAssets';
import { useBranches } from '@/src/hooks/company-dashboard/useBranches';
import { useDepartments } from '@/src/hooks/company-dashboard/useDepartments';
import { validators, validateForm } from '@/src/lib/validations';
import DatePicker from '@/src/components/ui/DatePicker';

export function AddBranchTransferView() {
  const router = useRouter();
  const { assets } = useAssets();
  const { branches } = useBranches();
  const { departments } = useDepartments();

  const [assetId, setAssetId] = useState('');
  const [branchId, setBranchId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [transferDate, setTransferDate] = useState('');
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
      branchId,
      transferDate,
      employeeName,
    };

    const validationRules: Record<string, (value: string) => string | null> = {
      assetId: (v) => validators.required(v, 'Asset'),
      branchId: (v) => validators.required(v, 'Branch'),
      transferDate: (v) => validators.date(v, 'Transfer date'),
      employeeName: (v) => {
        if (!v) return null;
        return validators.minLength(v, 2, 'Employee name');
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
      await assetOpsService.createTransfer({
        asset_id: assetId,
        to_branch_id: branchId,
        to_department_id: departmentId || undefined,
        employee_name: employeeName.trim() || undefined,
        transfer_date: transferDate,
        transfer_type: 'branch',
        notes: notes.trim() || undefined,
      });
      router.back();
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'message' in err
        ? String((err as { message: unknown }).message)
        : 'Failed to create asset transfer';
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
          Branch Asset Transfer
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

          <div className="flex flex-col relative">
            <label className="text-[13px] font-bold text-gray-600 mb-2">
              Branch Name
            </label>
            <div className="relative w-full">
              <select
                value={branchId}
                onChange={(e) => {
                  setBranchId(e.target.value);
                  if (errors.branchId) setErrors((prev) => ({ ...prev, branchId: '' }));
                }}
                className={`w-full appearance-none bg-[#F5F8FC] text-gray-800 text-[13.5px] font-medium py-3 pl-4 pr-10 rounded-[12px] border-0 focus:outline-none focus:ring-2 focus:ring-[#1A7DE8]/40 transition-all cursor-pointer ${
                  errors.branchId ? 'ring-2 ring-red-400' : ''
                }`}
              >
                <option value="" disabled hidden>Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                <svg className="w-4 h-4 stroke-gray-900" fill="none" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
            {errors.branchId && (
              <span className="text-[11px] text-red-500 mt-1 font-medium">{errors.branchId}</span>
            )}
          </div>

          <div className="flex flex-col relative">
            <label className="text-[13px] font-bold text-gray-600 mb-2">
              Dept Name (Optional)
            </label>
            <div className="relative w-full">
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full appearance-none bg-[#F5F8FC] text-gray-800 text-[13.5px] font-medium py-3 pl-4 pr-10 rounded-[12px] border-0 focus:outline-none focus:ring-2 focus:ring-[#1A7DE8]/40 transition-all cursor-pointer"
              >
                <option value="">None</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                <svg className="w-4 h-4 stroke-gray-900" fill="none" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-[13px] font-bold text-gray-600 mb-2">
              Employee Name (Optional)
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
              Transfer Date
            </label>
            <DatePicker
              value={transferDate}
              onChange={(v) => {
                setTransferDate(v);
                if (errors.transferDate) setErrors((prev) => ({ ...prev, transferDate: '' }));
              }}
              placeholder="Select date"
              error={errors.transferDate}
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
            className="px-8 py-2.5 rounded-xl text-[14px] font-bold text-gray-900 bg-white border-2 border-[#1A7DE8] text-[#1A7DE8] hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-2.5 rounded-xl text-[14px] font-bold bg-[#007AFF] hover:bg-[#0062CC] text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>

      </form>
    </div>
  );
}

export default AddBranchTransferView;
