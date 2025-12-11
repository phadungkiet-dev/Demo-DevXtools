"use client";

import * as React from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ✅ แก้ไข 1: ใส่ ? เพื่อให้ isOpen เป็น Optional (ไม่ต้องส่งค่าก็ได้)
export function ThemeToggle({ isOpen }: { isOpen?: boolean }) {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* ✅ แก้ไข 2: ปรับ Logic ปุ่ม
            - ถ้า isOpen = true (Sidebar กาง): แสดงปุ่มเต็มพร้อมข้อความ
            - ถ้า isOpen = false หรือ undefined (Sidebar หุบ หรือ Header): แสดงแค่ Icon
        */}
        <Button
          variant={isOpen ? "outline" : "ghost"}
          size={isOpen ? "default" : "icon"}
          className={isOpen ? "w-full justify-start gap-2" : "h-9 w-9"}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />

          {isOpen ? (
            <span>Change Theme</span>
          ) : (
            <span className="sr-only">Toggle theme</span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Laptop className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
