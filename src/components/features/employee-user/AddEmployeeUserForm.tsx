'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/src/constants/routes';
import { useCompanyUsers } from '@/src/hooks';
import type { AddEmployeeUserFormState } from '@/src/types';

const INITIAL: AddEmployeeUserFormState = {
  companyId: '',
  companyName: '',
  employeeName: '',
  mobileNumber: '',
  designation: '',
  email: '',
  password: '',
};

interface Props {
  onSubmit?: (data: AddEmployeeUserFormState) => Promise<void> | void;
}

export default function AddEmployeeUserForm({ onSubmit }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<AddEmployeeUserFormState>(INITIAL);
  const [loading, setLoading] = useState(false);
  const { users: companies, loading: companiesLoading, error: companiesError } = useCompanyUsers();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return Boolean(
      form.companyId &&
      form.employeeName.trim() &&
      form.mobileNumber.trim() &&
      form.email.trim() &&
      form.password.trim() &&
      !companiesLoading &&
      companies.length > 0
    );
  }, [form, companiesLoading, companies.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!form.companyId) {
      setSubmitError('Please select an existing company before creating an employee.');
      return;
    }

    if (!form.employeeName.trim()) {
      setSubmitError('Employee name is required.');
      return;
    }

    if (!form.mobileNumber.trim()) {
      setSubmitError('Mobile number is required.');
      return;
    }

    if (!form.email.trim()) {
      setSubmitError('Email is required.');
      return;
    }

    if (!form.password.trim()) {
      setSubmitError('Password is required.');
      return;
    }

    try {
      setLoading(true);
      await onSubmit?.(form);
      router.push(ROUTES.EMPLOYEE_USER);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Failed to create employee user.';
      setSubmitError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyChange = (companyId: string) => {
    const selectedCompany = companies.find((company) => company.id === companyId);
    setSubmitError(null);
    setForm((prev) => ({
      ...prev,
      companyId,
      companyName: selectedCompany?.companyName ?? '',
    }));
  };

  const FIELDS: { key: keyof AddEmployeeUserFormState; label: string; placeholder: string; type?: string }[] = [
    { key: 'employeeName', label: 'Employee Name', placeholder: 'Enter employee name' },
    { key: 'mobileNumber', label: 'Mobile Number', placeholder: 'Enter mobile number', type: 'tel' },
    { key: 'designation', label: 'Designation', placeholder: 'Enter designation' },
    { key: 'email', label: 'E mail', placeholder: 'Enter email address', type: 'email' },
    { key: 'password', label: 'Password', placeholder: 'Enter password', type: 'password' },
  ];

  return (
    <div className="min-h-full bg-[#E8EEF7] flex items-start justify-center p-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md px-10 py-8">
        <div className="flex items-center gap-3 mb-8">
          <button type="button" onClick={() => router.back()} className="text-gray-900 hover:text-gray-600 transition-colors">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Add Employee User</h1>
        </div>

        {companiesError && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {companiesError}
          </div>
        )}

        {submitError && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 mb-8">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Company Name</label>
              <select
                value={form.companyId}
                onChange={(e) => handleCompanyChange(e.target.value)}
                disabled={companiesLoading || loading || companies.length === 0}
                className="w-full px-4 py-3 rounded-full bg-[#DBEAFE] border-0 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A7DE8] transition-shadow disabled:opacity-60"
                required
              >
                <option value="">
                  {companiesLoading
                    ? 'Loading companies...'
                    : companies.length === 0
                      ? 'No active companies available'
                      : 'Select company'}
                </option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.companyName}
                  </option>
                ))}
              </select>
            </div>

            {FIELDS.map(({ key, label, placeholder, type = 'text' }) => (
              <div key={key}>
                <label className="block text-[13px] font-medium text-gray-700 mb-2">{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => {
                    setSubmitError(null);
                    setForm((p) => ({ ...p, [key]: e.target.value }));
                  }}
                  className="w-full px-4 py-3 rounded-full bg-[#DBEAFE] border-0 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A7DE8] transition-shadow"
                  required={key !== 'designation'}
                  disabled={loading}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={() => router.back()} className="px-7 py-2.5 rounded-full border border-gray-900 text-gray-900 text-sm font-semibold bg-white hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={loading || !canSubmit} className="px-8 py-2.5 rounded-full bg-[#1A7DE8] hover:bg-[#1669C9] disabled:opacity-60 text-white text-sm font-semibold transition-colors">{loading ? 'Submitting…' : 'Submit'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
