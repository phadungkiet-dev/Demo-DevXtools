"use client"; // Client Component เพราะมี Interactive (Click)

import { useState, useEffect } from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme } = useTheme(); // Hook จาก next-themes

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // ✅ 2. ใช้ setTimeout 0 เพื่อหน่วงเวลาเล็กน้อย (แก้ปัญหา setState sync)
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // ✅ 3. ถ้ายังไม่ Mount ให้แสดงปุ่มหลอกๆ (Placeholder) ไปก่อน
  // เพื่อกันไม่ให้ Server Render DropdownMenu ที่มี ID เจ้าปัญหา
  if (!isMounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full opacity-50 cursor-wait"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full hover:bg-muted/60 transition-colors"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-500 ease-in-out dark:-rotate-90 dark:scale-0 text-amber-500" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-500 ease-in-out dark:rotate-0 dark:scale-100 text-blue-400" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="rounded-xl border-border/60 shadow-lg backdrop-blur-xl bg-background/80"
      >
        {/* Grid Layout for Items */}
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="grid grid-cols-[auto_1fr] gap-2 rounded-lg cursor-pointer focus:bg-primary/10 focus:text-primary"
        >
          <Sun className="h-4 w-4" /> Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="grid grid-cols-[auto_1fr] gap-2 rounded-lg cursor-pointer focus:bg-primary/10 focus:text-primary"
        >
          <Moon className="h-4 w-4" /> Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="grid grid-cols-[auto_1fr] gap-2 rounded-lg cursor-pointer focus:bg-primary/10 focus:text-primary"
        >
          <Laptop className="h-4 w-4" /> System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
