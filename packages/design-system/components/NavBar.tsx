"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Calendar, 
  Apple, 
  BarChart3, 
  User, 
  Settings, 
  Bot,
  Dumbbell,
  Menu
} from "lucide-react";
import { tokens } from "../tokens/design-tokens";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  mobileLabel: string;
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: Home, mobileLabel: "Home" },
  { name: "AI Coach", href: "/coach", icon: Bot, mobileLabel: "Coach" },
  { name: "Workouts", href: "/workouts", icon: Dumbbell, mobileLabel: "Workouts" },
  { name: "Schedule", href: "/schedule", icon: Calendar, mobileLabel: "Schedule" },
  { name: "Nutrition", href: "/nutrition", icon: Apple, mobileLabel: "Nutrition" },
  { name: "Progress", href: "/progress", icon: BarChart3, mobileLabel: "Progress" },
];

const moreItems: NavItem[] = [
  { name: "History", href: "/history", icon: BarChart3, mobileLabel: "History" },
  { name: "Profile", href: "/profile", icon: User, mobileLabel: "Profile" },
  { name: "Settings", href: "/settings", icon: Settings, mobileLabel: "Settings" },
];

export function NavBar() {
  const pathname = usePathname();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Memoize active state computation
  const isActive = useMemo(() => {
    return (href: string) => pathname === href;
  }, [pathname]);

  // Memoize click handler for More menu
  const handleMoreMenuToggle = useCallback(() => {
    setShowMoreMenu((prev) => !prev);
  }, []);

  // Memoize click handler for closing More menu
  const handleMoreMenuClose = useCallback(() => {
    setShowMoreMenu(false);
  }, []);

  // Base classes for navigation items (layout only, styling via tokens)
  const desktopNavBaseClasses = "flex items-center gap-2 px-4 py-2 transition-all";
  const mobileNavBaseClasses = "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all";
  const moreMenuBaseClasses = "flex items-center gap-3 px-4 py-2 transition-all";

  // Blur and background styles using tokens
  const navBackgroundStyle: React.CSSProperties = {
    backgroundColor: `rgba(255, 255, 255, ${tokens.opacity.surface})`,
    backdropFilter: `blur(${tokens.effects.blur.md})`,
    WebkitBackdropFilter: `blur(${tokens.effects.blur.md})`,
    borderColor: tokens.colors.stroke,
    transition: `all ${tokens.transitions.normal} ${tokens.transitions.easing}`,
  };

  const moreMenuBackgroundStyle: React.CSSProperties = {
    backgroundColor: `rgba(255, 255, 255, ${tokens.opacity.surfaceStrong})`,
    backdropFilter: `blur(${tokens.effects.blur.md})`,
    WebkitBackdropFilter: `blur(${tokens.effects.blur.md})`,
    borderColor: tokens.colors.stroke,
    boxShadow: tokens.shadows.md,
    fontFamily: tokens.font.family,
    borderRadius: tokens.radius.lg,
  };

  return (
    <>
      {/* Desktop Navigation - Horizontal with Blurred Background */}
      <nav 
        className="hidden md:block fixed top-0 left-0 right-0 z-50 border-b"
        style={navBackgroundStyle}
      >
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <Link 
              href="/dashboard" 
              className="transition-colors"
              style={{ 
                color: tokens.colors.textMain,
                fontFamily: tokens.font.family,
                fontSize: tokens.font.size.xl,
                fontWeight: tokens.font.weight.semibold,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = tokens.colors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = tokens.colors.textMain;
              }}
            >
              Flow
            </Link>
            
            {/* Main Navigation */}
            <div className="flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={desktopNavBaseClasses}
                    style={{
                      backgroundColor: active ? tokens.colors.primary : "transparent",
                      color: active ? tokens.colors.white : tokens.colors.textMuted,
                      fontWeight: active ? tokens.font.weight.semibold : tokens.font.weight.medium,
                      fontFamily: tokens.font.family,
                      fontSize: tokens.font.size.sm,
                      borderRadius: tokens.radius.sm,
                      transition: `all ${tokens.transitions.normal} ${tokens.transitions.easing}`,
                    }}
                    aria-current={active ? "page" : undefined}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.color = tokens.colors.textMain;
                        e.currentTarget.style.backgroundColor = tokens.colors.surfaceAlt;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.color = tokens.colors.textMuted;
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.boxShadow = `0 0 0 2px ${tokens.colors.primary}40`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.boxShadow = "";
                    }}
                  >
                    <Icon 
                      size={18} 
                      strokeWidth={active ? 2 : 1.5}
                      style={{
                        transition: `all ${tokens.transitions.normal} ${tokens.transitions.easing}`,
                      }}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
            
            {/* More Menu */}
            <div className="relative">
              <button
                onClick={handleMoreMenuToggle}
                className="p-2 transition-all"
                style={{
                  color: tokens.colors.textMuted,
                  fontFamily: tokens.font.family,
                  borderRadius: tokens.radius.sm,
                  transition: `all ${tokens.transitions.normal} ${tokens.transitions.easing}`,
                }}
                aria-label="More navigation options"
                aria-expanded={showMoreMenu}
                aria-haspopup="true"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = tokens.colors.surfaceAlt;
                  e.currentTarget.style.color = tokens.colors.textMain;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = tokens.colors.textMuted;
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 0 2px ${tokens.colors.primary}40`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                <Menu size={20} strokeWidth={1.5} />
              </button>
              
              {showMoreMenu && (
                <div 
                  className="absolute right-0 top-full mt-2 w-48 border py-2 z-50"
                  style={moreMenuBackgroundStyle}
                >
                  {moreItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={handleMoreMenuClose}
                        className={moreMenuBaseClasses}
                        style={{
                          backgroundColor: active ? tokens.colors.surfaceAlt : "transparent",
                          color: active ? tokens.colors.textMain : tokens.colors.textMuted,
                          fontWeight: active ? tokens.font.weight.semibold : tokens.font.weight.regular,
                          fontSize: tokens.font.size.sm,
                          transition: `all ${tokens.transitions.normal} ${tokens.transitions.easing}`,
                        }}
                        aria-current={active ? "page" : undefined}
                        onMouseEnter={(e) => {
                          if (!active) {
                            e.currentTarget.style.backgroundColor = tokens.colors.surfaceAlt;
                            e.currentTarget.style.color = tokens.colors.textMain;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!active) {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.color = tokens.colors.textMuted;
                          }
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.boxShadow = `0 0 0 2px ${tokens.colors.primary}40`;
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.boxShadow = "";
                        }}
                      >
                        <Icon 
                          size={18} 
                          strokeWidth={active ? 2 : 1.5}
                          style={{
                            transition: `all ${tokens.transitions.normal} ${tokens.transitions.easing}`,
                          }}
                        />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Bottom Bar with Blurred Background */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t"
        style={navBackgroundStyle}
      >
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={mobileNavBaseClasses}
                style={{
                  color: active ? tokens.colors.primary : tokens.colors.textMuted,
                  fontFamily: tokens.font.family,
                  borderRadius: tokens.radius.sm,
                  transition: `all ${tokens.transitions.normal} ${tokens.transitions.easing}`,
                }}
                aria-current={active ? "page" : undefined}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = tokens.colors.textMain;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = tokens.colors.textMuted;
                  }
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 0 2px ${tokens.colors.primary}40`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                <Icon 
                  size={20} 
                  strokeWidth={active ? 2.5 : 1.5}
                  style={{
                    transition: `all ${tokens.transitions.normal} ${tokens.transitions.easing}`,
                  }}
                />
                <span 
                  style={{
                    fontWeight: active ? tokens.font.weight.semibold : tokens.font.weight.regular,
                    fontSize: tokens.font.size.xs,
                    transition: `all ${tokens.transitions.normal} ${tokens.transitions.easing}`,
                  }}
                >
                  {item.mobileLabel}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
