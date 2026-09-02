'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ROUTES } from '@/src/constants/routes';
import type { AuthUser } from '@/src/types';
import { getAvatarUrl } from '@/src/lib/api-client';

interface CompanyProfilePopupProps {
  onClose: () => void;
  onLogout: () => void;
  user?: AuthUser | null;
  profileRoute?: string;
  helpRoute?: string;
}

export default function CompanyProfilePopup({
  onClose,
  onLogout,
  user,
  profileRoute = ROUTES.COMPANY_DASHBOARD_PROFILE,
  helpRoute = ROUTES.COMPANY_DASHBOARD_HELP,
}: CompanyProfilePopupProps) {
  const router = useRouter();

  const navigate = (path: string) => {
    onClose();
    router.push(path);
  };

  const ITEMS = [
    {
      label: 'Your Profile',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#1A7DE8]" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
      ),
      action: () => navigate(profileRoute),
    },
    {
      label: 'Help Center',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#1A7DE8]" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <circle cx="12" cy="17" r=".5" fill="currentColor" />
        </svg>
      ),
      action: () => navigate(helpRoute),
    },
    {
      label: 'Logout',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#1A7DE8]" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      ),
      action: () => { onClose(); onLogout(); },
    },
  ];

  const displayName = user?.name ?? 'Company User';
  const displayEmail = user?.email ?? 'company@flutterflirt.com';
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [user?.avatarUrl]);

  return (
    <div className="w-[300px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
      <div className="flex flex-col items-center pt-8 pb-6">
        <div className="relative mb-4">
          {user?.avatarUrl && !imgError ? (
            <Image
              src={getAvatarUrl(user.avatarUrl) || ''}
              alt={displayName}
              width={112}
              height={112}
              className="w-28 h-28 rounded-full object-cover"
              unoptimized
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#1A7DE8] to-[#3B95F5] flex items-center justify-center text-white text-2xl font-bold">
              {initials}
            </div>
          )}
        </div>
        <p className="text-[15px] font-bold text-gray-900 leading-tight">{displayName}</p>
        <p className="text-xs text-gray-500 mt-0.5">{displayEmail}</p>
        <span className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-[11px] font-semibold text-[#1A7DE8] border border-blue-100">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Active
        </span>
      </div>

      <div className="px-5 pb-5">
        {ITEMS.map((item, idx) => (
          <div key={item.label}>
            <button onClick={item.action} className="w-full flex items-center justify-between py-4 hover:opacity-70 transition-opacity">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#EEF4FC] flex items-center justify-center shrink-0">{item.icon}</div>
                <span className="text-[15px] font-medium text-gray-900">{item.label}</span>
              </div>
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            {idx < ITEMS.length - 1 && <div className="border-t border-gray-100" />}
          </div>
        ))}
      </div>
    </div>
  );
}

