'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/src/constants/routes';

const REASONS = [
  'Unauthorized Access Attempts', 'Violation of Data or Usage Policy',
  'Inactivity Over Time', 'Misuse of System or Asset Data',
  'No Longer Part of Active Projects/Teams', 'Security Review or Internal Investigation',
  'Duplicate or Fake Account Detected',
];

interface Props { onBlock?: (reason: string) => Promise<void> | void; }

export default function ReasonForBlocking({ onBlock }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleBlock = async () => {
    if (!selected) return;
    try { setLoading(true); await onBlock?.(selected); router.push(ROUTES.COMPANY_USER_BLOCKED); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-8 shrink-0">
        <button type="button" onClick={() => router.back()} className="text-gray-900 hover:text-gray-600 transition-colors">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Reason For blocking</h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-3 max-w-lg">
          {REASONS.map((reason) => {
            const isSelected = selected === reason;
            return (
              <button key={reason} type="button" onClick={() => setSelected(reason)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-left transition-colors w-full ${isSelected ? 'bg-[#BFDBFE] border border-[#1A7DE8]' : 'bg-[#DBEAFE] border border-transparent hover:bg-[#BFDBFE]'}`}>
                <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-[#1A7DE8]' : 'border-gray-400'}`}>
                  {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-[#1A7DE8]" />}
                </span>
                <span className="text-gray-800">{reason}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex justify-end pt-6 shrink-0">
        <button type="button" onClick={handleBlock} disabled={!selected || loading}
          className="px-10 py-3 rounded-xl bg-[#1A7DE8] hover:bg-[#1669C9] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors">
          {loading ? 'Blocking…' : 'Block'}
        </button>
      </div>
    </div>
  );
}
