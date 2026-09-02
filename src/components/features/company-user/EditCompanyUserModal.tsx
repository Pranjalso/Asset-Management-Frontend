'use client';

import { useEffect, useState } from 'react';
import type { CompanyUser } from '@/src/types';
import DatePicker from '@/src/components/ui/DatePicker';
import { validators, validateForm } from '@/src/lib/validations';

interface Props {
  user: CompanyUser | null;
  onClose: () => void;
  onSave: (updated: CompanyUser) => void;
  saving?: boolean;
}

const FIELDS: { key: keyof CompanyUser; label: string; type?: string; required?: boolean; isDate?: boolean; validator?: (value: string) => string | null }[] = [
  { key: 'companyName', label: 'Company Name', required: true, validator: (v) => validators.required(v, 'Company Name') },
  { key: 'companyGST', label: 'Company GST', required: false, validator: validators.gst },
  { key: 'mobileNumber', label: 'Mobile Number', required: true, validator: validators.phone },
  { key: 'companyEmail', label: 'Company Email', required: true, validator: validators.email },
  { key: 'uniqueCode', label: 'Unique Code', required: true, validator: (v) => validators.required(v, 'Unique Code') },
  { key: 'subscriptionName', label: 'Subscription Name', required: false },
  { key: 'subscriptionFromDate', label: 'Subscription From Date', required: false, isDate: true, validator: (v) => (v ? validators.date(v, 'Subscription From Date') : null) },
  { key: 'subscriptionToDate', label: 'Subscription To Date', required: false, isDate: true, validator: (v) => (v ? validators.date(v, 'Subscription To Date') : null) },
  { key: 'totalUserInCompany', label: 'Total User In Company', required: false, validator: (v) => validators.positiveNumber(String(v), 'Total User In Company') },
];

export default function EditCompanyUserModal({ user, onClose, onSave, saving = false }: Props) {
  const [form, setForm] = useState<CompanyUser | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => { setForm(user ? { ...user } : null); setErrors({}); }, [user]);
  if (!user || !form) return null;

  const handleChange = (key: keyof CompanyUser, value: string) => {
    setForm((prev) => prev ? { ...prev, [key]: value } : prev);
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const runValidation = () => {
    const rules: Record<string, (value: string) => string | null> = {};
    FIELDS.forEach(({ key, validator }) => {
      if (validator) rules[key as string] = (v) => validator(v);
    });
    const data: Record<string, string> = {};
    (Object.keys(form) as (keyof CompanyUser)[]).forEach((k) => {
      data[k as string] = String(form[k] ?? '');
    });
    const newErrors = validateForm(data, rules);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (runValidation() && form) onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900">Edit Company User</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500">
            <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="4" y1="4" x2="16" y2="16" /><line x1="16" y1="4" x2="4" y2="16" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FIELDS.map(({ key, label, type = 'text', required, isDate }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-800 mb-1">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                {isDate ? (
                  <DatePicker
                    value={String(form[key] ?? '')}
                    onChange={(value) => handleChange(key, value)}
                    placeholder={`Select ${label.toLowerCase()}`}
                    error={errors[key]}
                    disabled={saving}
                  />
                ) : (
                  <>
                    <input
                      type={type}
                      value={String(form[key] ?? '')}
                      onChange={(e) => handleChange(key, e.target.value)}
                      disabled={saving}
                      placeholder={`Enter ${label.toLowerCase()}`}
                      className={`w-full px-3 py-2 text-sm text-gray-900 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A7DE8] focus:border-transparent transition-shadow disabled:opacity-50 disabled:cursor-not-allowed ${
                        errors[key] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors[key] && <p className="mt-1 text-xs text-red-500">{errors[key]}</p>}
                  </>
                )}
              </div>
            ))}
          </div>
        </form>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button type="button" onClick={onClose} disabled={saving} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
          <button type="submit" onClick={handleSubmit} disabled={saving} className="px-5 py-2 text-sm font-semibold text-white bg-[#1A7DE8] hover:bg-[#1669C9] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
