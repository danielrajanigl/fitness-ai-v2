"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Calendar, 
  Apple, 
  BarChart3, 
  User, 
  Settings, 
  Wrench,
  MessageSquare,
  Bot,
  Dumbbell,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";

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

export function Navigation() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  const [showMoreMenu, setShowMoreMenu] = useState(false);

  return (
    <>
      {/* Desktop Navigation - Horizontal */}
      <nav className="hidden md:block bg-white border-b border-[#E5E7EB]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <Link href="/dashboard" className="text-xl font-semibold text-[#1F2937]">
              Flow
            </Link>
            
            {/* Main Navigation */}
            <div className="flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-[8px] text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-[#4B75FF] text-white"
                        : "text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F9FAFB]"
                    )}
                  >
                    <Icon size={18} strokeWidth={1.5} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
            
            {/* More Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-2 rounded-[8px] text-[#6B7280] hover:bg-[#F9FAFB] transition-colors"
              >
                <Menu size={20} strokeWidth={1.5} />
              </button>
              
              {showMoreMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-[12px] shadow-lg border border-[#E5E7EB] py-2 z-50">
                  {moreItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setShowMoreMenu(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2 text-sm transition-colors",
                          isActive(item.href)
                            ? "bg-[#F9FAFB] text-[#1F2937]"
                            : "text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#1F2937]"
                        )}
                      >
                        <Icon size={18} strokeWidth={1.5} />
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

      {/* Mobile Navigation - Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] z-50">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 h-full rounded-t-[8px] transition-colors",
                  isActive(item.href)
                    ? "text-[#4B75FF]"
                    : "text-[#6B7280]"
                )}
              >
                <Icon size={20} strokeWidth={1.5} />
                <span className="text-xs">{item.mobileLabel}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

