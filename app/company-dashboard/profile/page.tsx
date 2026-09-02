'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import Image from 'next/image';
import type { UserProfile } from '@/src/types';
import { CompanyDashboardLayout } from '@/src/components/layout/company-dashboard';
import { CompanyChangePasswordModal, CompanyPasswordSuccessModal } from '@/src/components/features/company-dashboard/profile';
import { useAuth } from '@/src/hooks';
import { useAuthContext } from '@/src/providers/AuthProvider';
import { dashboardProfileService } from '@/src/services';
import { apiRequest, getAvatarUrl } from '@/src/lib/api-client';

export default function CompanyProfilePage() {
  const { user: authUser } = useAuth('dashboard');
  const { updateDashboardUser } = useAuthContext();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [name, setName]   = useState('Dinesh');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showChangePw, setShowChangePw] = useState(false);
  const [showSuccess, setShowSuccess]   = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardProfileService.getProfile();
      setProfile(data);
      setName(data.name);
      setEmail(data.email);
      setPhone(data.phone ?? '');
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Failed to load profile.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchProfile();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSaveSuccess(false);
      const updated = await dashboardProfileService.updateProfile({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });
      setProfile(updated);
      updateDashboardUser({
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        avatarUrl: updated.avatarUrl,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Failed to save profile.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }

    try {
      setUploadingAvatar(true);
      setError(null);

      const response = await apiRequest<{ success: boolean; data: { key: string; uploadUrl: string } }>(
        '/api/dashboard/auth/profile/avatar/request-upload',
        {
          method: 'POST',
          body: JSON.stringify({
            contentType: file.type,
            contentLength: file.size,
          }),
        }
      );

      const uploadResult = await fetch(response.data.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResult.ok) {
        throw new Error('Failed to upload image to storage. Please try again.');
      }

      const confirmResponse = await apiRequest<{ success: boolean; data: UserProfile }>(
        '/api/dashboard/auth/profile/avatar/confirm-upload',
        {
          method: 'POST',
          body: JSON.stringify({ key: response.data.key }),
        }
      );

      setProfile(confirmResponse.data);
      updateDashboardUser({
        id: confirmResponse.data.id,
        name: confirmResponse.data.name,
        email: confirmResponse.data.email,
        role: confirmResponse.data.role,
        avatarUrl: confirmResponse.data.avatarUrl,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Failed to upload avatar.';
      setError(message);
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handlePasswordSuccess = () => {
    setShowChangePw(false);
    setShowSuccess(true);
  };

  const displayName = profile?.name || authUser?.name || 'Company User';
  const displayInitials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <CompanyDashboardLayout title="Profile">
      <div className="flex flex-col items-center py-8 px-6 h-full overflow-y-auto">

        {/* Avatar + camera */}
        <div className="relative w-28 h-28 mb-8 mx-auto">
          {profile?.avatarUrl ? (
            <Image
              src={getAvatarUrl(profile.avatarUrl) || ''}
              alt={displayName}
              width={112}
              height={112}
              className="w-28 h-28 rounded-full object-cover"
              unoptimized
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#1A7DE8] to-[#3B95F5] flex items-center justify-center text-white text-2xl font-bold">
              {displayInitials}
            </div>
          )}
          <button
            type="button"
            onClick={handleAvatarClick}
            disabled={uploadingAvatar}
            aria-label="Change photo"
            className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-[#DBEAFE] flex items-center justify-center border-2 border-white hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#1A7DE8]" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Upload avatar"
          />
        </div>

        {/* Form fields */}
        <div className="w-full max-w-sm space-y-5">
          {error && (
            <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
              {error}
            </div>
          )}
          {saveSuccess && (
            <div className="px-3 py-2 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
              Profile saved successfully.
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-800 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading || saving}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#EEF4FC] border-0 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A7DE8] disabled:opacity-60"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-800 mb-2">E mail</label>
              <input
                type="email"
                placeholder="E mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || saving}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#EEF4FC] border-0 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A7DE8] disabled:opacity-60"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-800 mb-2">Password</label>
              <button
                type="button"
                onClick={() => setShowChangePw(true)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[#EEF4FC] text-sm hover:bg-blue-100 transition-colors"
              >
                <span className="tracking-widest text-gray-700">············</span>
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-800 mb-2">Phone No</label>
              <input
                type="tel"
                placeholder="Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading || saving}
                className="w-full px-4 py-3 rounded-xl bg-[#EEF4FC] border-0 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A7DE8] disabled:opacity-60"
              />
            </div>

            <button
              type="submit"
              disabled={loading || saving}
              className="w-full bg-[#1A7DE8] hover:bg-[#1669C9] disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-white font-semibold py-3 rounded-md"
            >
              {loading ? 'Loading…' : saving ? 'Saving…' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>

      <CompanyChangePasswordModal
        open={showChangePw}
        onClose={() => setShowChangePw(false)}
        onSuccess={handlePasswordSuccess}
      />
      <CompanyPasswordSuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </CompanyDashboardLayout>
  );
}
