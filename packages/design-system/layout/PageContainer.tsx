"use client";

import React from "react";
import { tokens } from "../tokens/design-tokens";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  noNav?: boolean; // If true, removes navigation padding
  className?: string;
}

/**
 * PageContainer - Global layout helper component
 * 
 * Automatically adds padding to prevent content from hiding under fixed navigation:
 * - Desktop: padding-top = navHeight (64px)
 * - Mobile: padding-bottom = navHeight (96px)
 * 
 * Usage:
 *   <PageContainer>
 *     <main>Your page content</main>
 *   </PageContainer>
 * 
 * For pages without navigation:
 *   <PageContainer noNav>
 *     <main>Your page content</main>
 *   </PageContainer>
 */
export function PageContainer({ 
  children, 
  noNav = false,
  className = "",
  ...props 
}: PageContainerProps) {
  // Use tokens for navigation padding
  // Desktop: padding-top = navHeight (64px) for top nav
  // Mobile: padding-bottom = navHeight (96px) for bottom nav
  const containerStyle: React.CSSProperties = noNav ? {} : {
    // Mobile: bottom padding only
    paddingBottom: tokens.layout.nav.mobileHeight,
    // Desktop: top padding only (via media query in className)
    // We use Tailwind's md: breakpoint for desktop
  };

  const baseClasses = [
    "w-full",
    // Desktop: apply top padding, remove bottom padding
    noNav ? "" : "md:pt-16 md:pb-0",
  ].filter(Boolean).join(" ");

  return (
    <div
      className={`${baseClasses} ${className}`}
      style={containerStyle}
      {...props}
    >
      {children}
    </div>
  );
}

