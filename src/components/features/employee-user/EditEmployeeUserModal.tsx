'use client';

import { useEffect, useState } from 'react';
import type { EmployeeUser } from '@/src/types';

interface Props {
  user: EmployeeUser | null;
  onClose: () => void;
  onSave: (updated: EmployeeUser) => void;
  saving?: boolean;
}

const FIELDS: { key: keyof EmployeeUser; label: string; type?: string; required?: boolean }[] = [
  { key: 'companyName',  label: 'Company Name',  required: true },
  { key: 'employeeName', label: 'Employee Name', required: true },
  { key: 'mobileNo',     label: 'Mobile No',     type: 'tel', required: true },
  { key: 'designation',  label: 'Designation',   required: false },
  { key: 'email',        label: 'Email',         type: 'email', required: true },
];

export default function EditEmployeeUserModal({ user, onClose, onSave, saving = false }: Props) {
  const [form, setForm]                 = useState<EmployeeUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Re-populate every time a different user is passed in
  useEffect(() => {
    setForm(user ? { ...user } : null);
    setShowPassword(false);
  }, [user]);

  if (!user || !form) return null;

  const handleChange = (key: keyof EmployeeUser, value: string) =>
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form) onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900">Edit Employee User</h3>
          <button onClick={onClose} aria-label="Close" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500">
            <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <line x1="4" y1="4" x2="16" y2="16" /><line x1="16" y1="4" x2="4" y2="16" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Regular fields */}
            {FIELDS.map(({ key, label, type = 'text', required }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-800 mb-1">
                  {label}{required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
                <input
                  type={type}
                  value={String(form[key] ?? '')}
                  onChange={(e) => handleChange(key, e.target.value)}
                  disabled={saving}
                  className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A7DE8] focus:border-transparent transition-shadow disabled:opacity-50"
                />
              </div>
            ))}

            {/* Password with show/hide */}
            <div>
              <label className="block text-xs font-medium text-gray-800 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={String(form.password ?? '')}
                  onChange={(e) => handleChange('password', e.target.value)}
                  disabled={saving}
                  placeholder="Leave blank to keep current"
                  className="w-full px-3 py-2 pr-10 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A7DE8] focus:border-transparent transition-shadow disabled:opacity-50"
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword
                    ? <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" /></svg>
                    : <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  }
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button type="button" onClick={onClose} disabled={saving}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button type="submit" onClick={handleSubmit} disabled={saving}
            className="px-5 py-2 text-sm font-semibold text-white bg-[#1A7DE8] hover:bg-[#1669C9] rounded-lg transition-colors disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
