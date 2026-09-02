'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/src/constants/routes';
import type { AddCompanyUserFormState } from '@/src/types';
import DatePicker from '@/src/components/ui/DatePicker';
import { validators, validateForm } from '@/src/lib/validations';

const INITIAL: AddCompanyUserFormState = {
  companyName: '', companyGST: '', mobileNumber: '', companyGmail: '',
  uniqueCode: '', subscriptionName: '', subscriptionFromDate: '', subscriptionToDate: '', totalUserInCompany: '',
};

interface Props {
  onSubmit?: (data: AddCompanyUserFormState) => Promise<void> | void;
}

export default function AddCompanyUserForm({ onSubmit }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<AddCompanyUserFormState>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (key: keyof AddCompanyUserFormState, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const runValidation = (): Record<string, string> => {
    const rules: Record<string, (value: string) => string | null> = {
      companyName: (v) => validators.required(v, 'Company Name'),
      companyGmail: validators.email,
      uniqueCode: (v) => validators.required(v, 'Unique Code'),
      companyGST: validators.gst,
      mobileNumber: validators.phone,
      totalUserInCompany: (v) => validators.positiveNumber(v, 'Total User In Company'),
    };
    return validateForm(form as unknown as Record<string, string>, rules);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = runValidation();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try { setLoading(true); await onSubmit?.(form); router.push(ROUTES.COMPANY_USER); }
    finally { setLoading(false); }
  };

  const inputClass = (key: string) =>
    `w-full px-4 py-3 rounded-full bg-[#DBEAFE] border-0 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A7DE8] transition-shadow ${
      errors[key] ? '!ring-2 !ring-red-400 !bg-[#FEE2E2]' : ''
    }`;

  return (
    <div className="min-h-full bg-[#E8EEF7] flex items-start justify-center p-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md px-10 py-8">
        <div className="flex items-center gap-3 mb-8">
          <button type="button" onClick={() => router.back()} className="text-gray-900 hover:text-gray-600 transition-colors">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Add Company User</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 mb-8">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Company Name <span className="text-red-500">*</span></label>
              <input type="text" placeholder="Enter company name" value={form.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                className={inputClass('companyName')} />
              {errors.companyName && <p className="mt-1 text-xs text-red-500">{errors.companyName}</p>}
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Company GST</label>
              <input type="text" placeholder="Enter GST number" value={form.companyGST}
                onChange={(e) => handleChange('companyGST', e.target.value)}
                className={inputClass('companyGST')} />
              {errors.companyGST && <p className="mt-1 text-xs text-red-500">{errors.companyGST}</p>}
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Mobile Number <span className="text-red-500">*</span></label>
              <input type="tel" placeholder="Enter mobile number" value={form.mobileNumber}
                onChange={(e) => handleChange('mobileNumber', e.target.value)}
                className={inputClass('mobileNumber')} />
              {errors.mobileNumber && <p className="mt-1 text-xs text-red-500">{errors.mobileNumber}</p>}
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Company Email <span className="text-red-500">*</span></label>
              <input type="email" placeholder="Enter company email" value={form.companyGmail}
                onChange={(e) => handleChange('companyGmail', e.target.value)}
                className={inputClass('companyGmail')} />
              {errors.companyGmail && <p className="mt-1 text-xs text-red-500">{errors.companyGmail}</p>}
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Unique Code <span className="text-red-500">*</span></label>
              <input type="text" placeholder="Enter unique code" value={form.uniqueCode}
                onChange={(e) => handleChange('uniqueCode', e.target.value)}
                className={inputClass('uniqueCode')} />
              {errors.uniqueCode && <p className="mt-1 text-xs text-red-500">{errors.uniqueCode}</p>}
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Subscription Name</label>
              <input type="text" placeholder="Enter subscription name" value={form.subscriptionName}
                onChange={(e) => handleChange('subscriptionName', e.target.value)}
                className={inputClass('subscriptionName')} />
              {errors.subscriptionName && <p className="mt-1 text-xs text-red-500">{errors.subscriptionName}</p>}
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Subscription From Date</label>
              <DatePicker
                value={form.subscriptionFromDate}
                onChange={(value) => handleChange('subscriptionFromDate', value)}
                placeholder="Select from date"
                error={errors.subscriptionFromDate}
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Subscription To Date</label>
              <DatePicker
                value={form.subscriptionToDate}
                onChange={(value) => handleChange('subscriptionToDate', value)}
                placeholder="Select to date"
                error={errors.subscriptionToDate}
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">Total User In Company <span className="text-red-500">*</span></label>
              <input type="number" placeholder="Enter total users" value={form.totalUserInCompany}
                onChange={(e) => handleChange('totalUserInCompany', e.target.value)}
                className={inputClass('totalUserInCompany')} />
              {errors.totalUserInCompany && <p className="mt-1 text-xs text-red-500">{errors.totalUserInCompany}</p>}
            </div>
          </div>
          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={() => router.back()} className="px-7 py-2.5 rounded-full border border-gray-900 text-gray-900 text-sm font-semibold bg-white hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-8 py-2.5 rounded-full bg-[#1A7DE8] hover:bg-[#1669C9] disabled:opacity-60 text-white text-sm font-semibold transition-colors">{loading ? 'Submitting…' : 'Submit'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
