"use client";

// =============================================================================
// Imports
// =============================================================================
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Config & Store
import { toolCategories, allTools, ToolConfig } from "@/config/tools";
import { useSidebarStore } from "@/store/use-sidebar-store";
import { useFavorites } from "@/hooks/useFavorites";
import { useRecentTools } from "@/hooks/useRecentTools";

// Utils
import { cn } from "@/lib/utils";

// UI Components
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

// Icons & Logo
import {
  Star,
  Clock,
  PanelLeftClose,
  PanelRightClose,
  ChevronDown,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";

// =============================================================================
// Main Component
// =============================================================================
type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

export function Sidebar({ className, ...props }: SidebarProps) {
  const pathname = usePathname();
  // Global State จาก Zustand
  const { isOpen, toggle } = useSidebarStore();
  const { favorites } = useFavorites();
  const { recents } = useRecentTools();

  // Local State
  const [isMounted, setIsMounted] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState<
    Record<string, boolean>
  >({});

  // ---------------------------------------------------------------------------
  // Effects
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Auto Expand: เมื่อเข้าสู่หน้านั้นๆ ให้เปิด Category ของหน้านั้นอัตโนมัติ
  useEffect(() => {
    if (!isOpen) return;

    const activeTool = allTools.find(
      (t) => pathname === `/tools/${t.category}/${t.slug}`
    );

    if (activeTool) {
      // ใช้ setTimeout เพื่อให้ State update ไม่ชนกับ render cycle ปัจจุบัน
      const timer = setTimeout(() => {
        setCollapsedCategories((prev) => {
          // ถ้าเปิดอยู่แล้วไม่ต้องทำอะไร
          if (prev[activeTool.category] === false) return prev;
          // สั่งเปิด (false = ไม่ collapse)
          return { ...prev, [activeTool.category]: false };
        });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [pathname, isOpen]);

  // ---------------------------------------------------------------------------
  // Logic / Memoization
  // ---------------------------------------------------------------------------
  const toggleCategory = (id: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // กรองรายการโปรด
  const favoriteToolsList = useMemo(() => {
    if (!isMounted) return [];
    return allTools.filter((t) => favorites.includes(t.slug));
  }, [isMounted, favorites]);

  // กรองรายการล่าสุด (Limit 5)
  const recentToolsList = useMemo(() => {
    if (!isMounted) return [];
    return recents
      .map((slug) => allTools.find((t) => t.slug === slug))
      .filter((t): t is ToolConfig => t !== undefined)
      .slice(0, 5); // ✅ LIMIT 5: ตัดเหลือแค่ 5 รายการสำหรับ Desktop
  }, [isMounted, recents]);

  // จัดกลุ่มเครื่องมือตามหมวดหมู่ (Clean Code using Reduce)
  const groupedTools = useMemo(() => {
    return toolCategories.reduce((acc, cat) => {
      const toolsInCat = allTools.filter((t) => t.category === cat.id);
      if (toolsInCat.length > 0) {
        acc[cat.id] = toolsInCat;
      }
      return acc;
    }, {} as Record<string, ToolConfig[]>);
  }, []);

  // ถ้ายังไม่ Mount ให้ return null ไปก่อนเพื่อกัน Layout Shift ที่ไม่สวยงาม หรือ Hydration Error
  if (!isMounted) return null;

  return (
    <aside
      className={cn(
        // Layout Positioning
        "fixed left-0 top-0 z-50 h-screen",
        // Visual Style (Glassmorphism + Border)
        "border-r border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60",
        // Flex Layout
        // "flex flex-col transition-[width] duration-300 ease-in-out will-change-[width]",
        "flex flex-col transition-[width] duration-300 ease-in-out will-change-[width]",
        // Visibility (Desktop Only - Mobile ใช้ MobileNav แยกต่างหาก)
        "hidden md:flex",
        // Width Control
        isOpen ? "w-72" : "w-[72px]",
        className
      )}
      {...props}
    >
      {/* --------------------------------------------------------------------------- */}
      {/* Header (Logo Area) */}
      {/* --------------------------------------------------------------------------- */}
      <div className="flex h-16 items-center justify-start px-4 shrink-0 overflow-hidden border-b border-border/40">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 transition-all w-full min-w-0 group",
            !isOpen && "justify-center"
          )}
        >
          <Logo size={36} className="shrink-0" />
          <div
            className={cn(
              "flex flex-col transition-opacity duration-300 min-w-0 overflow-hidden",
              isOpen ? "opacity-100" : "opacity-0 w-0 hidden"
            )}
          >
            <span className="font-bold text-base leading-none tracking-tight">
              CodeXKit
            </span>
            <span className="text-[10px] text-muted-foreground font-medium mt-0.5">
              Developer Tools
            </span>
          </div>
        </Link>
      </div>

      {/* --------------------------------------------------------------------------- */}
      {/* 2. Scrollable Content Area */}
      {/* --------------------------------------------------------------------------- */}
      <div className="flex-1 min-h-0 w-full group/scroll">
        <ScrollArea className="h-full w-full px-3 py-4">
          <div className="space-y-6 pb-4">
            {/* --- Favorites Section --- */}
            {favoriteToolsList.length > 0 && (
              <div
                className={cn(
                  "space-y-1",
                  !isOpen && "pb-2 mb-2 border-b border-dashed border-border/60"
                )}
              >
                {isOpen && (
                  <SectionHeader
                    icon={Star}
                    label="Favorites"
                    colorClass="text-amber-500"
                  />
                )}
                <div className="space-y-0.5">
                  {favoriteToolsList.map((t) => (
                    <SidebarItem
                      key={t.slug}
                      tool={t}
                      isOpen={isOpen}
                      pathname={pathname}
                      isIndent={false}
                      // เพิ่ม Hover สีเหลืองอ่อน
                      className="hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:text-yellow-600 dark:hover:text-yellow-400"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* --- Recents Section --- */}
            {recentToolsList.length > 0 && (
              <div
                className={cn(
                  "space-y-1",
                  !isOpen && "pb-2 mb-2 border-b border-dashed border-border/50"
                )}
              >
                {isOpen && (
                  <SectionHeader
                    icon={Clock}
                    label="Recent"
                    colorClass="text-blue-500"
                  />
                )}
                <div className="space-y-0.5">
                  {recentToolsList.map((t) => (
                    <SidebarItem
                      key={t.slug}
                      tool={t}
                      isOpen={isOpen}
                      pathname={pathname}
                      isIndent={false}
                      // เพิ่ม Hover สีฟ้าอ่อน
                      className="hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-600 dark:hover:text-sky-400"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* --- Categories Main Loop --- */}
            <div className="w-full">
              {toolCategories.map((category) => {
                const tools = groupedTools[category.id];
                if (!tools) return null;
                const isCollapsed = collapsedCategories[category.id];

                return (
                  <div key={category.id} className="mb-3 w-full">
                    {/* Category Header (Clickable) */}
                    {isOpen ? (
                      <button
                        type="button"
                        onClick={() => toggleCategory(category.id)}
                        className={cn(
                          "grid grid-cols-[1fr_auto] items-center gap-2 w-full h-8 px-3 rounded-md transition-colors",
                          "hover:bg-muted/50 text-muted-foreground hover:text-foreground",
                          "group mb-0.5 outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        )}
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
                      // Divider for Collapsed Mode
                      <div className="my-2 h-px bg-border/40 w-8 mx-auto" />
                    )}

                    {/* Tools List (Collapsible) */}
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
                      <div className="min-h-0 w-full space-y-0.5">
                        {tools.map((tool) => (
                          <SidebarItem
                            key={tool.slug}
                            tool={tool}
                            isOpen={isOpen}
                            pathname={pathname}
                            isIndent={true}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* --------------------------------------------------------------------------- */}
      {/* 3. Footer (Toggle Button) */}
      {/* --------------------------------------------------------------------------- */}
      <div className="flex shrink-0 items-center justify-center border-t border-border/40 bg-muted/10 p-3 backdrop-blur-sm">
        <Button
          variant="ghost"
          onClick={toggle}
          className={cn(
            // Base styles
            "text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-300",
            // Force content centering
            "flex items-center justify-center",
            isOpen ? "h-10 w-full px-3" : "h-9 w-9 px-0"
          )}
          title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {isOpen ? (
            <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-300">
              <PanelLeftClose size={18} />
              <span className="text-sm font-medium">Collapse</span>
            </div>
          ) : (
            <PanelRightClose size={18} />
          )}
        </Button>
      </div>
    </aside>
  );
}

// =============================================================================
// Helper Components (Sub-Components)
// =============================================================================
interface SidebarItemProps {
  tool: ToolConfig;
  isOpen: boolean;
  pathname: string;
  isIndent: boolean;
  className?: string;
}

function SidebarItem({
  tool,
  isOpen,
  pathname,
  isIndent,
  className,
}: SidebarItemProps) {
  const isActive = pathname === `/tools/${tool.category}/${tool.slug}`;

  // กรณี Sidebar พับอยู่ (แสดงแค่ Icon + Tooltip)
  if (!isOpen) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={`/tools/${tool.category}/${tool.slug}`}
              className={cn(
                "flex items-center justify-center w-10 h-10 mx-auto rounded-xl transition-all duration-200 mb-1",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                  : cn(
                      "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                      className
                    )
              )}
            >
              <tool.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </Link>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            sideOffset={10}
            className="font-medium z-[60]"
          >
            {tool.title}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // กรณี Sidebar เปิดอยู่ (แสดงเต็ม)
  return (
    <Link
      href={`/tools/${tool.category}/${tool.slug}`}
      className="block group relative w-full outline-none"
      title={tool.title}
    >
      <div
        className={cn(
          "grid grid-cols-[auto_1fr_auto] items-center gap-3 h-9 rounded-md text-sm transition-all duration-200 select-none w-full",
          isIndent ? "pl-3 pr-2" : "px-2",
          isActive
            ? "bg-primary/10 text-primary font-medium shadow-sm"
            : cn(
                "text-muted-foreground/80 hover:bg-muted/50 hover:text-foreground",
                className
              )
        )}
      >
        <tool.icon
          size={16}
          className={cn(
            "shrink-0 transition-colors",
            isActive
              ? "text-primary"
              : "text-muted-foreground/60 group-hover:text-current"
          )}
          strokeWidth={isActive ? 2.5 : 2}
        />
        <span className="truncate min-w-0 text-left">{tool.title}</span>

        {/* Badge "New" */}
        {tool.isNew && (
          <span className="shrink-0 text-[9px] uppercase font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/50">
            New
          </span>
        )}
      </div>

      {/* Active Indicator Bar */}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
      )}
    </Link>
  );
}

// Header สำหรับ Section ย่อย (Favorites, Recent)
function SectionHeader({
  icon: Icon,
  label,
  colorClass,
}: {
  icon: React.ElementType;
  label: string;
  colorClass: string;
}) {
  return (
    <div className="px-3 mb-2 flex items-center justify-between text-xs font-semibold text-muted-foreground/50 uppercase tracking-wider animate-in fade-in">
      <span className="flex items-center gap-2">
        <Icon className={cn("w-3 h-3", colorClass)} /> {label}
      </span>
    </div>
  );
}
