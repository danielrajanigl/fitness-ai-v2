import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export function Button({ 
  variant = "primary", 
  children, 
  className = "",
  ...props 
}: ButtonProps) {
  const baseStyles = "px-6 py-3 rounded-[10px] transition-all focus:outline-none focus:ring-2 focus:ring-[#4B75FF] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles = variant === "primary"
    ? "bg-[#4B75FF] text-white hover:bg-opacity-90"
    : "bg-transparent border-2 border-[#E4E7EB] text-[#6B7280] hover:border-[#4B75FF]";

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

