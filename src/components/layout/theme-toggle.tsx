"use client"; // Client Component เพราะมี Interactive (Click)

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

export function ThemeToggle() {
  const { setTheme } = useTheme(); // Hook จาก next-themes

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* Trigger Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full hover:bg-muted/60 transition-colors"
        >
          {/* Sun Icon (Show in Light, Hide in Dark) */}
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-500 ease-in-out dark:-rotate-90 dark:scale-0 text-amber-500" />
          {/* Moon Icon (Hide in Light, Show in Dark) - Absolute Position */}
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-500 ease-in-out dark:rotate-0 dark:scale-100 text-blue-400" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      {/* Dropdown Content */}
      <DropdownMenuContent
        align="end"
        className="rounded-xl border-border/60 shadow-lg backdrop-blur-xl bg-background/80"
      >
        {/* Menu Items (Grid Layout) */}
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
