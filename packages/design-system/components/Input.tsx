"use client";

import React from "react";
import { tokens } from "../tokens/design-tokens";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label?: string;
  error?: string;
  className?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // iOS-like focus ring with smooth animation
    e.currentTarget.style.boxShadow = `0 0 0 2px ${tokens.colors.primary}40`;
    e.currentTarget.style.borderColor = tokens.colors.primary;
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.boxShadow = "";
    e.currentTarget.style.borderColor = error ? tokens.colors.accentWarm : tokens.colors.stroke;
    props.onBlur?.(e);
  };

  // Base classes (no hardcoded values)
  const baseClasses = [
    "w-full",
    "outline-none",
    "transition-all",
    props.disabled ? "opacity-50 cursor-not-allowed" : "cursor-text",
  ].join(" ");

  // Combined styles using CSS variables and token values
  const inputStyle: React.CSSProperties = {
    paddingLeft: tokens.spacing.lg,
    paddingRight: tokens.spacing.lg,
    paddingTop: tokens.spacing.md,
    paddingBottom: tokens.spacing.md,
    borderRadius: tokens.radius.lg,
    border: `1px solid ${error ? tokens.colors.accentWarm : tokens.colors.stroke}`,
    backgroundColor: props.disabled ? tokens.colors.surfaceAlt : tokens.colors.white,
    color: tokens.colors.textMain,
    fontFamily: tokens.font.family,
    fontSize: tokens.font.size.base,
    fontWeight: tokens.font.weight.regular,
    lineHeight: tokens.font.lineHeight.normal,
    transition: `all ${tokens.transitions.normal} ${tokens.transitions.easing}`,
    WebkitTapHighlightColor: "transparent",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: tokens.font.size.sm,
    fontWeight: tokens.font.weight.medium,
    color: tokens.colors.textMain,
    marginBottom: tokens.spacing.sm,
    display: "block",
  };

  const errorStyle: React.CSSProperties = {
    fontSize: tokens.font.size.sm,
    color: tokens.colors.accentWarm,
    marginTop: tokens.spacing.xs,
  };

  return (
    <div className="w-full">
      {label && (
        <label style={labelStyle}>
          {label}
        </label>
      )}
      <input
        className={baseClasses}
        style={inputStyle}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      {error && (
        <p style={errorStyle}>{error}</p>
      )}
    </div>
  );
}
