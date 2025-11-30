"use client";

import React from "react";
import { tokens } from "../tokens/design-tokens";

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  className?: string;
  showLabel?: boolean;
  label?: string; // Custom label text (default: "Progress")
}

/**
 * ProgressBar - Design System Component
 * 
 * Displays a progress indicator with optional label.
 * Uses design tokens for all styling values.
 * 
 * Usage:
 *   <ProgressBar value={75} showLabel />
 *   <ProgressBar value={50} max={200} label="Loading..." />
 */
export function ProgressBar({ 
  value, 
  max = 100, 
  className = "",
  showLabel = false,
  label = "Progress"
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  // Track container style using tokens
  const trackStyle: React.CSSProperties = {
    width: "100%",
    height: "8px", // h-2 = 0.5rem = 8px
    backgroundColor: tokens.colors.stroke,
    borderRadius: tokens.radius.full,
    overflow: "hidden",
  };

  // Progress fill style using tokens
  const fillStyle: React.CSSProperties = {
    height: "100%",
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.radius.full,
    transition: `all ${tokens.transitions.slow} ${tokens.transitions.easing}`,
    width: `${percentage}%`,
  };

  // Label style using tokens
  const labelStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: tokens.spacing.sm,
    fontSize: tokens.font.size.sm,
    color: tokens.colors.textMuted,
    fontFamily: tokens.font.family,
    fontWeight: tokens.font.weight.regular,
    lineHeight: tokens.font.lineHeight.normal,
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div style={labelStyle}>
          <span>{label}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div style={trackStyle}>
        <div style={fillStyle} />
      </div>
    </div>
  );
}




