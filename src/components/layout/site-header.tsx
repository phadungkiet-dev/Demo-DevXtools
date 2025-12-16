"use client";

// =============================================================================
// Imports
// =============================================================================
import { useEffect, useState } from "react";
import Link from "next/link";
// UI Components
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle"; // ตรวจสอบ Path ให้ถูกต้อง
import { CommandMenu } from "@/components/layout/command-menu";
import { MobileNav } from "@/components/layout/mobile-nav";
// Store & Utils
import { useSidebarStore } from "@/store/use-sidebar-store";
import { cn } from "@/lib/utils";
// Icons
import { Github } from "lucide-react";

// =============================================================================
// Main Component
// =============================================================================
export function SiteHeader() {
  // --- State & Hooks ---
  const [isScrolled, setIsScrolled] = useState(false);
  const { isOpen } = useSidebarStore(); // ใช้เช็คสถานะ Sidebar เพื่อขยับ Header หลบ

  // --- Effect: Scroll Detection ---
  useEffect(() => {
    const handleScroll = () => {
      // Optimization: Update state only if value changes
      const scrolled = window.scrollY > 0;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    };

    // Passive listener improves scrolling performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        // 1. Positioning & Layout Core
        "fixed top-0 right-0 z-40 h-16 border-b px-4 md:px-6",
        "flex items-center justify-between gap-4",
        "transition-[left,background-color,backdrop-filter] duration-300 ease-in-out",

        // 2. Responsive Positioning (Key Logic)
        // Mobile: เต็มจอ (left-0)
        "left-0",
        // Desktop: ขยับจุดเริ่มต้น (left) ตามความกว้าง Sidebar
        isOpen ? "md:left-72" : "md:left-[72px]",

        // 3. Visual Style (Glassmorphism)
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-border/40 shadow-sm supports-[backdrop-filter]:bg-background/60"
          : "bg-transparent border-transparent"
      )}
    >
      {/* ================= LEFT SECTION ================= */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Mobile Navigation Trigger (Visible only on mobile) */}
        <div className="md:hidden shrink-0">
          <MobileNav />
        </div>

        {/* Search / Command Menu */}
        {/* max-w-md: จำกัดความกว้างไม่ให้ยาวเกินไปดูไม่สวย */}
        <div className="w-full max-w-sm md:max-w-md">
          <CommandMenu />
        </div>
      </div>

      {/* ================= RIGHT SECTION ================= */}
      <div className="flex items-center gap-2 shrink-0">
        {/* GitHub Link */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-full hidden sm:flex hover:bg-muted/60 transition-colors"
          asChild
        >
          <Link
            href="https://github.com/phadungkiet-dev/demo-devxtools"
            target="_blank"
            rel="noreferrer"
            title="View on GitHub"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}
