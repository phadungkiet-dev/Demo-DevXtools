"use client"; // บอก Next.js ว่าไฟล์นี้ทำงานฝั่ง Browser (เพราะมี user interaction)

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
  const router = useRouter(); // ไว้เปลี่ยนหน้า
  const [open, setOpen] = React.useState(false); // ควบคุมการเปิด/ปิด Dialog
  const { setTheme } = useTheme(); // ควบคุม Dark/Light mode

  // OS Detection เก็บสถานะว่าเป็น Mac หรือไม่
  const [isMac, setIsMac] = React.useState(false);

  React.useEffect(() => {
    // ตรวจสอบ OS เพื่อแสดงปุ่มให้ถูก (Cmd vs Ctrl)
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);

    // Global Event Listener สำหรับกดปุ่มลัด
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) { // metaKey = Cmd (Mac), ctrlKey = Ctrl (Windows)
        e.preventDefault(); // ป้องกัน default browser action
        setOpen((open) => !open); // Toggle เปิด/ปิด
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down); // Clean up เมื่อ component หายไป (ป้องกัน Memory Leak)
  }, []);

  // Helper function เพื่อปิด Dialog ก่อน แล้วค่อยทำงานต่อ (เช่น เปลี่ยนหน้า)
  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        // ใช้ Grid ภายในปุ่ม เพื่อจัดเรียง Icon - Text - Shortcut ให้สวยงาม
        className={cn(
          "grid grid-cols-[auto_1fr_auto] items-center gap-2",
          "relative h-9 w-full justify-start rounded-xl bg-muted/50 text-sm font-normal text-muted-foreground shadow-none transition-all hover:bg-muted/80 hover:text-foreground border-transparent",
          "px-3"
        )}
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 opacity-50 shrink-0" />

        <span className="truncate text-left min-w-0">
          <span className="hidden sm:inline">Search tools...</span>
          <span className="sm:hidden">Search...</span>
        </span>

        <kbd className="justify-self-end pointer-events-none hidden h-6 select-none items-center gap-1 rounded bg-background/50 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex border border-border/50 shadow-sm">
          {isMac ? (
            <span className="text-xs">⌘ + K</span>
          ) : (
            <span className="text-xs font-sans">Ctrl + K</span>
          )}
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList className="py-2">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Tools" className="px-2">
            {allTools.map((tool) => (
              <CommandItem
                key={tool.slug}
                value={`${tool.title} ${tool.keywords?.join(" ")}`}
                onSelect={() =>
                  runCommand(() =>
                    router.push(`/tools/${tool.category}/${tool.slug}`)
                  )
                }
                className="grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-lg aria-selected:bg-primary/10 aria-selected:text-primary cursor-pointer"
              >
                <tool.icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{tool.title}</span>
                {tool.isNew && (
                  <span className="ml-auto text-[10px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded-full font-bold">
                    NEW
                  </span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator className="my-2" />
          <CommandGroup heading="Theme" className="px-2">
            <CommandItem
              onSelect={() => runCommand(() => setTheme("light"))}
              className="grid grid-cols-[auto_1fr] gap-2 rounded-lg cursor-pointer"
            >
              <Sun className="h-4 w-4" /> Light
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => setTheme("dark"))}
              className="grid grid-cols-[auto_1fr] gap-2 rounded-lg cursor-pointer"
            >
              <Moon className="h-4 w-4" /> Dark
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => setTheme("system"))}
              className="grid grid-cols-[auto_1fr] gap-2 rounded-lg cursor-pointer"
            >
              <Laptop className="h-4 w-4" /> System
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
