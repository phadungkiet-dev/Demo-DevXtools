"use client";

// =============================================================================
// Imports
// =============================================================================
import * as React from "react";
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
import { allTools } from "@/config/tools";
import { cn } from "@/lib/utils";
// Icons
import {
  Laptop,
  Moon,
  Sun,
  Search,
  Command, // For Mac Icon
  ArrowRight,
} from "lucide-react";

// =============================================================================
// Component
// =============================================================================
export function CommandMenu() {
  const router = useRouter();
  const { setTheme } = useTheme();

  // State
  const [open, setOpen] = React.useState(false);
  const [isMac, setIsMac] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  // 🔄 Effect: Initialize & Keyboard Listeners
  React.useEffect(() => {
    // 1. Set Mounted & Check OS
    setMounted(true);
    if (typeof navigator !== "undefined") {
      setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
    }

    // 2. Keyboard Event Handler
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  /**
   * 🏃 Helper: Run Command & Close Dialog
   */
  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  // Prevent Hydration Mismatch (Don't render anything until mounted)
  if (!mounted) {
    // Return placeholder button to prevent layout shift
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
      {/* --- Trigger Button --- */}
      <Button
        variant="outline"
        className={cn(
          "relative h-9 w-full justify-start rounded-xl bg-muted/40 text-sm font-normal text-muted-foreground shadow-sm transition-all hover:bg-muted/60 hover:text-foreground border-border/40",
          "px-3 md:w-64 lg:w-72 xl:w-96" // Responsive widths
        )}
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4 opacity-50 shrink-0" />

        <span className="inline-flex truncate">Search tools...</span>

        {/* Keyboard Shortcut Badge */}
        <kbd className="pointer-events-none absolute right-2 top-2 hidden h-5 select-none items-center gap-1 rounded bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex border border-border/50 shadow-sm">
          {isMac ? (
            <>
              <span className="text-xs">⌘</span>K
            </>
          ) : (
            <>
              <span className="text-xs">Ctrl</span>K
            </>
          )}
        </kbd>
      </Button>

      {/* --- Command Dialog --- */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search tools..." />
        <CommandList className="py-2 max-h-[400px]">
          <CommandEmpty>No results found.</CommandEmpty>

          {/* Group 1: Tools */}
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
                className="group flex items-center gap-2 rounded-lg px-2 py-2 aria-selected:bg-primary/10 aria-selected:text-primary cursor-pointer my-1"
              >
                <div className="flex items-center justify-center w-6 h-6 rounded bg-muted/50 group-aria-selected:bg-primary/20 transition-colors">
                  <tool.icon className="h-4 w-4 shrink-0" />
                </div>
                <span className="truncate flex-1">{tool.title}</span>

                {/* Visual indicator on hover/select */}
                <ArrowRight className="h-4 w-4 opacity-0 group-aria-selected:opacity-100 transition-opacity ml-2 text-primary/50" />

                {/* New Badge */}
                {tool.isNew && (
                  <span className="ml-2 text-[10px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded-full font-bold border border-emerald-500/20">
                    NEW
                  </span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator className="my-2" />

          {/* Group 2: Theme */}
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
// Helper Component: Theme Item (To reduce duplication)
// =============================================================================
interface ThemeItemProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  runCommand: (cb: () => void) => void;
}

function ThemeItem({ icon: Icon, label, onClick, runCommand }: ThemeItemProps) {
  return (
    <CommandItem
      onSelect={() => runCommand(onClick)}
      className="group flex items-center gap-2 rounded-lg px-2 py-2 aria-selected:bg-primary/10 aria-selected:text-primary cursor-pointer my-1"
    >
      <div className="flex items-center justify-center w-6 h-6 rounded bg-muted/50 group-aria-selected:bg-primary/20 transition-colors">
        <Icon className="h-4 w-4 shrink-0" />
      </div>
      <span>{label}</span>
    </CommandItem>
  );
}
