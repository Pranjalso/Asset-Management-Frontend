'use client';

interface LogoutModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  userName?: string;
}

export default function LogoutModal({ open, onCancel, onConfirm, userName }: LogoutModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] animate-in fade-in" onClick={onCancel}>
      <div className="relative bg-white rounded-2xl shadow-xl px-10 py-8 w-[340px] flex flex-col items-center animate-in zoom-in-95 fade-in-0 duration-150" onClick={(e) => e.stopPropagation()}>
        <button onClick={onCancel} aria-label="Close" className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100 transition-colors text-sm">
          ✕
        </button>
        <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-5">
          <svg viewBox="0 0 24 24" className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-1 text-center">
          Do you want to Logout?
        </h2>
        {userName && (
          <p className="text-sm text-gray-500 mb-6 text-center">
            You are currently signed in as{' '}
            <span className="font-semibold text-gray-700">{userName}</span>
          </p>
        )}
        {!userName && <div className="mb-6" />}
        <div className="flex items-center gap-3 w-full justify-center">
          <button onClick={onCancel} className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-800 text-sm font-semibold bg-white hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-6 py-2.5 rounded-full bg-[#1A7DE8] hover:bg-[#1669C9] text-white text-sm font-semibold transition-colors shadow-sm">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

