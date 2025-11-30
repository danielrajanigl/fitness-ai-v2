"use client";

import React from "react";
import { tokens } from "../tokens/design-tokens";

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'onClick'> {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean; // Default: false - enables press animation for clickable cards
  onClick?: () => void; // Optional for interactive cards
}

export function Card({ 
  children, 
  className = "", 
  interactive = false,
  onClick,
  ...props 
}: CardProps) {
  // Handle press interaction for iOS-style scale (only for interactive cards)
  const [isPressed, setIsPressed] = React.useState(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (interactive && !props.disabled && onClick) {
      setIsPressed(true);
    }
    props.onMouseDown?.(e);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsPressed(false);
    props.onMouseUp?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsPressed(false);
    props.onMouseLeave?.(e);
  };

  // Base classes (no hardcoded values)
  const baseClasses = [
    "transition-all",
    interactive && onClick ? "cursor-pointer" : "",
  ].filter(Boolean).join(" ");

  // Combined styles using CSS variables and token values
  const combinedStyle: React.CSSProperties = {
    backgroundColor: tokens.colors.surface,
    border: `1px solid ${tokens.colors.stroke}`,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.component,
    boxShadow: tokens.shadows.sm,
    transition: `all ${tokens.transitions.normal} ${tokens.transitions.easing}`,
    WebkitTapHighlightColor: "transparent",
    transform: interactive && isPressed ? `scale(${tokens.press.scale})` : "scale(1)",
  };

  return (
    <div
      className={`${baseClasses} ${className}`}
      style={combinedStyle}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onFocus={(e) => {
        if (interactive) {
          e.currentTarget.style.boxShadow = `0 0 0 2px ${tokens.colors.primary}40`;
        }
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        if (interactive) {
          e.currentTarget.style.boxShadow = tokens.shadows.sm;
        }
        props.onBlur?.(e);
      }}
      onMouseEnter={(e) => {
        if (interactive && onClick) {
          e.currentTarget.style.boxShadow = tokens.shadows.md;
        }
        props.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        handleMouseLeave(e);
        if (interactive && onClick) {
          e.currentTarget.style.boxShadow = tokens.shadows.sm;
        }
        props.onMouseLeave?.(e);
      }}
      {...props}
    >
      {children}
    </div>
  );
}
