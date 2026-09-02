'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useBranches } from '@/src/hooks/company-dashboard/useBranches';
import { FormField, TextInput, TextArea, SelectField } from '@/src/components/ui';
import { validators, validateForm } from '@/src/lib/validations';

function AddBranchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('editId');
  const { branches, addBranch, updateBranch } = useBranches();
  
  const [branchName, setBranchName] = useState('');
  const [branchCategory, setBranchCategory] = useState('');
  const [branchAddress, setBranchAddress] = useState('');
  const [branchPincode, setBranchPincode] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [isReady, setIsReady] = useState(!editId);

  useEffect(() => {
    if (editId && branches.length > 0) {
      const branch = branches.find((b) => String(b.id) === String(editId));
      if (branch) {
        setBranchName(branch.name);
        setBranchCategory(branch.category || '');
        setBranchAddress(branch.address || '');
        setBranchPincode(branch.pincode || '');
      }
      setIsReady(true);
    }
  }, [editId, branches]);

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const formData = {
      name: branchName,
      category: branchCategory,
      address: branchAddress,
      pincode: branchPincode,
    };

    const validationRules: Record<string, (value: string) => string | null> = {
      name: (v) => {
        const req = validators.required(v, 'Branch name');
        if (req) return req;
        return validators.minLength(v, 2, 'Branch name');
      },
      category: (v) => validators.required(v, 'Branch category'),
      address: (v) => {
        const req = validators.required(v, 'Branch address');
        if (req) return req;
        return validators.minLength(v, 2, 'Branch address');
      },
      pincode: (v) => {
        const req = validators.required(v, 'Branch pincode');
        if (req) return req;
        return validators.pincode(v);
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
      if (editId) {
        await updateBranch(editId, {
          name: branchName.trim(),
          category: branchCategory,
          address: branchAddress.trim(),
          pincode: branchPincode.trim(),
        });
      } else {
        await addBranch({
          name: branchName.trim(),
          category: branchCategory,
          address: branchAddress.trim(),
          pincode: branchPincode.trim(),
        });
      }
      router.back();
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'message' in err
        ? String((err as { message: unknown }).message)
        : `Failed to ${editId ? 'update' : 'create'} branch`;
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isReady) {
    return <div className="p-8 flex justify-center text-gray-500">Loading...</div>;
  }

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
          {editId ? 'Edit Branch Management' : 'Add Branch Management'}
        </h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">
          
          <FormField label="Branch Name" htmlFor="branchName" error={errors.name} required>
            <TextInput
              id="branchName"
              type="text"
              placeholder="Name"
              value={branchName}
              onChange={setBranchName}
              error={errors.name}
            />
          </FormField>

          <FormField label="Branch Category" htmlFor="branchCategory" error={errors.category} required>
            <SelectField
              id="branchCategory"
              value={branchCategory}
              onChange={setBranchCategory}
              error={errors.category}
              placeholder="Yes/No"
              options={[
                { value: 'Yes', label: 'Yes' },
                { value: 'No', label: 'No' },
              ]}
            />
          </FormField>

          <FormField label="Branch Address" htmlFor="branchAddress" error={errors.address} required>
            <TextArea
              id="branchAddress"
              rows={4}
              placeholder="Address"
              value={branchAddress}
              onChange={setBranchAddress}
              error={errors.address}
              className="min-h-[120px]"
            />
          </FormField>

          <FormField label="Branch Pincode" htmlFor="branchPincode" error={errors.pincode} required>
            <TextInput
              id="branchPincode"
              type="text"
              placeholder="Pincode"
              value={branchPincode}
              onChange={setBranchPincode}
              error={errors.pincode}
            />
          </FormField>
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
            className="px-8 py-2.5 rounded-xl text-[14px] font-bold bg-[#1A7DE8] hover:bg-[#1669C9] text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>

      </form>
    </div>
  );
}

export function AddBranchView() {
  return (
    <Suspense fallback={<div className="p-8 flex justify-center text-gray-500">Loading...</div>}>
      <AddBranchForm />
    </Suspense>
  );
}

export default AddBranchView;
