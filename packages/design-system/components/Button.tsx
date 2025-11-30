"use client";

import React from "react";
import { tokens } from "../tokens/design-tokens";

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  className?: string;
}

export function Button({ 
  variant = "primary", 
  children, 
  className = "",
  ...props 
}: ButtonProps) {
  // Handle press interaction for iOS-style scale
  const [isPressed, setIsPressed] = React.useState(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!props.disabled) {
      setIsPressed(true);
      props.onMouseDown?.(e);
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsPressed(false);
    props.onMouseUp?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsPressed(false);
    props.onMouseLeave?.(e);
  };

  // Build className using CSS variables (from tokens)
  const baseClasses = [
    "inline-flex items-center justify-center",
    "outline-none",
    "transition-all",
    props.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
  ].join(" ");

  const variantClasses = variant === "primary"
    ? "bg-[var(--color-primary)] text-white hover:opacity-90"
    : "bg-transparent border-2 border-[var(--color-stroke)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)]";

  // Combined styles using CSS variables and token values
  const combinedStyle: React.CSSProperties = {
    paddingLeft: tokens.spacing.xl,
    paddingRight: tokens.spacing.xl,
    paddingTop: tokens.spacing.md,
    paddingBottom: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    fontFamily: tokens.font.family,
    fontSize: tokens.font.size.sm,
    fontWeight: tokens.font.weight.medium,
    lineHeight: tokens.font.lineHeight.normal,
    transition: `all ${tokens.transitions.normal} ${tokens.transitions.easing}`,
    WebkitTapHighlightColor: "transparent",
    transform: isPressed ? `scale(${tokens.press.scale})` : "scale(1)",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      style={combinedStyle}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0 2px ${tokens.colors.primary}40`;
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = "";
        props.onBlur?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

