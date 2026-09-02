'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { LogoutModal } from '@/src/components/features/shared';
import { CompanyProfilePopup } from '@/src/components/features/company-dashboard/profile';
import { FlutterflirtLogo } from '@/src/components/ui/FlutterflirtLogo';
import { useAuthContext } from '@/src/providers/AuthProvider';
import { useNotifications } from '@/src/hooks';
import { getAvatarUrl } from '@/src/lib/api-client';

interface CompanyDashboardTopBarProps {
  title: string;
  onOpenMobileMenu?: () => void;
  onSearchChange?: (query: string) => void;
}

const UpdatedIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#1A7DE8]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
);

const BlockedIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#1A7DE8]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
);

export default function CompanyDashboardTopBar({
  title,
  onOpenMobileMenu,
  onSearchChange,
}: CompanyDashboardTopBarProps) {
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const { logoutDashboard, dashboardUser, isLoading } = useAuthContext();
  const { groups, loading, error, unreadCount, reload, markAllRead } = useNotifications('dashboard');

  useEffect(() => {
    setImgError(false);
  }, [dashboardUser?.avatarUrl]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      <header className="h-[68px] bg-white border-b border-[#E9EFF6] flex items-center justify-between px-5 sm:px-7 shrink-0 z-20">
        {/* Left: Hamburger (mobile) + Brand Logo + Title */}
        <div className="flex items-center gap-4 sm:gap-8">
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Open menu"
            className="p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100 md:hidden flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div className="flex items-center min-w-[140px] sm:min-w-[170px]">
            <FlutterflirtLogo />
          </div>

          <h1 className="text-[22px] sm:text-[26px] font-bold text-gray-900 leading-none tracking-tight">
            {title}
          </h1>
        </div>

        {/* Right Controls: Search bar + Notification bell + User profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Pill Search Input */}
          <div className="relative flex items-center">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              placeholder="Search"
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-full bg-[#F0F4FA] text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A7DE8]/40 w-36 sm:w-56 lg:w-64 border-0 transition-all"
            />
          </div>

          {/* Bell Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => {
                const nextOpen = !notifOpen;
                setNotifOpen(nextOpen);
                setProfileOpen(false);
                if (nextOpen) {
                  void reload();
                  void markAllRead();
                }
              }}
              className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors ${
                notifOpen ? 'bg-blue-100 ring-2 ring-[#1A7DE8]/30' : 'bg-[#EBF3FB] hover:bg-[#DDE9F8]'
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-[#1A7DE8]"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-[320px] sm:w-[360px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in-50 zoom-in-95">
                <div className="px-5 pt-5 pb-3">
                  <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                </div>
                <div className="px-4 pb-4 space-y-3 max-h-[420px] overflow-y-auto">
                  {error ? (
                    <div className="px-3 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                      {error}
                    </div>
                  ) : loading ? (
                    <div className="px-3 py-6 bg-[#EEF4FC] rounded-xl text-sm text-gray-500">
                      Loading notifications...
                    </div>
                  ) : groups.length === 0 ? (
                    <div className="px-3 py-6 bg-[#EEF4FC] rounded-xl text-sm text-gray-500">
                      No company notifications yet.
                    </div>
                  ) : groups.map((group) => (
                    <div key={group.label} className="bg-[#EEF4FC] rounded-2xl px-4 py-3">
                      <p className="text-xs text-gray-400 font-medium mb-2">{group.label}</p>
                      <div className="flex flex-col gap-2">
                        {group.items.map((item) => (
                          <div key={item.id} className="bg-white rounded-xl px-3 py-3 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#DBEAFE] flex items-center justify-center shrink-0">
                              {item.title.toLowerCase().includes('block') ? <BlockedIcon /> : <UpdatedIcon />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-bold text-gray-900 leading-tight">{item.title}</p>
                              <p className="text-[12px] text-gray-500 leading-tight mt-0.5 break-words">
                                {item.description}
                              </p>
                            </div>
                            <span className="text-[11px] text-gray-400 shrink-0 ml-1">{item.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              aria-label="Profile"
              onClick={() => {
                setProfileOpen((o) => !o);
                setNotifOpen(false);
              }}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors overflow-hidden ${
                profileOpen ? 'bg-blue-100 ring-2 ring-[#1A7DE8]/30' : 'bg-[#EBF3FB] hover:bg-[#DDE9F8]'
              }`}
            >
              {!isLoading && dashboardUser?.avatarUrl && !imgError ? (
                <img
                  src={getAvatarUrl(dashboardUser.avatarUrl)}
                  alt={dashboardUser.name || 'Profile'}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover rounded-full"
                  onError={() => setImgError(true)}
                />
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-[#1A7DE8]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] z-50">
                <CompanyProfilePopup
                  onClose={() => setProfileOpen(false)}
                  onLogout={() => setLogoutOpen(true)}
                  user={dashboardUser}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      <LogoutModal
        open={logoutOpen}
        onCancel={() => setLogoutOpen(false)}
        onConfirm={async () => {
          await logoutDashboard();
        }}
        userName={dashboardUser?.name}
      />
    </>
  );
}

