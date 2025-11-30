"use client";

import React, { useState } from "react";
import { tokens } from "../tokens/design-tokens";

interface BadgeProps {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "inactive";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  interactive?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Badge - Design System Component
 * 
 * Displays a small status indicator or label with optional icon.
 * Uses design tokens for all styling values with smooth interactions.
 * 
 * Usage:
 *   <Badge variant="success">Active</Badge>
 *   <Badge variant="warning" size="sm" icon={<Icon />}>Warning</Badge>
 *   <Badge variant="danger" interactive onClick={handleClick}>Click me</Badge>
 */
export function Badge({
  variant = "default",
  size = "md",
  icon,
  interactive = false,
  children,
  className = "",
  onClick,
}: BadgeProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => {
    if (interactive && onClick) {
      setIsPressed(true);
    }
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
  };

  // Variant color mapping using tokens
  const variantConfig: Record<BadgeProps["variant"], {
    backgroundColor: string;
    textColor: string;
  }> = {
    default: {
      backgroundColor: tokens.colors.surfaceAlt,
      textColor: tokens.colors.textMain,
    },
    success: {
      backgroundColor: `rgba(139, 198, 168, 0.15)`, // accentSuccess with opacity
      textColor: tokens.colors.accentSuccess,
    },
    warning: {
      backgroundColor: `rgba(245, 158, 11, 0.15)`, // accentWarm with opacity
      textColor: tokens.colors.accentWarm,
    },
    danger: {
      backgroundColor: `rgba(245, 158, 11, 0.15)`, // accentWarm with opacity (using warm for danger)
      textColor: tokens.colors.accentWarm,
    },
    info: {
      backgroundColor: `rgba(75, 117, 255, 0.15)`, // primary with opacity
      textColor: tokens.colors.primary,
    },
    inactive: {
      backgroundColor: tokens.colors.strokeLight,
      textColor: tokens.colors.textMuted,
    },
  };

  const config = variantConfig[variant];

  // Size-dependent spacing
  const sizeConfig: Record<BadgeProps["size"], {
    paddingX: string;
    paddingY: string;
    fontSize: string;
    iconSize: number;
    gap: string;
  }> = {
    sm: {
      paddingX: tokens.spacing.xs, // 4px
      paddingY: "2px",
      fontSize: tokens.font.size.xs, // 12px
      iconSize: 12,
      gap: tokens.spacing.xs,
    },
    md: {
      paddingX: tokens.spacing.sm, // 8px
      paddingY: "4px",
      fontSize: tokens.font.size.sm, // 14px
      iconSize: 14,
      gap: tokens.spacing.sm,
    },
    lg: {
      paddingX: tokens.spacing.md, // 12px
      paddingY: "6px",
      fontSize: tokens.font.size.base, // 16px
      iconSize: 16,
      gap: tokens.spacing.sm,
    },
  };

  const sizeStyle = sizeConfig[size];

  // Badge container style
  const badgeStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: sizeStyle.gap,
    backgroundColor: config.backgroundColor,
    color: config.textColor,
    borderRadius: tokens.radius.sm,
    paddingLeft: sizeStyle.paddingX,
    paddingRight: sizeStyle.paddingX,
    paddingTop: sizeStyle.paddingY,
    paddingBottom: sizeStyle.paddingY,
    fontSize: sizeStyle.fontSize,
    fontFamily: tokens.font.family,
    fontWeight: tokens.font.weight.medium,
    lineHeight: tokens.font.lineHeight.normal,
    transition: `all ${tokens.transitions.fast} ${tokens.transitions.easing}`,
    transform: interactive && isPressed ? "scale(0.97)" : "scale(1)",
    cursor: interactive && onClick ? "pointer" : "default",
    WebkitTapHighlightColor: "transparent",
    userSelect: "none",
  };

  // Icon wrapper style (if icon provided)
  const iconStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };

  const Component = interactive && onClick ? "button" : "span";

  return (
    <Component
      className={className}
      style={badgeStyle}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      type={interactive && onClick ? "button" : undefined}
      disabled={interactive && onClick ? false : undefined}
    >
      {icon && (
        <span style={iconStyle}>
          {React.isValidElement(icon)
            ? React.cloneElement(icon as React.ReactElement<any>, {
                size: sizeStyle.iconSize,
              })
            : icon}
        </span>
      )}
      <span>{children}</span>
    </Component>
  );
}




