import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`bg-[#FAFBFC] border border-[#E4E7EB] rounded-[10px] p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}
      {...props}
    >
      {children}
    </div>
  );
}

