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
  const [isScrolled, setIsScrolled] = useState(false);
  const { isOpen } = useSidebarStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-40 flex h-16 w-full items-center gap-x-4 border-b bg-background/80 px-4 transition-all duration-300 backdrop-blur-md",
        isScrolled && "shadow-sm border-border/60",
        // ✅ ปรับ Responsive Padding:
        // Desktop: ขยับตาม Sidebar (72px หรือ 288px)
        // Mobile: ไม่ต้องขยับ (เพราะ Sidebar ซ่อนอยู่)
        isOpen ? "md:pl-72" : "md:pl-[72px]"
      )}
    >
      {/* Mobile Menu (ซ่อนบน Desktop) */}
      <div className="md:hidden">
        <MobileNav />
      </div>

      {/* Search Area */}
      {/* ✅ flex-1: สั่งให้พื้นที่ตรงนี้ขยายเต็มที่ เพื่อให้ CommandMenu (ที่มี w-full) ขยายตาม */}
      <div className="flex flex-1 items-center gap-4">
        <CommandMenu />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-full hidden sm:flex"
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
        <div className="h-4 w-px bg-border/50 mx-1 hidden sm:block" />
        <ThemeToggle />
      </div>
    </header>
  );
}
