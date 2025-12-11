"use client";

import { Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useSidebarStore } from "@/store/use-sidebar-store";
import { useEffect, useState } from "react";

export function SiteHeader() {
  // const { toggle, isOpen } = useSidebarStore(); // ถ้าไม่ได้ใช้ลบออกได้
  const [isMac, setIsMac] = useState(false);

  // ✅ แก้ไข Error ตรงนี้
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof navigator !== "undefined") {
        setIsMac(navigator.userAgent.toUpperCase().indexOf("MAC") >= 0);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // ฟังก์ชันจำลองการกด Ctrl+K
  const openCommandMenu = () => {
    if (typeof document === "undefined") return;
    const event = new KeyboardEvent("keydown", {
      key: "k",
      ctrlKey: !isMac,
      metaKey: isMac,
    });
    document.dispatchEvent(event);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center gap-x-4 border-b bg-background/80 px-6 shadow-sm backdrop-blur-md">
      <div className="flex flex-1 items-center gap-4">
        {/* ส่วน Search Bar จำลอง */}
        <Button
          variant="outline"
          className="relative h-9 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-64 lg:w-80"
          onClick={openCommandMenu}
        >
          <Search className="mr-2 h-4 w-4" />
          <span className="hidden lg:inline-flex">Search tools...</span>
          <span className="inline-flex lg:hidden">Search...</span>
          <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">{isMac ? "⌘" : "Ctrl"}</span>K
          </kbd>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {/* Notification Icon */}
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Bell className="h-4 w-4" />
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}
