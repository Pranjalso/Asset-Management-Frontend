'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDepartments } from '@/src/hooks/company-dashboard/useDepartments';
import { validators, validateForm } from '@/src/lib/validations';


function AddDepartmentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('editId');
  const { departments, addDepartment, updateDepartment } = useDepartments();

  const [departmentName, setDepartmentName] = useState('');
  const [departmentManagerName, setDepartmentManagerName] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReady, setIsReady] = useState(!editId);

  useEffect(() => {
    if (editId && departments.length > 0) {
      const department = departments.find((d) => String(d.id) === String(editId));
      if (department) {
        setDepartmentName(department.departmentName);
        setDepartmentManagerName(department.deptManagerName || '');
      }
      setIsReady(true);
    }
  }, [editId, departments]);

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const formData = {
      departmentName,
      departmentManagerName,
    };

    const validationRules: Record<string, (value: string) => string | null> = {
      departmentName: (v) => {
        const req = validators.required(v, 'Department name');
        if (req) return req;
        return validators.minLength(v, 2, 'Department name');
      },
      departmentManagerName: (v) => {
        if (!v) return null;
        return validators.minLength(v, 2, 'Department manager name');
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
        await updateDepartment(editId, {
          department_name: departmentName.trim(),
          dept_manager_name: departmentManagerName.trim() || undefined,
        });
      } else {
        await addDepartment({
          department_name: departmentName.trim(),
          dept_manager_name: departmentManagerName.trim() || undefined,
        });
      }
      router.back();
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'message' in err
        ? String((err as { message: unknown }).message)
        : `Failed to ${editId ? 'update' : 'create'} department`;
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
          {editId ? 'Edit Department Management' : 'Add Department Management'}
        </h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">

          <div className="flex flex-col">
            <label className="text-[13px] font-bold text-gray-700 mb-2.5">
              Department Name
            </label>
            <input
              type="text"
              placeholder="Name"
              value={departmentName}
              onChange={(e) => {
                setDepartmentName(e.target.value);
                if (errors.departmentName) setErrors((prev) => ({ ...prev, departmentName: '' }));
              }}
              className={`w-full bg-[#F5F8FC] text-gray-800 text-[13.5px] font-medium py-3 px-4 rounded-xl border-0 placeholder-[#8B9EB7] focus:outline-none focus:ring-2 focus:ring-[#1A7DE8]/40 transition-all ${
                errors.departmentName ? 'ring-2 ring-red-400' : ''
              }`}
            />
            {errors.departmentName && (
              <span className="text-[11px] text-red-500 mt-1 font-medium">{errors.departmentName}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-[13px] font-bold text-gray-700 mb-2.5">
              Department Manager Name
            </label>
            <input
              type="text"
              placeholder="Name"
              value={departmentManagerName}
              onChange={(e) => {
                setDepartmentManagerName(e.target.value);
                if (errors.departmentManagerName) setErrors((prev) => ({ ...prev, departmentManagerName: '' }));
              }}
              className={`w-full bg-[#F5F8FC] text-gray-800 text-[13.5px] font-medium py-3 px-4 rounded-xl border-0 placeholder-[#8B9EB7] focus:outline-none focus:ring-2 focus:ring-[#1A7DE8]/40 transition-all ${
                errors.departmentManagerName ? 'ring-2 ring-red-400' : ''
              }`}
            />
            {errors.departmentManagerName && (
              <span className="text-[11px] text-red-500 mt-1 font-medium">{errors.departmentManagerName}</span>
            )}
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
            className="px-8 py-2.5 rounded-xl text-[14px] font-bold bg-[#1A7DE8] hover:bg-[#1669C9] text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>

      </form>
    </div>
  );
}

export function AddDepartmentView() {
  return (
    <Suspense fallback={<div className="p-8 flex justify-center text-gray-500">Loading...</div>}>
      <AddDepartmentForm />
    </Suspense>
  );
}

export default AddDepartmentView;
