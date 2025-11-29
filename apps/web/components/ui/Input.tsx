import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#1D1F21] mb-2">
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full px-4 py-3 rounded-[12px] border",
          "bg-white border-[#E5E7EB] text-[#1F2937]",
          "focus:outline-none focus:ring-2 focus:ring-[#4B75FF] focus:border-[#4B75FF]",
          "placeholder:text-[#9CA3AF]",
          "disabled:bg-[#F9FAFB] disabled:cursor-not-allowed",
          error && "border-[#F59E0B]",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-[#F59E0B]">{error}</p>
      )}
    </div>
  );
}

