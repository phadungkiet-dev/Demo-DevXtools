"use client";

// =============================================================================
// Imports
// =============================================================================
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
// Config & Types
import { toolCategories, allTools, ToolConfig } from "@/config/tools";
// Hooks
import { useFavorites } from "@/hooks/useFavorites";
import { useRecentTools } from "@/hooks/useRecentTools";
// UI Components
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
// Icons
import { Menu, Box, Star, Clock, ChevronRight, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

// =============================================================================
// Main Component
// =============================================================================
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { favorites } = useFavorites();
  const { recents } = useRecentTools();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  const favoriteToolsList = useMemo(() => {
    if (!isMounted) return [];
    return allTools.filter((t) => favorites.includes(t.slug));
  }, [isMounted, favorites]);

  const recentToolsList = useMemo(() => {
    if (!isMounted) return [];
    return recents
      .map((slug) => allTools.find((t) => t.slug === slug))
      .filter((t): t is ToolConfig => t !== undefined)
      .slice(0, 3); // ✅ LIMIT 3: ตัดเหลือแค่ 3 รายการสำหรับ Mobile
  }, [isMounted, recents]);

  if (!isMounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden -ml-2 text-muted-foreground"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden -ml-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[300px] sm:w-[320px] p-0 border-r-border/60 flex flex-col h-full bg-background/95 backdrop-blur-xl overflow-hidden"
      >
        {/* 1. Header (Fixed) */}
        <SheetHeader className="px-6 py-4 border-b border-border/40 text-left shrink-0">
          <Link
            href="/"
            className="flex items-center gap-3 group"
            onClick={() => setOpen(false)}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Box size={20} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <SheetTitle className="font-bold text-lg leading-none tracking-tight group-hover:text-primary transition-colors">
                CodeXKit
              </SheetTitle>
              <span className="text-[10px] text-muted-foreground font-medium mt-1">
                Mobile Navigation
              </span>
            </div>
          </Link>
        </SheetHeader>

        {/* 2. Scrollable Content Area */}
        <div className="flex-1 min-h-0 w-full">
          <ScrollArea className="h-full w-full">
            {/* ✅ แก้ไข: ปรับ pb-20 เป็น pb-6 เพราะไม่มี Footer แล้ว */}
            <div className="flex flex-col gap-6 p-4 pb-6">
              {/* Favorites */}
              {favoriteToolsList.length > 0 && (
                <div className="space-y-1">
                  <SectionHeader
                    icon={Star}
                    label="Favorites"
                    colorClass="text-amber-500"
                  />
                  <div className="grid gap-1">
                    {favoriteToolsList.map((tool) => (
                      <MobileLink
                        key={tool.slug}
                        href={`/tools/${tool.category}/${tool.slug}`}
                        pathname={pathname}
                        icon={tool.icon}
                        isNew={tool.isNew}
                      >
                        {tool.title}
                      </MobileLink>
                    ))}
                  </div>
                </div>
              )}

              {/* Recents */}
              {recentToolsList.length > 0 && (
                <div className="space-y-1">
                  <SectionHeader
                    icon={Clock}
                    label="Recently Used"
                    colorClass="text-blue-500"
                  />
                  <div className="grid gap-1">
                    {recentToolsList.map((tool) => (
                      <MobileLink
                        key={tool.slug}
                        href={`/tools/${tool.category}/${tool.slug}`}
                        pathname={pathname}
                        icon={tool.icon}
                        isNew={tool.isNew}
                      >
                        {tool.title}
                      </MobileLink>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              <div className="space-y-6">
                {(favoriteToolsList.length > 0 ||
                  recentToolsList.length > 0) && (
                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border/40" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground/50 font-bold tracking-widest flex items-center gap-1">
                        <LayoutGrid size={10} /> Library
                      </span>
                    </div>
                  </div>
                )}

                {toolCategories.map((category) => {
                  const tools = allTools.filter(
                    (t) => t.category === category.id
                  );
                  if (!tools.length) return null;

                  return (
                    <div key={category.id} className="space-y-1">
                      <h4 className="px-2 mb-2 font-bold text-xs uppercase text-muted-foreground/60 tracking-widest">
                        {category.label}
                      </h4>
                      <div className="grid gap-1">
                        {tools.map((tool) => (
                          <MobileLink
                            key={tool.slug}
                            href={`/tools/${tool.category}/${tool.slug}`}
                            pathname={pathname}
                            icon={tool.icon}
                            isNew={tool.isNew}
                          >
                            {tool.title}
                          </MobileLink>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* ❌ ลบ Footer (Theme Toggle) ออกแล้ว */}
      </SheetContent>
    </Sheet>
  );
}

// ... Helper Components (เหมือนเดิม) ...
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
    <h4
      className={cn(
        "px-2 mb-2 font-medium text-xs uppercase tracking-wider flex items-center gap-2",
        colorClass
      )}
    >
      <Icon className="w-3 h-3" /> {label}
    </h4>
  );
}

interface MobileLinkProps {
  children: React.ReactNode;
  href: string;
  pathname: string;
  icon?: React.ElementType;
  isNew?: boolean;
}

function MobileLink({
  children,
  href,
  pathname,
  icon: Icon,
  isNew,
}: MobileLinkProps) {
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "group relative grid grid-cols-[auto_1fr_auto] items-center gap-3 p-2 rounded-lg transition-all text-sm outline-none",
        isActive
          ? "bg-primary/10 text-primary font-medium shadow-sm"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center w-6 h-6 rounded-md transition-colors",
          isActive
            ? "bg-primary/10 text-primary"
            : "bg-transparent text-muted-foreground/70 group-hover:text-foreground"
        )}
      >
        {Icon && <Icon className="h-4 w-4" />}
      </div>
      <span className="truncate">{children}</span>
      <div className="flex items-center justify-end">
        {isNew ? (
          <span className="text-[9px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-1.5 py-0.5 rounded-full font-bold">
            NEW
          </span>
        ) : (
          !isActive && (
            <ChevronRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-muted-foreground/50" />
          )
        )}
      </div>
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-r-full" />
      )}
    </Link>
  );
}
