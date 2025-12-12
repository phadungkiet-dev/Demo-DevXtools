"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
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
import { allTools } from "@/config/tools";
import { Laptop, Moon, Sun, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const { setTheme } = useTheme();

  // Ctrl+K / Cmd+K Handler
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          // ✅ Responsive Fix:
          // 1. ใช้ w-full เพื่อให้ยืดเต็มพื้นที่ Container (flex-1 ของ SiteHeader)
          // 2. ใช้ max-w-... เพื่อจำกัดความกว้างไม่ให้ยาวเกินไปในจอใหญ่มากๆ
          // 3. ลบ md:w-64 lg:w-80 ที่เป็น Fixed width ออก
          "relative h-9 w-full max-w-md lg:max-w-lg justify-start rounded-lg bg-muted/40 text-sm font-normal text-muted-foreground shadow-none transition-all hover:bg-muted/60 border-transparent",
          "pr-12" // เว้นที่ให้ Badge Ctrl+K
        )}
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4 opacity-50 shrink-0" />
        <span className="hidden sm:inline-flex truncate">Search tools...</span>
        <span className="inline-flex sm:hidden">Search...</span>

        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Tools">
            {allTools.map((tool) => (
              <CommandItem
                key={tool.slug}
                value={`${tool.title} ${tool.keywords?.join(" ")}`}
                onSelect={() =>
                  runCommand(() =>
                    router.push(`/tools/${tool.category}/${tool.slug}`)
                  )
                }
              >
                <tool.icon className="mr-2 h-4 w-4" />
                <span>{tool.title}</span>
                {tool.isNew && (
                  <span className="ml-auto text-[10px] bg-green-500/20 text-green-600 px-1 rounded font-bold">
                    NEW
                  </span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <Sun className="mr-2 h-4 w-4" /> Light
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <Moon className="mr-2 h-4 w-4" /> Dark
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
              <Laptop className="mr-2 h-4 w-4" /> System
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
