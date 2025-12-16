"use client";

// =============================================================================
// Imports
// =============================================================================
import * as React from "react";
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
// Component
// =============================================================================
export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // 🔄 Effect: Handle Hydration & Warning
  React.useEffect(() => {
    // ใช้ setTimeout(0) เพื่อเลี่ยง Error: "Calling setState synchronously within an effect..."
    // และเพื่อให้มั่นใจว่า Client ได้ render แล้วจริงๆ ก่อนแสดง UI ที่เกี่ยวกับ Theme
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // ⚠️ Placeholder: แสดงปุ่มหลอกระหว่างรอ Mount
  // เพื่อป้องกัน Hydration Mismatch Error (Server render ไม่รู้เรื่อง Theme)
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full opacity-50 cursor-wait bg-muted/20"
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
          {/* Sun Icon (Show in Light Mode) */}
          <Sun
            className={cn(
              "h-[1.2rem] w-[1.2rem] transition-all duration-500 ease-in-out",
              "rotate-0 scale-100 dark:-rotate-90 dark:scale-0", // Animation Logic
              "text-amber-500"
            )}
          />
          {/* Moon Icon (Show in Dark Mode) */}
          <Moon
            className={cn(
              "absolute h-[1.2rem] w-[1.2rem] transition-all duration-500 ease-in-out",
              "rotate-90 scale-0 dark:rotate-0 dark:scale-100", // Animation Logic
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
        {/* Helper function to render items consistently */}
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
