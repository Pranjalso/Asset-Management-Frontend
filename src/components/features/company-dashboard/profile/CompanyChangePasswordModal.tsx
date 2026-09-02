'use client';

import { useState } from 'react';
import { companyProfileService } from '@/src/services/company-dashboard/company-profile.service';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EyeOffIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-5 h-5 text-gray-500"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const EyeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-5 h-5 text-gray-500"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default function CompanyChangePasswordModal({
  open,
  onClose,
  onSuccess,
}: Props) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setError('Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    setError('');
    try {
      setLoading(true);
      await companyProfileService.changePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onSuccess();
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Failed to change password. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-4 -right-4 w-9 h-9 bg-white rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 shadow-sm z-10 text-sm font-bold"
        >
          ✕
        </button>
        <div className="px-8 py-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Password</h2>
          <p className="text-sm text-gray-600 mb-8 leading-relaxed">
            Choose a strong, unique password to keep your account secure. Avoid
            using the same password across other platforms or accounts.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#EEF4FC] border-0 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A7DE8] pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showCurrent ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#EEF4FC] border-0 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A7DE8] pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showNew ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-bold text-gray-900 mb-1">
                Password Strength
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Use 8+ characters with uppercase, lowercase, number &amp;
                special character. Avoid common or reused passwords.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#EEF4FC] border-0 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A7DE8] pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showConfirm ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-7 py-3 rounded-full bg-[#1A7DE8] hover:bg-[#1669C9] disabled:opacity-60 text-white text-sm font-semibold transition-colors"
              >
                {loading ? 'Saving…' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
