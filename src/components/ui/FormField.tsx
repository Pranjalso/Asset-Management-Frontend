'use client';

import React from 'react';

export interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string | null;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

export function FormField({ label, htmlFor, error, children, required, className = '' }: FormFieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="block text-[13px] font-medium text-gray-700 mb-2"
      >
        {label}
        {required ? <span className="ml-0.5 text-red-500">*</span> : null}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>
      ) : null}
    </div>
  );
}

interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
}

export function TextInput({ value, onChange, error, className = '', id, ...rest }: TextInputProps) {
  const base =
    'w-full px-4 py-3 rounded-full bg-[#DBEAFE] border-0 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A7DE8] transition-shadow';
  const err = error ? '!ring-2 !ring-red-400 !bg-[#FEE2E2]' : '';
  return (
    <input
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${base} ${err} ${className}`}
      {...rest}
    />
  );
}

interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
}

export function TextArea({ value, onChange, error, className = '', id, ...rest }: TextAreaProps) {
  const base =
    'w-full px-4 py-3 rounded-2xl bg-[#DBEAFE] border-0 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A7DE8] transition-shadow resize-none';
  const err = error ? '!ring-2 !ring-red-400 !bg-[#FEE2E2]' : '';
  return (
    <textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${base} ${err} ${className}`}
      {...rest}
    />
  );
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  options: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
}

export function SelectField({
  value,
  onChange,
  error,
  options,
  placeholder = 'Select an option',
  className = '',
  id,
  disabled,
  ...rest
}: SelectProps) {
  const base =
    'w-full px-4 py-3 rounded-full bg-[#DBEAFE] border-0 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A7DE8] transition-shadow appearance-none pr-10';
  const err = error ? '!ring-2 !ring-red-400 !bg-[#FEE2E2]' : '';
  const disabledClass = disabled ? 'opacity-60 cursor-not-allowed' : '';
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`${base} ${err} ${disabledClass} ${className}`}
        {...rest}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}
