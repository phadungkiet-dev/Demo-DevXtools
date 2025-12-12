"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toolCategories, allTools } from "@/config/tools";
import { useSidebarStore } from "@/store/use-sidebar-store";
import {
  Box,
  Star,
  Clock,
  PanelLeftClose,
  PanelRightClose,
  ChevronDown,
} from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useRecentTools } from "@/hooks/useRecentTools";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

export function Sidebar({ className, ...props }: SidebarProps) {
  // Hooks & Store: ดึงข้อมูลที่จำเป็น (Path, Sidebar State, Favorites, Recents)
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebarStore();
  const { favorites } = useFavorites();
  const { recents } = useRecentTools();

  // Hydration Fix: ใช้ isMounted เพื่อป้องกัน Error เมื่อ Server/Client render ไม่ตรงกัน
  const [isMounted, setIsMounted] = useState(false);

  const [collapsedCategories, setCollapsedCategories] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Auto-Expand Logic: เปิดหมวดหมู่ของหน้าที่กำลังใช้งานให้อัตโนมัติ
  useEffect(() => {
    if (!isOpen) return;
    const activeTool = allTools.find(
      (t) => pathname === `/tools/${t.category}/${t.slug}`
    );
    if (activeTool) {
      const timer = setTimeout(() => {
        setCollapsedCategories((prev) => {
          if (prev[activeTool.category] === false) return prev;
          return { ...prev, [activeTool.category]: false };
        });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [pathname, isOpen]);

  const toggleCategory = (id: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // ใช้ useMemo เพื่อคำนวณข้อมูลใหม่เฉพาะเมื่อ Dependency เปลี่ยน (Performance Optimization)
  const favoriteToolsList = useMemo(
    () => allTools.filter((t) => favorites.includes(t.slug)),
    [favorites]
  );

  const recentToolsList = useMemo(
    () =>
      recents
        .map((slug) => allTools.find((t) => t.slug === slug))
        .filter((t) => t !== undefined) as typeof allTools,
    [recents]
  );

  const groupedTools = useMemo(() => {
    const groups: Record<string, typeof allTools> = {};
    toolCategories.forEach((cat) => {
      const toolsInCat = allTools.filter((t) => t.category === cat.id);
      if (toolsInCat.length > 0) groups[cat.id] = toolsInCat;
    });
    return groups;
  }, []);

  const renderToolItem = (tool: (typeof allTools)[0], isIndent = true) => {
    const isActive = pathname === `/tools/${tool.category}/${tool.slug}`;
    // Logic: ถ้า Sidebar ปิด -> แสดงแค่ Icon (Tooltip)
    //        ถ้า Sidebar เปิด -> แสดงรายการเต็มรูปแบบ (Grid Layout)
    if (!isOpen) {
      return (
        <TooltipProvider key={tool.slug} delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/tools/${tool.category}/${tool.slug}`}
                className={cn(
                  "flex items-center justify-center w-10 h-10 mx-auto rounded-xl transition-all duration-200 mb-1",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                <tool.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </Link>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="font-medium z-[60]"
              sideOffset={10}
            >
              {tool.title}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <Link
        key={tool.slug}
        href={`/tools/${tool.category}/${tool.slug}`}
        className="block mb-1 group relative w-full"
        title={tool.title}
      >
        <div
          className={cn(
            "grid grid-cols-[auto_1fr_auto] items-center gap-3 h-9 rounded-md text-sm transition-all duration-200 select-none w-full",
            isIndent ? "ml-3 px-3 w-[calc(100%-0.75rem)]" : "px-3 w-full",
            isActive
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground/80 hover:bg-muted/50 hover:text-foreground"
          )}
        >
          <tool.icon
            size={16}
            className={cn(
              "shrink-0 transition-colors",
              isActive
                ? "text-primary"
                : "text-muted-foreground/60 group-hover:text-foreground"
            )}
            strokeWidth={isActive ? 2.5 : 2}
          />
          <span className="truncate min-w-0 text-left">{tool.title}</span>
          {tool.isNew ? (
            <span className="shrink-0 text-[9px] uppercase font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/50">
              New
            </span>
          ) : (
            <span />
          )}
        </div>
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        // ✅ Z-Index 50: สูงกว่า Header (Z-40) แน่นอน
        "fixed left-0 top-0 z-50 h-screen border-r border-border/40 bg-background/80 backdrop-blur-xl flex flex-col transition-all duration-300 ease-in-out will-change-[width]",
        "hidden md:flex",
        isOpen ? "w-72" : "w-[72px]",
        className
      )}
      {...props}
    >
      <div className="flex h-16 items-center justify-start px-4 shrink-0 overflow-hidden">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 transition-all w-full min-w-0",
            !isOpen && "justify-center"
          )}
        >
          <div className="flex h-9 w-9 min-w-[36px] items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md shrink-0">
            <Box size={20} strokeWidth={2.5} />
          </div>
          <div
            className={cn(
              "flex flex-col transition-all duration-300 min-w-0 overflow-hidden",
              isOpen
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-2 w-0 hidden"
            )}
          >
            <span className="font-bold text-base leading-none tracking-tight truncate">
              CodeXKit
            </span>
            <span className="text-[10px] text-muted-foreground font-medium mt-0.5 truncate">
              Developer Tools
            </span>
          </div>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-3 py-2 h-[calc(100vh-8rem)] w-full">
        <div className="space-y-6 pb-4 w-full">
          {isMounted && favoriteToolsList.length > 0 && (
            <div
              className={cn(
                "space-y-1",
                !isOpen && "pb-2 mb-2 border-b border-dashed border-border/50"
              )}
            >
              {isOpen && (
                <div className="px-3 mb-2 flex items-center justify-between text-xs font-semibold text-muted-foreground/50 uppercase tracking-wider">
                  <span className="flex items-center gap-2">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500/20" />{" "}
                    Favorites
                  </span>
                </div>
              )}
              <div className="space-y-0.5">
                {favoriteToolsList.map((t) => renderToolItem(t, false))}
              </div>
            </div>
          )}

          {isMounted && recentToolsList.length > 0 && (
            <div
              className={cn(
                "space-y-1",
                !isOpen && "pb-2 mb-2 border-b border-dashed border-border/50"
              )}
            >
              {isOpen && (
                <div className="px-3 mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground/50 uppercase tracking-wider">
                  <Clock className="w-3 h-3 text-blue-500" /> Recent
                </div>
              )}
              <div className="space-y-0.5">
                {recentToolsList.map((t) => renderToolItem(t, false))}
              </div>
            </div>
          )}

          <div className="w-full">
            {toolCategories.map((category) => {
              const tools = groupedTools[category.id];
              if (!tools) return null;
              const isCollapsed = collapsedCategories[category.id];

              return (
                <div key={category.id} className="mb-3 w-full">
                  {isOpen ? (
                    <button
                      type="button"
                      className={cn(
                        "grid grid-cols-[1fr_auto] items-center gap-2 w-full h-8 px-3 rounded-md transition-colors",
                        "hover:bg-muted/50 text-muted-foreground hover:text-foreground",
                        "group mb-0.5 outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      )}
                      onClick={() => toggleCategory(category.id)}
                    >
                      <span className="text-xs font-bold uppercase tracking-widest truncate text-left">
                        {category.label}
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 opacity-50 transition-transform duration-200 shrink-0",
                          isCollapsed && "-rotate-90"
                        )}
                      />
                    </button>
                  ) : (
                    <div className="my-2 h-px bg-border/40 w-8 mx-auto" />
                  )}

                  <div
                    className={cn(
                      "grid transition-all duration-300 ease-in-out overflow-hidden w-full",
                      isOpen
                        ? isCollapsed
                          ? "grid-rows-[0fr] opacity-0"
                          : "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[1fr] opacity-100"
                    )}
                  >
                    <div className="min-h-0 w-full">
                      {tools.map((tool) => renderToolItem(tool, true))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-border/40 bg-background/50 backdrop-blur-sm shrink-0">
        <Button
          variant="ghost"
          size={isOpen ? "sm" : "icon"}
          onClick={toggle}
          className={cn(
            "w-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all",
            !isOpen && "h-9 w-9 mx-auto"
          )}
        >
          {isOpen ? (
            <div className="flex items-center gap-2">
              <PanelLeftClose size={16} />
              <span className="text-xs font-medium">Collapse Sidebar</span>
            </div>
          ) : (
            <PanelRightClose size={18} />
          )}
        </Button>
      </div>
    </aside>
  );
}
