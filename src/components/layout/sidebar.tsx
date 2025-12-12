"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toolCategories, allTools } from "@/config/tools";
import { useSidebarStore } from "@/store/use-sidebar-store";
import {
  ChevronRight,
  Box,
  Star,
  Clock,
  PanelLeftClose,
  PanelRightClose,
} from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useRecentTools } from "@/hooks/useRecentTools";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

export function Sidebar({ className, ...props }: SidebarProps) {
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebarStore();
  const { favorites } = useFavorites();
  const { recents } = useRecentTools();

  const [isMounted, setIsMounted] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

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
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <tool.icon size={20} />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium z-[60]">
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
        className="block mb-1 group relative"
      >
        <div
          className={cn(
            "flex items-center h-9 rounded-lg text-sm transition-all duration-200 select-none",
            isIndent
              ? "px-3 ml-3 border-l-2 border-transparent hover:border-border/50"
              : "px-3",
            isActive
              ? "bg-primary/10 text-primary font-medium border-l-primary"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          )}
        >
          <tool.icon
            size={16}
            className={cn(
              "shrink-0 mr-3 transition-colors",
              isActive ? "text-primary" : "text-muted-foreground/70"
            )}
          />
          <span className="truncate flex-1">{tool.title}</span>
          {tool.isNew && (
            <span className="shrink-0 text-[10px] uppercase font-bold text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">
              New
            </span>
          )}
        </div>
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        // ✅ Z-Index 50: สูงกว่า Header (40) และ Content
        "fixed left-0 top-0 z-50 h-screen border-r bg-background/95 backdrop-blur-xl flex flex-col transition-all duration-300 ease-in-out",
        "hidden md:flex",
        isOpen ? "w-72" : "w-[72px]",
        className
      )}
      {...props}
    >
      <div className="flex h-16 items-center justify-center px-4 shrink-0 border-b border-border/40">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 overflow-hidden",
            !isOpen && "justify-center"
          )}
        >
          <div className="flex h-9 w-9 min-w-[36px] items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shrink-0">
            <Box size={20} strokeWidth={2.5} />
          </div>
          <div
            className={cn(
              "flex flex-col transition-opacity duration-300",
              isOpen ? "opacity-100" : "opacity-0 w-0 hidden"
            )}
          >
            <span className="font-bold text-base leading-none tracking-tight">
              CodeXKit
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">
              Dev Tools
            </span>
          </div>
        </Link>
      </div>

      {/* ✅ ใช้ no-scrollbar เพื่อความ Minimal */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 no-scrollbar">
        <div className="space-y-6">
          {isMounted && favoriteToolsList.length > 0 && (
            <div className={cn(!isOpen && "border-b pb-4 mb-2")}>
              {isOpen && (
                <div className="px-3 mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">
                  <Star className="w-3 h-3 text-amber-500" /> Favorites
                </div>
              )}
              <div className="space-y-0.5">
                {favoriteToolsList.map((t) => renderToolItem(t, false))}
              </div>
            </div>
          )}

          {isMounted && recentToolsList.length > 0 && (
            <div className={cn(!isOpen && "border-b pb-4 mb-2")}>
              {isOpen && (
                <div className="px-3 mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">
                  <Clock className="w-3 h-3 text-blue-500" /> Recent
                </div>
              )}
              <div className="space-y-0.5">
                {recentToolsList.map((t) => renderToolItem(t, false))}
              </div>
            </div>
          )}

          <div>
            {toolCategories.map((category) => {
              const tools = groupedTools[category.id];
              if (!tools) return null;
              const isCollapsed = collapsedCategories[category.id];

              return (
                <div key={category.id} className="mb-3">
                  {isOpen ? (
                    <Button
                      variant="ghost"
                      className="w-full flex items-center justify-between h-8 px-3 hover:bg-transparent hover:text-foreground group mb-1"
                      onClick={() => toggleCategory(category.id)}
                    >
                      <span className="text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors uppercase tracking-widest">
                        {category.label}
                      </span>
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 text-muted-foreground/50 transition-transform duration-200",
                          !isCollapsed && "rotate-90 text-foreground"
                        )}
                      />
                    </Button>
                  ) : (
                    <div className="my-2 h-px bg-border/40 w-8 mx-auto" />
                  )}

                  <div
                    className={cn(
                      "transition-all duration-300 ease-in-out overflow-hidden",
                      isOpen
                        ? isCollapsed
                          ? "max-h-0 opacity-0"
                          : "max-h-[1000px] opacity-100"
                        : "opacity-100 max-h-full"
                    )}
                  >
                    <div className="pt-1 pb-1">
                      {tools.map((tool) => renderToolItem(tool, true))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-border/40 bg-background/50 backdrop-blur-sm shrink-0">
        <Button
          variant="ghost"
          size={isOpen ? "sm" : "icon"}
          onClick={toggle}
          className={cn(
            "w-full text-muted-foreground hover:text-foreground hover:bg-muted/50",
            !isOpen && "h-9 w-9 mx-auto"
          )}
        >
          {isOpen ? (
            <>
              <PanelLeftClose size={16} className="mr-2" />
              <span className="text-xs font-medium">Collapse</span>
            </>
          ) : (
            <PanelRightClose size={18} />
          )}
        </Button>
      </div>
    </aside>
  );
}
