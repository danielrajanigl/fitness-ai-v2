import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  const inputClasses = `w-full px-4 py-3 rounded-[12px] border bg-white border-[#E5E7EB] text-[#1D1F21] focus:outline-none focus:ring-2 focus:ring-[#4B75FF] focus:border-[#4B75FF] placeholder:text-[#9CA3AF] disabled:bg-[#F9FAFB] disabled:cursor-not-allowed ${error ? 'border-[#F59E0B]' : ''} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2" style={{ fontSize: '14px', fontWeight: 500, color: '#1D1F21' }}>
          {label}
        </label>
      )}
      <input
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="mt-1" style={{ fontSize: '14px', color: '#F59E0B' }}>{error}</p>
      )}
    </div>
  );
}

