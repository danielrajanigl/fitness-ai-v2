"use client";

import React, { useState } from "react";
import { tokens } from "../tokens/design-tokens";
import { X } from "lucide-react";

interface AlertProps {
  variant?: "error" | "warning" | "success" | "info";
  title?: string;
  children: React.ReactNode;
  className?: string;
  dismissable?: boolean;
  onDismiss?: () => void;
}

/**
 * Alert - Design System Component
 * 
 * Displays alert messages with different variants, optional title, and dismiss functionality.
 * Uses design tokens for all styling values with smooth iOS-like animations.
 * 
 * Usage:
 *   <Alert variant="error" title="Error">Error message</Alert>
 *   <Alert variant="success" dismissable>Success message</Alert>
 *   <Alert variant="warning" title="Warning" dismissable onDismiss={handleDismiss}>
 *     Warning description
 *   </Alert>
 */
export function Alert({ 
  variant = "error",
  title,
  children,
  className = "",
  dismissable = false,
  onDismiss
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissing, setIsDismissing] = useState(false);

  const handleDismiss = () => {
    setIsDismissing(true);
    // Wait for animation to complete before hiding
    setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, 200); // Match transition duration
  };

  if (!isVisible) {
    return null;
  }

  // Variant color mapping using tokens
  const variantConfig: Record<AlertProps["variant"], {
    backgroundColor: string;
    borderColor: string;
    textColor: string;
    iconColor: string;
  }> = {
    error: {
      backgroundColor: `rgba(245, 158, 11, 0.1)`, // accentWarm with opacity
      borderColor: tokens.colors.accentWarm,
      textColor: tokens.colors.accentWarm,
      iconColor: tokens.colors.accentWarm,
    },
    warning: {
      backgroundColor: `rgba(245, 158, 11, 0.1)`, // accentWarm with opacity
      borderColor: tokens.colors.accentWarm,
      textColor: tokens.colors.accentWarm,
      iconColor: tokens.colors.accentWarm,
    },
    success: {
      backgroundColor: `rgba(139, 198, 168, 0.1)`, // accentSuccess with opacity
      borderColor: tokens.colors.accentSuccess,
      textColor: tokens.colors.accentSuccess,
      iconColor: tokens.colors.accentSuccess,
    },
    info: {
      backgroundColor: `rgba(75, 117, 255, 0.1)`, // primary with opacity
      borderColor: tokens.colors.primary,
      textColor: tokens.colors.primary,
      iconColor: tokens.colors.primary,
    },
  };

  const config = variantConfig[variant];

  // Alert container style with smooth animation
  const alertStyle: React.CSSProperties = {
    backgroundColor: config.backgroundColor,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: config.borderColor,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.component,
    fontFamily: tokens.font.family,
    transition: `all ${tokens.transitions.normal} ${tokens.transitions.easing}`,
    opacity: isDismissing ? 0 : 1,
    transform: isDismissing ? "translateY(-8px)" : "translateY(0)",
    position: "relative",
  };

  // Title style
  const titleStyle: React.CSSProperties = {
    fontSize: tokens.font.size.sm,
    fontWeight: tokens.font.weight.semibold,
    color: config.textColor,
    marginBottom: title && children ? tokens.spacing.sm : 0,
    lineHeight: tokens.font.lineHeight.normal,
  };

  // Content style
  const contentStyle: React.CSSProperties = {
    fontSize: tokens.font.size.sm,
    fontWeight: tokens.font.weight.regular,
    color: config.textColor,
    lineHeight: tokens.font.lineHeight.normal,
  };

  // Dismiss button style
  const dismissButtonStyle: React.CSSProperties = {
    position: "absolute",
    top: tokens.spacing.sm,
    right: tokens.spacing.sm,
    padding: tokens.spacing.xs,
    borderRadius: tokens.radius.sm,
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    color: config.iconColor,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: `all ${tokens.transitions.fast} ${tokens.transitions.easing}`,
    opacity: 0.7,
  };

  return (
    <div 
      className={className}
      style={alertStyle}
    >
      {dismissable && (
        <button
          type="button"
          onClick={handleDismiss}
          style={dismissButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.backgroundColor = config.backgroundColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "0.7";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          aria-label="Dismiss alert"
        >
          <X size={16} strokeWidth={2} />
        </button>
      )}
      
      {title && (
        <div style={titleStyle}>
          {title}
        </div>
      )}
      
      <div style={contentStyle}>
        {children}
      </div>
    </div>
  );
}
