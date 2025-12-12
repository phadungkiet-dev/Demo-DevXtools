"use client";

import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CommandMenu } from "@/components/layout/command-menu";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useSidebarStore } from "@/store/use-sidebar-store";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false); // ใช้เปลี่ยน Background ตอน Scroll
  const { isOpen } = useSidebarStore(); // ใช้คำนวณตำแหน่ง Left

  // Scroll Listener (Performance Aware: passive: true)
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        // Positioning Core:
        // - fixed top-0 right-0: ยึดขอบขวาและบน (แก้ปัญหาล้นจอ 100%)
        // - h-16: ความสูงมาตรฐาน (64px)
        "fixed top-0 z-40 h-16 flex items-center justify-between gap-4 px-4 border-b transition-[left] duration-300 ease-in-out right-0",

        // Dynamic Styles:
        // - Background: Glassmorphism เมื่อ Scroll, Transparent เมื่ออยู่บนสุด
        // - Left Position: ขยับตาม Sidebar (Responsive Logic)
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-border/40 shadow-sm"
          : "bg-background/0 border-transparent",

        // Responsive Left Position
        // Mobile: เต็มจอ
        "left-0", // Default (Mobile)
        // Desktop: ขยับ start point ตาม sidebar
        isOpen ? "md:left-72" : "md:left-[72px]" // Desktop Overrides
      )}
    >
      {/* Left Side (Mobile Toggle + Search) 
        ใช้ flex-1 เพื่อให้ Search Bar มีพื้นที่ขยายตัวได้เต็มที่ทางซ้าย
      */}
      <div className="flex items-center gap-4 flex-1 min-w-0 justify-start">
        <div className="md:hidden shrink-0">
          <MobileNav />
        </div>

        {/* Command Menu Wrapper */}
        {/* w-full max-w-sm: ให้ยืดได้ แต่ไม่เกินขนาดสวยงาม และชิดซ้ายสุดของ Zone นี้ */}
        <div className="w-full max-w-sm">
          <CommandMenu />
        </div>
      </div>

      {/* Right Side (Icons)
        ใช้ shrink-0 เพื่อการันตีว่า Icon จะไม่ถูกบีบหรือดันตกขอบเด็ดขาด
      */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-full hidden sm:flex hover:bg-muted/60"
          asChild
        >
          <Link
            href="https://github.com/phadungkiet-dev/demo-devxtools"
            target="_blank"
            rel="noreferrer"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
