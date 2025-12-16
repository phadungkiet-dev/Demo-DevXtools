"use client";

// =============================================================================
// Imports
// =============================================================================
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
// Config & Types
import { allTools, toolCategories, ToolConfig } from "@/config/tools";
// Hooks
import { useFavorites } from "@/hooks/useFavorites";
import { useRecentTools } from "@/hooks/useRecentTools";
// UI Components
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/tools/favorite-button";
// Icons
import {
  Star,
  Clock,
  ArrowRight,
  Search,
  LayoutGrid,
  AlertTriangle, // ✅ เพิ่ม Icon แจ้งเตือน
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

// =============================================================================
// Main Component: Dashboard
// =============================================================================
export default function Dashboard() {
  const { favorites } = useFavorites();
  const { recents } = useRecentTools();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // --- Logic ---
  const favoriteTools = useMemo(() => {
    if (!isMounted) return [];
    return allTools.filter((t) => favorites.includes(t.slug));
  }, [isMounted, favorites]);

  const recentTools = useMemo(() => {
    if (!isMounted) return [];
    return recents
      .map((slug) => allTools.find((t) => t.slug === slug))
      .filter((t): t is ToolConfig => t !== undefined)
      .slice(0, 4);
  }, [isMounted, recents]);

  const toolsByCategory = useMemo(() => {
    return toolCategories.reduce((acc, category) => {
      const tools = allTools.filter((tool) => tool.category === category.id);
      if (tools.length > 0) acc[category.id] = tools;
      return acc;
    }, {} as Record<string, ToolConfig[]>);
  }, []);

  return (
    <div className="space-y-16 pb-20 animate-in fade-in duration-700">
      {/* ========================================================================
        ⚠️ DISCLAIMER BANNER (NEW)
        แจ้งเตือนว่าเป็นเว็บทดลอง เพื่อลดความคาดหวังเรื่อง SLA/Uptime
        ========================================================================
      */}
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex items-start gap-4 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10 text-amber-900 dark:text-amber-200 shadow-sm">
          <div className="p-2 shrink-0 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <AlertTriangle size={20} />
          </div>
          <div className="space-y-1 text-sm">
            <h3 className="font-bold flex items-center gap-2">
              Demo Project / Portfolio Showcase
            </h3>
            <p className="text-muted-foreground/80 leading-relaxed">
              This website is created for demonstration and portfolio purposes
              only.
              <span className="block mt-1 text-amber-700 dark:text-amber-400/90 font-medium">
                * Services may be modified, suspended for maintenance, or
                discontinued at any time without prior notice.
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ================= HERO SECTION ================= */}
      <section className="relative py-20 md:py-28 overflow-hidden rounded-3xl bg-gradient-to-b from-primary/5 to-transparent border border-primary/10 mx-auto shadow-sm">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] opacity-50 mix-blend-multiply dark:mix-blend-screen animate-pulse" />
          <div className="absolute top-1/2 -right-24 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px] opacity-50 mix-blend-multiply dark:mix-blend-screen animate-pulse delay-1000" />
        </div>
        <div className="relative z-10 text-center space-y-6 px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-sm text-xs font-medium text-muted-foreground mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>All-in-one Developer Workspace</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight bg-gradient-to-br from-foreground via-foreground to-muted-foreground/70 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100 pb-2 drop-shadow-sm">
            CodeXKit
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Boost your productivity with our suite of thoughtfully designed
            micro-tools.
            <br className="hidden sm:block" />
            Simple, fast, and built for developers.
          </p>
          <div className="pt-8 animate-in fade-in slide-in-from-bottom-7 duration-700 delay-300">
            <button
              className="group inline-flex items-center gap-3 text-sm text-muted-foreground bg-background/60 backdrop-blur-md border border-border/60 px-6 py-3 rounded-2xl shadow-sm hover:bg-background/90 hover:shadow-md transition-all cursor-default w-full max-w-md justify-between"
              onClick={() =>
                document.dispatchEvent(
                  new KeyboardEvent("keydown", { key: "k", metaKey: true })
                )
              }
            >
              <div className="flex items-center gap-3">
                <Search
                  size={16}
                  className="group-hover:text-primary transition-colors"
                />
                <span className="font-medium">Type to search tools...</span>
              </div>
              <kbd className="pointer-events-none h-6 select-none items-center gap-1 rounded bg-muted px-2 font-mono text-[11px] font-bold text-muted-foreground opacity-100 flex border">
                <span>⌘</span>K
              </kbd>
            </button>
          </div>
        </div>
      </section>

      {/* ================= QUICK ACCESS SECTION ================= */}
      {isMounted && (favoriteTools.length > 0 || recentTools.length > 0) && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
            {favoriteTools.length > 0 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                  <h3 className="font-bold text-lg tracking-tight">
                    Favorites
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favoriteTools.map((tool) => (
                    <ToolCard
                      key={`fav-${tool.slug}`}
                      tool={tool}
                      isFavorite={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {recentTools.length > 0 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <h3 className="font-bold text-lg tracking-tight">
                    Recently Used
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recentTools.map((tool) => (
                    <ToolCard
                      key={`recent-${tool.slug}`}
                      tool={tool}
                      isFavorite={favorites.includes(tool.slug)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= EXPLORE LIBRARY (Categories) ================= */}
      <div className="space-y-24">
        {isMounted && (favoriteTools.length > 0 || recentTools.length > 0) && (
          <div className="relative flex items-center justify-center py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/60" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 text-muted-foreground font-bold tracking-widest flex items-center gap-2">
                <LayoutGrid size={14} /> Explore Library
              </span>
            </div>
          </div>
        )}

        {toolCategories.map((category) => {
          const tools = toolsByCategory[category.id as string];
          if (!tools) return null;

          return (
            <section
              key={category.id}
              id={category.id}
              className="scroll-mt-28 space-y-8"
            >
              <div className="flex items-start md:items-center gap-5 group">
                <div
                  className={cn(
                    "flex items-center justify-center w-14 h-14 rounded-2xl shadow-sm shrink-0 transition-transform group-hover:scale-105 duration-300",
                    "bg-gradient-to-br from-muted to-card border border-border/60"
                  )}
                >
                  <category.icon className="h-7 w-7 text-foreground/70 group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                    {category.label}
                  </h2>
                  <p className="text-muted-foreground mt-1 text-base">
                    {category.description ||
                      `Collection of ${category.label.toLowerCase()} tools.`}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {tools.map((tool) => (
                  <ToolCard
                    key={tool.slug}
                    tool={tool}
                    isFavorite={favorites.includes(tool.slug)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================================
// Helper Component: Tool Card (UX Fixed)
// =============================================================================
interface ToolCardProps {
  tool: ToolConfig;
  isFavorite: boolean;
}

function ToolCard({ tool, isFavorite }: ToolCardProps) {
  return (
    <div className="group relative h-full">
      {/* UX Logic for Star Visibility:
         - Mobile: Always Visible (opacity-100)
         - Desktop: Visible only on Hover (lg:opacity-0 lg:group-hover:opacity-100)
         - BUT if isFavorite=true: Always Visible everywhere (opacity-100)
      */}
      <div
        className={cn(
          "absolute top-3 right-3 z-20 transition-opacity duration-300",
          isFavorite
            ? "opacity-100"
            : "opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
        )}
      >
        <FavoriteButton
          slug={tool.slug}
          className="bg-background/80 backdrop-blur-sm shadow-sm border border-border/50 hover:bg-background"
        />
      </div>

      <Link
        href={`/tools/${tool.category}/${tool.slug}`}
        className="block h-full outline-none rounded-xl"
      >
        <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/40 to-purple-600/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md pointer-events-none" />
        <Card className="h-full relative overflow-hidden border-border/60 bg-card/50 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:bg-card/80 group-focus-visible:ring-2 group-focus-visible:ring-primary/50">
          <CardHeader className="pb-3 pt-5 px-5">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 shadow-sm">
                <tool.icon size={20} />
              </div>
              {tool.isNew && (
                <Badge
                  variant="secondary"
                  className="bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-900/50 text-[10px] font-bold px-1.5 h-5 mr-8"
                >
                  NEW
                </Badge>
              )}
            </div>
            <CardTitle className="text-base font-bold group-hover:text-primary transition-colors flex items-center gap-1">
              {tool.title}
              <ArrowRight
                size={14}
                className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary"
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <CardDescription className="line-clamp-2 text-sm leading-relaxed text-muted-foreground/90">
              {tool.description}
            </CardDescription>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
