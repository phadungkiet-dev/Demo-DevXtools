"use client";

// =============================================================================
// Imports
// =============================================================================
import { useState, useEffect, useCallback, type ElementType } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

// UI Components
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

// Config & Utils
import { allTools, toolCategories } from "@/config/tools";
import { cn } from "@/lib/utils";

// Icons
import { Laptop, Moon, Sun, Search, ArrowRight } from "lucide-react";

// =============================================================================
// Main Component
// =============================================================================
export function CommandMenu() {
  const router = useRouter();
  const { setTheme } = useTheme();

  // --- State Management ---
  const [open, setOpen] = useState(false); // ควบคุมการเปิด/ปิด Dialog
  const [isMac, setIsMac] = useState(false); // เช็ค OS เพื่อแสดงปุ่ม Cmd หรือ Ctrl
  const [isMounted, setIsMounted] = useState(false); // ป้องกัน Hydration Error

  // --- Effects ---

  // Initialization & Keyboard Listener
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
      // Check OS (Browser only)
      if (typeof navigator !== "undefined") {
        setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
      }
    }, 0);

    // Keyboard Shortcut Handler (Ctrl+K / Cmd+K)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // --- Helper Functions ---
  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  // Helper: หาชื่อหมวดหมู่จาก Category ID
  const getCategoryLabel = (categoryId: string) => {
    return toolCategories.find((c) => c.id === categoryId)?.label || categoryId;
  };

  // Hydration Guard: ไม่เรนเดอร์จนกว่าจะ Mount เพื่อป้องกัน Layout Shift
  if (!isMounted) {
    return (
      <Button
        variant="outline"
        className="w-full h-9 px-3 justify-start text-muted-foreground/50 bg-muted/30 pointer-events-none"
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="text-sm">Search...</span>
      </Button>
    );
  }

  return (
    <>
      {/* --- Trigger Button --- 
        ปุ่มที่แสดงบน Header ให้ user กดได้ (นอกเหนือจากกด Shortcut)
      */}
      <Button
        variant="outline"
        className={cn(
          "relative h-9 w-full justify-start rounded-xl bg-muted/40 text-sm font-normal text-muted-foreground shadow-sm transition-all hover:bg-muted/60 hover:text-foreground border-border/40",
          "px-3 md:w-64 lg:w-72 xl:w-96" // Responsive widths: ยืดตามขนาดจอ
        )}
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4 opacity-50 shrink-0" />

        <span className="inline-flex truncate">Search tools...</span>

        {/* Keyboard Shortcut Badge (Visual Hint) */}
        <kbd className="pointer-events-none absolute right-2 top-2 hidden h-5 select-none items-center gap-1 rounded bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex border border-border/50 shadow-sm">
          {isMac ? (
            <>
              <span className="text-xs">⌘&nbsp;K</span>
            </>
          ) : (
            <>
              <span className="text-xs">Ctrl&nbsp;K</span>
            </>
          )}
        </kbd>
      </Button>

      {/* --- Command Dialog (Modal) --- 
        ส่วนที่เด้งขึ้นมาเมื่อกดปุ่ม หรือ Shortcut
      */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search tools..." />

        <CommandList className="py-2 max-h-[400px]">
          <CommandEmpty>No results found.</CommandEmpty>

          {/* Group 1: Tools List (รายการเครื่องมือทั้งหมด) */}
          <CommandGroup
            heading="Tools"
            className="text-muted-foreground/70 px-2"
          >
            {allTools.map((tool) => (
              <CommandItem
                key={tool.slug}
                value={`${tool.title} ${tool.keywords?.join(" ")}`}
                onSelect={() => {
                  runCommand(() =>
                    router.push(`/tools/${tool.category}/${tool.slug}`)
                  );
                }}
                className="group flex items-center gap-3 rounded-lg px-2 py-2 aria-selected:bg-primary/10 aria-selected:text-primary cursor-pointer my-1"
              >
                {/* Icon Box */}
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted/50 group-aria-selected:bg-primary/20 transition-colors shrink-0">
                  <tool.icon className="h-4 w-4" />
                </div>

                {/* Text Content */}
                <div className="flex flex-col flex-1 min-w-0 gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium text-sm">
                      {tool.title}
                    </span>

                    {/* New Badge */}
                    {tool.isNew && (
                      <span className="shrink-0 text-[9px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0 rounded-full font-bold border border-emerald-500/20 leading-tight">
                        NEW
                      </span>
                    )}
                  </div>

                  {/* Category Label */}
                  <span className="text-[10px] text-muted-foreground/80 truncate">
                    {getCategoryLabel(tool.category)}
                  </span>
                </div>

                {/* Arrow Indicator */}
                <ArrowRight className="h-4 w-4 opacity-0 group-aria-selected:opacity-100 transition-opacity text-primary/50 shrink-0" />
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator className="my-2" />

          {/* Group 2: Theme Settings */}
          <CommandGroup
            heading="Theme"
            className="text-muted-foreground/70 px-2"
          >
            <ThemeItem
              icon={Sun}
              label="Light"
              onClick={() => setTheme("light")}
              runCommand={runCommand}
            />
            <ThemeItem
              icon={Moon}
              label="Dark"
              onClick={() => setTheme("dark")}
              runCommand={runCommand}
            />
            <ThemeItem
              icon={Laptop}
              label="System"
              onClick={() => setTheme("system")}
              runCommand={runCommand}
            />
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

// =============================================================================
// Helper Component: Theme Item
// =============================================================================
interface ThemeItemProps {
  icon: ElementType;
  label: string;
  onClick: () => void;
  runCommand: (cb: () => void) => void;
}

function ThemeItem({ icon: Icon, label, onClick, runCommand }: ThemeItemProps) {
  return (
    <CommandItem
      onSelect={() => runCommand(onClick)}
      className="group flex items-center gap-3 rounded-lg px-2 py-2 aria-selected:bg-primary/10 aria-selected:text-primary cursor-pointer my-1"
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted/50 group-aria-selected:bg-primary/20 transition-colors shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <span className="font-medium text-sm">{label}</span>
    </CommandItem>
  );
}
