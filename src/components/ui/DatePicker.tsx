'use client';

import React from 'react';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string | null;
  id?: string;
  disabled?: boolean;
  max?: string;
  min?: string;
  className?: string;
}

export default function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  error,
  id,
  disabled,
  max,
  min,
  className = '',
}: DatePickerProps) {
  const baseClass =
    'w-full px-4 py-3 rounded-full bg-[#DBEAFE] border-0 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A7DE8] transition-shadow appearance-none';
  const errorClass = error ? '!ring-2 !ring-red-400 !bg-[#FEE2E2]' : '';
  const disabledClass = disabled ? 'opacity-60 cursor-not-allowed' : '';
  return (
    <div className={`${className}`}>
      <input
        id={id}
        type="date"
        value={value || ''}
        max={max}
        min={min}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`${baseClass} ${errorClass} ${disabledClass}`}
      />
      {error ? (
        <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>
      ) : null}
    </div>
  );
}
