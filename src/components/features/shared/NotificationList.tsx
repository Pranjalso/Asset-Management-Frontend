'use client';

import type { NotificationGroup } from '@/src/types';

const ActivityIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#1A7DE8]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" />
  </svg>
);

interface NotificationListProps {
  groups?: NotificationGroup[];
  loading?: boolean;
  error?: string | null;
  title?: string;
  emptyMessage?: string;
}

export default function NotificationList({
  groups = [],
  loading = false,
  error = null,
  title = 'Notification',
  emptyMessage = 'No notifications yet.',
}: NotificationListProps) {
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-[26px] font-extrabold text-gray-900 mb-5 shrink-0">{title}</h1>
      {error ? (
        <div className="px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-sm text-red-700">
          {error}
        </div>
      ) : loading ? (
        <div className="px-4 py-8 rounded-2xl bg-[#EEF4FC] text-sm text-gray-500">
          Loading notifications...
        </div>
      ) : groups.length === 0 ? (
        <div className="px-4 py-8 rounded-2xl bg-[#EEF4FC] text-sm text-gray-500">
          {emptyMessage}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-5">
          {groups.map((group) => (
            <div key={group.label} className="bg-[#EEF4FC] rounded-2xl px-5 py-4">
              <p className="text-sm text-gray-400 font-medium mb-3">{group.label}</p>
              <div className="flex flex-col gap-3">
                {group.items.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-4 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-[#DBEAFE] flex items-center justify-center shrink-0"><ActivityIcon /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 leading-tight">{item.title}</p>
                      <p className="text-sm text-gray-500 leading-tight mt-0.5">{item.description}</p>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
