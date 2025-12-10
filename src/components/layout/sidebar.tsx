"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { toolCategories, allTools } from "@/config/tools";
import { useSidebarStore } from "@/store/use-sidebar-store";
import {
  ChevronLeft,
  Menu,
  Box,
  Search,
  X,
  ChevronDown,
  ChevronRight,
  Star,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useFavorites } from "@/hooks/useFavorites";

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

export function Sidebar({ className, ...props }: SidebarProps) {
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebarStore();
  const { favorites } = useFavorites();

  // State เช็คว่าโหลด Client เสร็จหรือยัง (แก้ Hydration Error)
  const [isMounted, setIsMounted] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState<
    Record<string, boolean>
  >({});

  // Toggle การพับหมวดหมู่
  const toggleCategory = (id: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // ✅ 1. set isMounted เป็น true เมื่อ Component โหลดเสร็จ
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // ✅ แก้ไข Error: ใช้ setTimeout เพื่อหลีกเลี่ยง Synchronous setState ใน useEffect
  useEffect(() => {
    if (!isOpen) return;

    const activeTool = allTools.find(
      (t) => pathname === `/tools/${t.category}/${t.slug}`
    );

    if (activeTool) {
      const timer = setTimeout(() => {
        setCollapsedCategories((prev) => ({
          ...prev,
          [activeTool.category]: false, // บังคับเปิด Accordion ของ Tool ที่ใช้งานอยู่
        }));
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [pathname, isOpen]);

  // Logic 1: Filter Tools ตาม Search Query
  const filteredTools = useMemo(() => {
    if (!searchQuery) return allTools;
    return allTools.filter(
      (t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.keywords?.some((k) =>
          k.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [searchQuery]);

  const favoriteToolsList = useMemo(() => {
    return filteredTools.filter((t) => favorites.includes(t.slug));
  }, [filteredTools, favorites]);

  // Logic 2: Group Tools เข้าหมวดหมู่
  const groupedTools = useMemo(() => {
    const groups: Record<string, typeof allTools> = {};

    toolCategories.forEach((cat) => {
      const toolsInCat = filteredTools.filter((t) => t.category === cat.id);
      if (toolsInCat.length > 0) {
        groups[cat.id] = toolsInCat;
      }
    });

    return groups;
  }, [filteredTools]);

  // ฟังก์ชัน Helper สำหรับ Render ปุ่ม Tool
  const renderToolItem = (tool: (typeof allTools)[0]) => {
    const isActive = pathname === `/tools/${tool.category}/${tool.slug}`;
    return (
      <Link
        key={tool.slug}
        href={`/tools/${tool.category}/${tool.slug}`}
        className="block"
      >
        <Button
          variant={isActive ? "secondary" : "ghost"}
          size={isOpen ? "sm" : "icon"}
          className={cn(
            "w-full h-8",
            isOpen
              ? "justify-start px-2 ml-2 w-[calc(100%-0.5rem)]"
              : "justify-center mx-auto w-9 h-9 mb-1",
            isActive
              ? "bg-primary/10 text-primary hover:bg-primary/15 font-medium"
              : "text-muted-foreground hover:text-foreground",
            !isOpen &&
              isActive &&
              "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
          title={!isOpen ? tool.title : undefined}
        >
          <tool.icon size={16} className={cn("shrink-0", isOpen && "mr-2")} />
          {isOpen && (
            <>
              <span className="truncate text-sm">{tool.title}</span>
              {tool.isNew && (
                <span className="ml-auto text-[9px] bg-green-500/10 text-green-600 px-1 rounded-sm border border-green-500/20 font-bold">
                  N
                </span>
              )}
            </>
          )}
        </Button>
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300 ease-in-out flex flex-col",
        isOpen ? "w-64" : "w-16",
        className
      )}
      {...props}
    >
      {/* 1. Header / Logo Area */}
      <div className="flex h-16 items-center justify-between px-4 border-b shrink-0">
        <Link href="/" className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-8 w-8 min-w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Box size={20} strokeWidth={3} />
          </div>
          <span
            className={cn(
              "font-bold text-lg whitespace-nowrap transition-opacity duration-300",
              isOpen ? "opacity-100" : "opacity-0 w-0 hidden"
            )}
          >
            DevToolX
          </span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", !isOpen && "mx-auto")}
          onClick={toggle}
        >
          {isOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}
        </Button>
      </div>

      {/* 2. Search Area */}
      <div
        className={cn(
          "px-3 py-3 shrink-0",
          !isOpen && "px-2 flex justify-center"
        )}
      >
        {isOpen ? (
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9 text-sm bg-muted/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={toggle}
            title="Search"
          >
            <Search className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* 3. Navigation Links (Scrollable) */}
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 pb-4">
          {/* ✅ 2. เพิ่ม isMounted && เพื่อป้องกัน Hydration Error */}
          {isMounted && favoriteToolsList.length > 0 && (
            <div className="mb-2">
              {isOpen ? (
                <div className="flex items-center gap-2 px-2 py-2 mb-1 text-amber-500/80 font-semibold">
                  <Star className="h-4 w-4 fill-amber-500/20" />
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    Favorites
                  </span>
                </div>
              ) : (
                <div className="my-2 border-t border-dashed border-muted-foreground/20 mx-2" />
              )}

              <div className="space-y-0.5">
                {favoriteToolsList.map((tool) => renderToolItem(tool))}
              </div>

              {/* Separator ระหว่าง Favorites กับ Categories */}
              <div className="my-3 border-t border-border mx-2 opacity-50" />
            </div>
          )}

          {/* Existing Logic: Categories Loop */}
          {Object.keys(groupedTools).length === 0 &&
          // เพิ่ม isMounted เช็คตรงนี้ด้วยเพื่อความชัวร์ (ถ้ายังไม่ mount ก็อย่าเพิ่งบอกว่า empty)
          (isMounted ? favoriteToolsList.length === 0 : true) ? (
            <div
              className={cn(
                "text-xs text-muted-foreground text-center py-4",
                !isOpen && "hidden"
              )}
            >
              No tools found.
            </div>
          ) : (
            toolCategories.map((category) => {
              const tools = groupedTools[category.id];
              if (!tools) return null;

              const isCollapsed = collapsedCategories[category.id];

              return (
                <div key={category.id} className="mb-1">
                  {isOpen ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-between hover:bg-muted/50 mb-0.5 h-8 font-semibold text-muted-foreground hover:text-foreground px-2"
                      onClick={() => toggleCategory(category.id)}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <category.icon className="h-4 w-4 shrink-0" />
                        <span className="text-xs uppercase tracking-wider">
                          {category.label}
                        </span>
                      </div>
                      {isCollapsed ? (
                        <ChevronRight className="h-3 w-3 opacity-50" />
                      ) : (
                        <ChevronDown className="h-3 w-3 opacity-50" />
                      )}
                    </Button>
                  ) : (
                    <div className="my-2 border-t border-dashed border-muted-foreground/20 mx-2" />
                  )}

                  <div
                    className={cn(
                      "space-y-0.5 transition-all duration-200 ease-in-out",
                      isOpen && isCollapsed ? "hidden" : "block"
                    )}
                  >
                    {/* ใช้ Helper function แทนการเขียนซ้ำ */}
                    {tools.map((tool) => renderToolItem(tool))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* 4. Footer Area */}
      <div className="border-t p-4 mt-auto shrink-0 bg-background">
        <ThemeToggle isOpen={isOpen} />
      </div>
    </aside>
  );
}
