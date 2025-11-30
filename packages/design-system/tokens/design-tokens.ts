/**
 * Design Tokens - Maps CSS Variables to TypeScript
 * 
 * This file serves as the single source of truth for design tokens.
 * All values reference CSS variables defined in apps/web/app/globals.css
 * 
 * Usage:
 *   import { tokens } from '@repo/design-system/tokens/design-tokens';
 *   <button style={{ backgroundColor: tokens.colors.primary }}>
 */

export const tokens = {
  colors: {
    // Primary
    primary: "var(--color-primary)",
    primaryLight: "var(--color-primary-light)",
    
    // Background
    background: "var(--color-background)",
    surface: "var(--color-surface)",
    surfaceAlt: "var(--color-surface-alt)",
    
    // Text
    textMain: "var(--color-text-main)",
    textMuted: "var(--color-text-muted)",
    textLight: "var(--color-text-light)",
    
    // Borders & Strokes
    stroke: "var(--color-stroke)",
    strokeLight: "var(--color-stroke-light)",
    
    // Accents
    accentSuccess: "var(--color-accent-success)",
    accentWarm: "var(--color-accent-warm)",
    
    // Semantic (for buttons, etc.)
    white: "#FFFFFF",
    black: "#000000",
  },
  
  radius: {
    sm: "var(--radius-sm)", // 8px
    md: "var(--radius-md)", // 10px
    lg: "var(--radius-lg)", // 12px
    full: "9999px",
  },
  
  spacing: {
    // Based on existing spacing system
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    "2xl": "32px",
    "3xl": "48px",
    section: "var(--spacing-section)",
    component: "var(--spacing-component)",
    card: "var(--spacing-card)",
  },
  
  font: {
    family: "var(--font-family)",
    size: {
      xs: "12px",
      sm: "14px",
      base: "16px",
      lg: "18px",
      xl: "22px",
      "2xl": "32px",
      "3xl": "56px",
    },
    weight: {
      regular: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
    lineHeight: {
      tight: "1.2",
      normal: "1.3",
      relaxed: "1.4",
      loose: "1.5",
    },
  },
  
  shadows: {
    sm: "var(--shadow-sm)",
    md: "var(--shadow-md)",
    lg: "var(--shadow-lg)",
  },
  
  transitions: {
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
  
  // iOS-style press interaction
  press: {
    scale: "0.98",
  },
  
  // Effects
  effects: {
    blur: {
      sm: "8px",
      md: "20px",
      lg: "40px",
    },
  },
  
  // Opacity
  opacity: {
    surface: "0.85",
    surfaceStrong: "0.95",
    overlay: "0.5",
  },
  
  // Layout
  layout: {
    nav: {
      desktopHeight: "64px", // h-16 = 4rem = 64px
      mobileHeight: "96px", // pb-24 = 6rem = 96px (for bottom nav)
    },
  },
} as const;

// Type exports for better TypeScript support
export type DesignTokens = typeof tokens;

