"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { allTools, toolCategories } from "@/config/tools";
import { useFavorites } from "@/hooks/useFavorites";
import { useRecentTools } from "@/hooks/useRecentTools";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Command, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { favorites } = useFavorites();
  const { recents } = useRecentTools();

  // State สำหรับแก้ Hydration Error
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // --- Logic: Prepare Data ---

  // แปลง Favorites slug -> Tool Object
  const favoriteTools = isMounted
    ? allTools.filter((t) => favorites.includes(t.slug))
    : [];

  // แปลง Recents slug -> Tool Object
  const recentTools = isMounted
    ? (recents
        .map((slug) => allTools.find((t) => t.slug === slug))
        .filter((t) => t !== undefined) as typeof allTools)
    : [];

  const displayRecents = recentTools.slice(0, 4);

  // Group Tools ตาม Category (ใช้ allTools ตรงๆ เลย)
  const toolsByCategory = toolCategories.reduce((acc, category) => {
    // ใช้ allTools แทน filteredTools
    const tools = allTools.filter((tool) => tool.category === category.id);
    if (tools.length > 0) {
      acc[category.id] = tools;
    }
    return acc;
  }, {} as Record<string, typeof allTools>);

  // --- Reusable Component: Tool Card ---
  const ToolCard = ({
    tool,
    showFavoriteIcon = false,
  }: {
    tool: (typeof allTools)[0];
    showFavoriteIcon?: boolean;
  }) => (
    <Link
      href={`/tools/${tool.category}/${tool.slug}`}
      className="group block h-full relative"
    >
      {/* Glow Effect on Hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/30 to-purple-600/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md" />

      <Card className="h-full relative overflow-hidden border-border/50 bg-card/90 backdrop-blur-xl transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
              <tool.icon size={22} />
            </div>
            <div className="flex items-center gap-2">
              {showFavoriteIcon && (
                <Star
                  size={16}
                  className="text-amber-500 fill-amber-500 animate-in zoom-in"
                />
              )}
              {tool.isNew && (
                <Badge
                  variant="secondary"
                  className="bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-900/50 text-[10px] font-bold"
                >
                  NEW
                </Badge>
              )}
            </div>
          </div>
          <CardTitle className="text-base font-bold group-hover:text-primary transition-colors flex items-center gap-1">
            {tool.title}
            {/* Arrow moves on hover */}
            <ArrowRight
              size={14}
              className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-muted-foreground"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-2 text-sm leading-relaxed text-muted-foreground/80">
            {tool.description}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section (Redesigned with Wow Factor) */}
      <section className="relative py-20 md:py-24 overflow-hidden rounded-3xl bg-primary/5 border border-primary/10 mx-auto">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-5xl opacity-30 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/30 rounded-full blur-[80px] mix-blend-multiply dark:mix-blend-screen animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-primary/30 rounded-full blur-[80px] mix-blend-multiply dark:mix-blend-screen animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 text-center space-y-6 px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/50 backdrop-blur-md border border-border shadow-sm text-sm text-muted-foreground mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium">All-in-one Developer Workspace</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight lg:text-7xl bg-gradient-to-br from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100 pb-2">
            CodeXKit
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Master your workflow with our thoughtfully designed micro-tools.{" "}
            <br className="hidden sm:block" />
            Built for developers, by developers.
          </p>

          <div className="pt-8 animate-in fade-in slide-in-from-bottom-7 duration-700 delay-300">
            {/* Command Hint UI */}
            <div className="inline-flex items-center gap-3 text-sm text-muted-foreground bg-background/60 backdrop-blur border border-border/60 px-5 py-2.5 rounded-xl shadow-sm hover:bg-background/80 transition-colors cursor-default select-none">
              <Command size={16} />
              <span className="font-medium">Type to search...</span>
              <kbd className="pointer-events-none h-6 select-none items-center gap-1 rounded bg-muted px-2 font-mono text-[11px] font-bold text-muted-foreground opacity-100 flex border">
                <span>⌘</span>K
              </kbd>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access (Visual Upgrade) */}
      {isMounted && (favoriteTools.length > 0 || displayRecents.length > 0) && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Favorites */}
            {favoriteTools.length > 0 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                  <h3 className="font-semibold text-lg tracking-tight">
                    Favorites
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favoriteTools.map((tool) => (
                    <ToolCard
                      key={`fav-${tool.slug}`}
                      tool={tool}
                      showFavoriteIcon={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Recents */}
            {displayRecents.length > 0 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold text-lg tracking-tight">
                    Recently Used
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {displayRecents.map((tool) => (
                    <ToolCard key={`recent-${tool.slug}`} tool={tool} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Categories (Enhanced Headers) */}
      <div className="space-y-20">
        {/* Divider with Text */}
        {isMounted &&
          (favoriteTools.length > 0 || displayRecents.length > 0) && (
            <div className="flex items-center justify-center pt-4">
              <div className="h-px bg-border flex-1 max-w-[150px] bg-gradient-to-r from-transparent to-border" />
              <div className="px-6 py-2 rounded-full border bg-muted/30 text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Explore Library
              </div>
              <div className="h-px bg-border flex-1 max-w-[150px] bg-gradient-to-l from-transparent to-border" />
            </div>
          )}

        {toolCategories.map((category) => {
          const tools = toolsByCategory[category.id];
          if (!tools) return null;

          return (
            <section
              key={category.id}
              id={category.id}
              className="scroll-mt-24 space-y-8"
            >
              <div className="flex items-start md:items-center gap-5">
                <div
                  className={cn(
                    "flex items-center justify-center w-14 h-14 rounded-2xl shadow-sm shrink-0",
                    "bg-gradient-to-br from-card to-muted border border-border/60"
                  )}
                >
                  <category.icon className="h-7 w-7 text-foreground/80" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                    {category.label}
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {category.description ||
                      `Collection of useful ${category.label.toLowerCase()} tools.`}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {tools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
