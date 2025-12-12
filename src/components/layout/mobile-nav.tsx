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
} from "@/components/ui/sheet"; // เพิ่ม SheetTitle เพื่อ accessibility
import { toolCategories, allTools } from "@/config/tools";
import { Menu, Box, Star, Clock } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useRecentTools } from "@/hooks/useRecentTools";
import { ThemeToggle } from "./theme-toggle";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { favorites } = useFavorites();
  const { recents } = useRecentTools();
  const [isMounted, setIsMounted] = useState(false);

  // Fix: setState in useEffect
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Fix: setState in useEffect (Close menu on route change)
  useEffect(() => {
    const timer = setTimeout(() => setOpen(false), 0);
    return () => clearTimeout(timer);
  }, [pathname]);

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
        className="w-[300px] sm:w-[350px] pr-0 pl-0 border-r-border/60"
      >
        <div className="px-6 py-4 border-b flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Box size={20} strokeWidth={3} />
          </div>
          <SheetTitle className="font-bold text-lg">CodeXKit</SheetTitle>
        </div>

        <ScrollArea className="h-[calc(100vh-8rem)] px-6 py-4">
          <div className="space-y-6">
            {/* Favorites */}
            {isMounted && favoriteToolsList.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-xs uppercase text-amber-500/80 tracking-wider flex items-center gap-2">
                  <Star className="w-3 h-3" /> Favorites
                </h4>
                {favoriteToolsList.map((tool) => (
                  <MobileLink
                    key={tool.slug}
                    href={`/tools/${tool.category}/${tool.slug}`}
                    pathname={pathname}
                  >
                    <tool.icon className="mr-2 h-4 w-4" /> {tool.title}
                  </MobileLink>
                ))}
              </div>
            )}

            {/* Recents */}
            {isMounted && recentToolsList.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-xs uppercase text-blue-500/80 tracking-wider flex items-center gap-2">
                  <Clock className="w-3 h-3" /> Recent
                </h4>
                {recentToolsList.map((tool) => (
                  <MobileLink
                    key={tool.slug}
                    href={`/tools/${tool.category}/${tool.slug}`}
                    pathname={pathname}
                  >
                    <tool.icon className="mr-2 h-4 w-4" /> {tool.title}
                  </MobileLink>
                ))}
              </div>
            )}

            {/* Categories */}
            <div className="space-y-4">
              {toolCategories.map((category) => {
                const tools = allTools.filter(
                  (t) => t.category === category.id
                );
                if (!tools.length) return null;
                return (
                  <div key={category.id}>
                    <h4 className="font-bold text-sm mb-2 text-foreground/80">
                      {category.label}
                    </h4>
                    <div className="grid gap-1 pl-3 border-l-2 border-muted">
                      {tools.map((tool) => (
                        <MobileLink
                          key={tool.slug}
                          href={`/tools/${tool.category}/${tool.slug}`}
                          pathname={pathname}
                        >
                          {tool.title}
                          {tool.isNew && (
                            <span className="ml-auto text-[9px] bg-green-500/20 text-green-600 px-1 rounded">
                              NEW
                            </span>
                          )}
                        </MobileLink>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollArea>
        <div className="absolute bottom-0 left-0 w-full border-t p-4 bg-background/50 backdrop-blur">
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
}: {
  children: React.ReactNode;
  href: string;
  pathname: string;
  className?: string;
}) {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center p-2 rounded-md transition-colors text-sm",
        isActive
          ? "text-primary font-medium bg-primary/10"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {children}
    </Link>
  );
}
