"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { toolCategories, getToolsByCategory } from "@/config/tools";
import { Laptop, Moon, Sun, Home } from "lucide-react"; // Import Icons ที่จำเป็น
import { useTheme } from "next-themes"; // เดี๋ยวเราจะพูดถึง Theme ในขั้นตอนถัดไป (ใส่เผื่อไว้ก่อนได้)

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { setTheme } = useTheme(); // Uncomment เมื่อทำ Dark Mode

  // 1. Keyboard Shortcut Listener (Cmd+K / Ctrl+K)
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

  // 2. Navigation Helper
  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* System & Navigation */}
        <CommandGroup heading="General">
          <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
            <Home className="mr-2 h-4 w-4" />
            <span>Home / Dashboard</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Dynamic Tools Loop */}
        {toolCategories.map((category) => {
          const tools = getToolsByCategory(category.id);
          if (tools.length === 0) return null;

          return (
            <CommandGroup key={category.id} heading={category.label}>
              {tools.map((tool) => (
                <CommandItem
                  key={tool.slug}
                  keywords={[
                    tool.title,
                    tool.description,
                    ...(tool.keywords || []),
                  ]} // Search หลายมิติ
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
          );
        })}

        <CommandSeparator />

        {/* Theme Toggles (Placeholder for next phase) */}
        <CommandGroup heading="Theme">
          <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
            <Sun className="mr-2 h-4 w-4" />
            <span>Light Theme</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark Theme</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
            <Laptop className="mr-2 h-4 w-4" />
            <span>System Theme</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
