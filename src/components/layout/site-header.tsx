"use client";

// =============================================================================
// Imports
// =============================================================================
import { useEffect, useState } from "react";
import Link from "next/link";

// UI Components
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
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
  // --- Global State ---
  const { isOpen } = useSidebarStore();

  // --- Local State ---
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // --- Effects ---
  // Mount Check: รอให้ Component โหลดเสร็จก่อน Apply layout ที่เกี่ยวกับ LocalStorage
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Scroll Detection: ตรวจจับการเลื่อนหน้าจอเพื่อเปลี่ยน Style
  useEffect(() => {
    const handleScroll = () => {
      // Optimization: Update state เฉพาะเมื่อค่าเปลี่ยนไปจริงๆ
      const scrolled = window.scrollY > 0;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    };

    // passive: true ช่วยเรื่อง Performance ของการ Scroll
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        // -------------------------------------------------------
        // **Positioning & Core Layout
        // -------------------------------------------------------
        "fixed top-0 right-0 z-40 h-16 px-4 md:px-6",
        "flex items-center justify-between gap-4",
        "border-b transition-[left,background-color,backdrop-filter] duration-300 ease-in-out",

        // -------------------------------------------------------
        // **Responsive Positioning (Key Logic)
        // - Mobile: ชิดซ้ายสุด (left-0)
        // - Desktop: ขยับซ้ายหนี Sidebar (288px หรือ 72px)
        // -------------------------------------------------------
        "left-0", // Default (Mobile)
        // Logic: ถ้า Mount แล้ว + Sidebar เปิด -> เว้นซ้าย 72 (288px), ถ้าปิด -> 72px
        isMounted && isOpen ? "md:left-72" : "md:left-[72px]",

        // -------------------------------------------------------
        // **Visual Style (Scroll Dependent)
        // -------------------------------------------------------
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-border/40 shadow-sm supports-[backdrop-filter]:bg-background/60"
          : "bg-background/40 backdrop-blur-sm border-transparent"
      )}
    >
      {/* ================= LEFT SECTION (Search & Nav) ================= */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Mobile Hamburger Menu (ซ่อนใน Desktop) */}
        <div className="md:hidden shrink-0">
          <MobileNav />
        </div>

        {/* Global Search / Command Menu */}
        {/* max-w-md: คุมความกว้างไม่ให้ยาวเกินไปจนเสียสมดุล */}
        <div className="w-full max-w-sm md:max-w-md">
          <CommandMenu />
        </div>
      </div>

      {/* ================= RIGHT SECTION (Actions) ================= */}
      <div className="flex items-center gap-2 shrink-0">
        {/* GitHub Link (ซ่อนใน Mobile เพื่อประหยัดพื้นที่) */}
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

        {/* Dark Mode Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}
