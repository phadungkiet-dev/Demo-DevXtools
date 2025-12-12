"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { toolCategories, allTools } from "@/config/tools";
import { Menu, Box, Star, Clock, ChevronRight } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useRecentTools } from "@/hooks/useRecentTools";
import { ThemeToggle } from "./theme-toggle";

export function MobileNav() {
  const [open, setOpen] = useState(false); // ควบคุมการเปิด/ปิด Sheet
  const pathname = usePathname();
  const { favorites } = useFavorites();
  const { recents } = useRecentTools();
  const [isMounted, setIsMounted] = useState(false); // ป้องกัน Hydration Error

  // Mount Effect: ป้องกัน UI กระพริบจากการ render ฝั่ง Server vs Client ไม่ตรงกัน
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Auto-Close Effect: ปิดเมนูทันทีเมื่อเปลี่ยนหน้า (pathname เปลี่ยน)
  useEffect(() => {
    const timer = setTimeout(() => setOpen(false), 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  // กรองข้อมูล Tools ตาม Favorites และ Recents เหมือน Sidebar เพื่อ Consistency
  const favoriteToolsList = allTools.filter((t) => favorites.includes(t.slug));
  const recentToolsList = recents
    .map((slug) => allTools.find((t) => t.slug === slug))
    .filter((t) => t !== undefined) as typeof allTools;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden -ml-2 text-muted-foreground hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[300px] sm:w-[320px] pr-0 pl-0 border-r-border/60 p-0"
      >
        <SheetHeader className="px-6 py-4 border-b border-border/40 text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Box size={18} strokeWidth={3} />
            </div>
            <SheetTitle className="font-bold text-lg tracking-tight">
              CodeXKit
            </SheetTitle>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-8rem)] px-4 py-4 w-full">
          <div className="space-y-6 pb-8 w-full">
            {/* Favorites */}
            {isMounted && favoriteToolsList.length > 0 && (
              <div className="space-y-1">
                <h4 className="px-2 mb-2 font-medium text-xs uppercase text-amber-500/80 tracking-wider flex items-center gap-2">
                  <Star className="w-3 h-3" /> Favorites
                </h4>
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
            )}

            {/* Recents */}
            {isMounted && recentToolsList.length > 0 && (
              <div className="space-y-1">
                <h4 className="px-2 mb-2 font-medium text-xs uppercase text-blue-500/80 tracking-wider flex items-center gap-2">
                  <Clock className="w-3 h-3" /> Recent
                </h4>
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
            )}

            {/* Categories */}
            <div className="space-y-6 w-full">
              {toolCategories.map((category) => {
                const tools = allTools.filter(
                  (t) => t.category === category.id
                );
                if (!tools.length) return null;
                return (
                  <div key={category.id} className="w-full">
                    <h4 className="px-2 font-bold text-xs uppercase text-muted-foreground/60 mb-2 tracking-widest">
                      {category.label}
                    </h4>
                    <div className="grid gap-1 w-full">
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
        <div className="absolute bottom-0 left-0 w-full border-t border-border/40 p-4 bg-background/50 backdrop-blur flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Theme Settings</span>
          <ThemeToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MobileLink({
  children,
  href,
  pathname,
  className,
  icon: Icon,
  isNew, // ✅ รับ Prop
}: {
  children: React.ReactNode;
  href: string;
  pathname: string;
  className?: string;
  icon?: React.ElementType;
  isNew?: boolean; // ✅ Type Definition
}) {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        "grid grid-cols-[auto_1fr_auto] items-center gap-3 p-2 rounded-lg transition-all text-sm group w-full",
        isActive
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
        className
      )}
    >
      {/* Col 1: Icon */}
      {Icon && (
        <Icon
          className={cn(
            "h-4 w-4 shrink-0",
            isActive
              ? "text-primary"
              : "text-muted-foreground/70 group-hover:text-foreground"
          )}
        />
      )}

      {/* Col 2: Text (Truncate ทำงานสมบูรณ์) */}
      <span className="truncate min-w-0 text-left">{children}</span>

      {/* Col 3: Badge หรือ Chevron (ดันขวาสุดเสมอ) */}
      <div className="flex items-center justify-end min-w-[24px]">
        {isNew ? (
          <span className="text-[9px] bg-emerald-500/20 text-emerald-600 px-1.5 py-0.5 rounded-full font-bold">
            NEW
          </span>
        ) : (
          !isActive && (
            <ChevronRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-muted-foreground/50 shrink-0" />
          )
        )}
      </div>
    </Link>
  );
}
