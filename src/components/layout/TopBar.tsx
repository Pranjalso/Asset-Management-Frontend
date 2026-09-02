'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { ProfilePopup, LogoutModal } from '@/src/components/features/shared';
import { useAuthContext } from '@/src/providers/AuthProvider';
import { useNotifications } from '@/src/hooks';
import { BASE_URL, getAvatarUrl } from '@/src/lib/api-client';

interface TopBarProps { title: string; }

const ActivityIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#1A7DE8]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" />
  </svg>
);

export default function TopBar({ title }: TopBarProps) {
  const [notifOpen, setNotifOpen]     = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen]   = useState(false);
  const [imgError, setImgError]       = useState(false);
  const notifRef   = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const { logoutAdmin, adminUser } = useAuthContext();
  const { groups, loading, error, unreadCount, reload, markAllRead } = useNotifications('admin');

  const handleLogoutConfirm = async () => {
    await logoutAdmin();
  };

  useEffect(() => {
    setImgError(false);
  }, [adminUser?.avatarUrl]);

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
      <header className="h-[62px] bg-white border-b border-gray-200 flex items-center justify-between px-5 flex-shrink-0">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 min-w-[160px]">
            <Image src="/Image/icon.svg" alt="Flutterflirt" width={26} height={26} />
            <span className="text-[15px] font-bold text-gray-900 tracking-tight">Flutterflirt</span>
          </div>
          <h1 className="text-[22px] font-extrabold text-gray-900 leading-none">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden sm:flex items-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input type="search" placeholder="Search" className="pl-10 pr-5 py-[7px] rounded-full bg-[#F0F4FC] text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A7DE8] w-56 lg:w-72 border-0" />
          </div>

          {/* Bell */}
          <div className="relative" ref={notifRef}>
            <button aria-label="Notifications" onClick={() => { const nextOpen = !notifOpen; setNotifOpen(nextOpen); setProfileOpen(false); if (nextOpen) { void reload(); void markAllRead(); } }}
              className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${notifOpen ? 'bg-blue-100' : 'bg-[#EEF3FB] hover:bg-blue-100'}`}>
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-[#1A7DE8]" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                <div className="px-5 pt-5 pb-3"><h2 className="text-xl font-extrabold text-gray-900">Notification</h2></div>
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
                      No admin notifications yet.
                    </div>
                  ) : groups.map((group) => (
                    <div key={group.label} className="bg-[#EEF4FC] rounded-2xl px-4 py-3">
                      <p className="text-xs text-gray-400 font-medium mb-2">{group.label}</p>
                      <div className="flex flex-col gap-2">
                        {group.items.map((item) => (
                          <div key={item.id} className="bg-white rounded-2xl px-3 py-3 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#DBEAFE] flex items-center justify-center shrink-0"><ActivityIcon /></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-bold text-gray-900 leading-tight">{item.title}</p>
                              <p className="text-[12px] text-gray-500 leading-tight mt-0.5">{item.description}</p>
                            </div>
                            <span className="text-[11px] text-gray-400 shrink-0">{item.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button aria-label="Profile" onClick={() => { setProfileOpen((o) => !o); setNotifOpen(false); }}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors flex-shrink-0 overflow-hidden ${profileOpen ? 'bg-blue-100' : 'bg-[#EEF3FB] hover:bg-blue-100'}`}>
              {adminUser?.avatarUrl && !imgError ? (
                <img
                  src={getAvatarUrl(adminUser.avatarUrl)}
                  alt={adminUser.name || 'Profile'}
                  width={36}
                  height={36}
                  className="w-full h-full object-cover rounded-full"
                  onError={() => setImgError(true)}
                />
              ) : (
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-[#1A7DE8]" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              )}
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] z-50">
                <ProfilePopup onClose={() => setProfileOpen(false)} onLogout={() => setLogoutOpen(true)} user={adminUser} />
              </div>
            )}
          </div>
        </div>
      </header>

      <LogoutModal open={logoutOpen} onCancel={() => setLogoutOpen(false)} onConfirm={handleLogoutConfirm} userName={adminUser?.name} />
    </>
  );
}
