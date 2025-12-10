"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toolCategories, getToolsByCategory } from "@/config/tools";
import { useSidebarStore } from "@/store/use-sidebar-store";
import { ChevronLeft, Menu, Box, Search } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebarStore();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-16"
      )}
    >
      {/* Header / Logo Area */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        <Link href="/" className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-8 w-8 min-w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Box size={20} strokeWidth={3} />
          </div>
          <span
            className={cn(
              "font-bold text-lg whitespace-nowrap transition-opacity duration-300",
              isOpen ? "opacity-100" : "opacity-0 w-0"
            )}
          >
            DevToolX
          </span>
        </Link>

        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", !isOpen && "mx-auto")}
          onClick={toggle}
        >
          {isOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}
        </Button>
      </div>

      {/* Search Trigger Hint */}
      <div className={cn("px-4 py-4", !isOpen && "px-2")}>
        <Button
          variant="outline"
          className={cn(
            "relative h-9 w-full justify-start text-sm text-muted-foreground",
            !isOpen && "h-9 w-9 justify-center px-0"
          )}
          // เราอาจจะต้องใช้ Global State หรือ Event Event Dispatcher เพื่อเปิด Command Menu
          // แต่วิธีที่ง่ายที่สุดคือจำลองการกด key (หรือใช้ Context)
          onClick={() => {
            document.dispatchEvent(
              new KeyboardEvent("keydown", { key: "k", metaKey: true })
            );
          }}
        >
          <Search className="h-4 w-4 mr-2" />
          {isOpen && (
            <>
              <span>Search...</span>
              <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </>
          )}
        </Button>
      </div>

      {/* Navigation Links */}
      <ScrollArea className="h-[calc(100vh-4rem)] py-4">
        <div className="space-y-6 px-2">
          {toolCategories.map((category) => {
            const categoryTools = getToolsByCategory(category.id);
            if (categoryTools.length === 0) return null;

            return (
              <div key={category.id} className="space-y-2">
                {/* Category Label (Only visible when expanded) */}
                {isOpen && (
                  <h4 className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                    {category.label}
                  </h4>
                )}

                {/* Tool Links */}
                <div className="space-y-1">
                  {categoryTools.map((tool) => {
                    const isActive =
                      pathname === `/tools/${category.id}/${tool.slug}`;
                    const Icon = tool.icon;

                    return (
                      <Link
                        key={tool.slug}
                        href={`/tools/${tool.category}/${tool.slug}`}
                        className="block"
                      >
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className={cn(
                            "w-full justify-start gap-3",
                            !isOpen && "justify-center px-2",
                            isActive && "font-medium"
                          )}
                          title={!isOpen ? tool.title : undefined}
                        >
                          <Icon size={18} className="shrink-0" />

                          <span
                            className={cn(
                              "truncate transition-all duration-300",
                              isOpen
                                ? "opacity-100 w-auto"
                                : "opacity-0 w-0 hidden"
                            )}
                          >
                            {tool.title}
                          </span>
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer Area */}
      <div className="border-t p-4 mt-auto">
        <ThemeToggle isOpen={isOpen} />
      </div>
    </aside>
  );
}
