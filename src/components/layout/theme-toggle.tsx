"use client";

// =============================================================================
// Imports
// =============================================================================
import { useEffect, useState } from "react";
import { Moon, Sun, Laptop, Check } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// =============================================================================
// Main Component
// =============================================================================
export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  // 🔄 Effect: Handle Hydration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // ⚠️ Loading State:
  // ป้องกัน Hydration Mismatch ระหว่าง Server (ไม่รู้ธีม) กับ Client
  if (!isMounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full opacity-50 bg-muted/20"
        disabled
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Loading theme...</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full hover:bg-muted/60 focus-visible:ring-1 focus-visible:ring-primary/30 transition-colors"
        >
          {/* Animation Logic:
            - Light Mode: Sun scale-100, Moon scale-0
            - Dark Mode: Sun scale-0, Moon scale-100
          */}
          <Sun
            className={cn(
              "h-[1.2rem] w-[1.2rem] transition-all duration-500 ease-in-out",
              "rotate-0 scale-100 dark:-rotate-90 dark:scale-0", // Show in Light
              "text-amber-500"
            )}
          />
          <Moon
            className={cn(
              "absolute h-[1.2rem] w-[1.2rem] transition-all duration-500 ease-in-out",
              "rotate-90 scale-0 dark:rotate-0 dark:scale-100", // Show in Dark
              "text-blue-400"
            )}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="min-w-[150px] rounded-xl border-border/60 shadow-lg backdrop-blur-xl bg-background/80 p-1"
      >
        <ThemeItem
          active={theme === "light"}
          onClick={() => setTheme("light")}
          icon={Sun}
          label="Light"
        />
        <ThemeItem
          active={theme === "dark"}
          onClick={() => setTheme("dark")}
          icon={Moon}
          label="Dark"
        />
        <ThemeItem
          active={theme === "system"}
          onClick={() => setTheme("system")}
          icon={Laptop}
          label="System"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// =============================================================================
// Helper Component: Dropdown Item
// =============================================================================
interface ThemeItemProps {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}

function ThemeItem({ active, onClick, icon: Icon, label }: ThemeItemProps) {
  return (
    <DropdownMenuItem
      onClick={onClick}
      className={cn(
        "flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 cursor-pointer outline-none transition-colors",
        "focus:bg-primary/10 focus:text-primary",
        active && "bg-muted/50 text-foreground font-medium"
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 opacity-70" />
        <span className="text-sm">{label}</span>
      </div>
      {active && (
        <Check className="h-3.5 w-3.5 text-primary animate-in zoom-in" />
      )}
    </DropdownMenuItem>
  );
}
