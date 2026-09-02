'use client';

import { useRouter } from 'next/navigation';

interface BackButtonProps {
  onClick?: () => void;
}

export default function BackButton({ onClick }: BackButtonProps) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={onClick ?? (() => router.back())}
      aria-label="Go back"
      className="text-gray-900 hover:text-gray-600 transition-colors"
    >
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>
  );
}
