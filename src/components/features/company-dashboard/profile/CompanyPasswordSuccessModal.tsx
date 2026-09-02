'use client';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CompanyPasswordSuccessModal({ open, onClose }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 px-8 py-10 flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Close" className="absolute -top-4 -right-4 w-9 h-9 bg-white rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 shadow-sm text-sm font-bold">✕</button>
        <div className="w-16 h-16 rounded-full bg-[#34D399] flex items-center justify-center mb-5">
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="text-lg font-extrabold text-gray-900 text-center">Password Changed Successfully</h2>
      </div>
    </div>
  );
}
