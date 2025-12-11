"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Search,
  Home,
  Laptop,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { allTools } from "@/config/tools";
import { useTheme } from "next-themes";

export function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const { setTheme } = useTheme();

  // Logic: เปิด/ปิด ด้วย Ctrl+K หรือ Cmd+K
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

  // ฟังก์ชัน Helper: เมื่อเลือกเมนูแล้ว ให้ทำคำสั่งและปิด Popup
  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search tools..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* 1. Navigation Group */}
        <CommandGroup heading="General">
          <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
            <Home className="mr-2 h-4 w-4" />
            <span>Home</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/settings"))}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* 2. Tools List (ดึงมาจาก Config โดยตรง) */}
        <CommandGroup heading="Tools">
          {allTools.map((tool) => (
            <CommandItem
              key={tool.slug}
              value={`${tool.title} ${tool.description} ${tool.keywords?.join(
                " "
              )}`} // ใส่ keywords เพื่อให้ search เจอได้กว้างขึ้น
              onSelect={() =>
                runCommand(() =>
                  router.push(`/tools/${tool.category}/${tool.slug}`)
                )
              }
            >
              <tool.icon className="mr-2 h-4 w-4" />
              <span>{tool.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* 3. Theme Toggle */}
        <CommandGroup heading="Theme">
          <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
            <Sun className="mr-2 h-4 w-4" />
            <span>Light</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
            <Monitor className="mr-2 h-4 w-4" />
            <span>System</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
