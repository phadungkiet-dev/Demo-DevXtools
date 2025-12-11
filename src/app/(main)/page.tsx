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
import { Input } from "@/components/ui/input";
import { Search, Star, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const { favorites } = useFavorites();
  const { recents } = useRecentTools();

  // State สำหรับแก้ Hydration Error
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // --- Logic: Prepare Data ---

  // 1. แปลง Favorites slug -> Tool Object
  const favoriteTools = isMounted
    ? allTools.filter((t) => favorites.includes(t.slug))
    : [];

  // 2. แปลง Recents slug -> Tool Object
  const recentTools = isMounted
    ? (recents
        .map((slug) => allTools.find((t) => t.slug === slug))
        .filter((t) => t !== undefined) as typeof allTools)
    : [];

  // ตัดให้เหลือแค่ 4 อันล่าสุดเพื่อความสวยงาม
  const displayRecents = recentTools.slice(0, 4);

  // 3. Filter Tools ตาม Search Query (สำหรับ Main Grid)
  const filteredTools = allTools.filter((tool) => {
    const query = searchQuery.toLowerCase();
    return (
      tool.title.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.keywords?.some((k) => k.toLowerCase().includes(query))
    );
  });

  // 4. Group Tools ตาม Category
  const toolsByCategory = toolCategories.reduce((acc, category) => {
    const tools = filteredTools.filter((tool) => tool.category === category.id);
    if (tools.length > 0) {
      acc[category.id] = tools;
    }
    return acc;
  }, {} as Record<string, typeof allTools>);

  // --- Reusable Component: Tool Card (รักษา Design เดิมของคุณไว้) ---
  const ToolCard = ({
    tool,
    showFavoriteIcon = false,
  }: {
    tool: (typeof allTools)[0];
    showFavoriteIcon?: boolean;
  }) => (
    <Link
      href={`/tools/${tool.category}/${tool.slug}`}
      className="group block h-full"
    >
      <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-primary/50 cursor-pointer relative overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
              <tool.icon size={20} />
            </div>
            <div className="flex items-center gap-2">
              {/* แสดงดาวถ้าเป็น Favorite Card */}
              {showFavoriteIcon && (
                <Star size={16} className="text-amber-500 fill-amber-500" />
              )}

              {tool.isNew && (
                <Badge
                  variant="default"
                  className="bg-green-500 hover:bg-green-600 text-white text-[10px] px-1.5 py-0 h-5"
                >
                  NEW
                </Badge>
              )}
            </div>
          </div>
          <CardTitle className="text-lg group-hover:text-primary transition-colors">
            {tool.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-2 text-sm">
            {tool.description}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div className="space-y-10 pb-10">
      {/* 1. Hero Section */}
      <div className="space-y-6 text-center py-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          DevToolX
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your all-in-one developer toolbox. Thoughtfully designed micro-tools
          to speed up your workflow.
        </p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto relative mt-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Search for tools (e.g., json, password, color)..."
            className="pl-10 h-12 text-lg rounded-full shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 2. Quick Access Section (Favorites & Recents) */}
      {/* แสดงเฉพาะตอนที่โหลดเสร็จ + มีข้อมูล + ไม่ได้กำลัง Search */}
      {isMounted &&
        !searchQuery &&
        (favoriteTools.length > 0 || displayRecents.length > 0) && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 border-b pb-2 mb-6">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <h2 className="text-xl font-semibold tracking-tight">
                Quick Access
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Favorites Column */}
              {favoriteTools.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    <Star className="h-4 w-4 text-amber-500" /> Favorites
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

              {/* Recents Column */}
              {displayRecents.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    <Clock className="h-4 w-4 text-blue-500" /> Recently Used
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

      {/* 3. Main Tools Grid by Category */}
      <div className="space-y-12">
        {/* Header for All Tools (แสดงเมื่อมี Quick Access เพื่อแยกส่วนให้ชัดเจน) */}
        {isMounted &&
          !searchQuery &&
          (favoriteTools.length > 0 || displayRecents.length > 0) && (
            <div className="flex items-center gap-2 border-b pb-2 pt-4">
              <div className="p-1.5 bg-primary/10 rounded-md">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <h2 className="text-xl font-semibold tracking-tight">
                All Tools
              </h2>
            </div>
          )}

        {Object.keys(toolsByCategory).length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">
              No tools found matching &quot;{searchQuery}&quot;
            </p>
          </div>
        ) : (
          toolCategories.map((category) => {
            const tools = toolsByCategory[category.id];
            if (!tools) return null;

            return (
              <section
                key={category.id}
                className="space-y-6 scroll-mt-20"
                id={category.id}
              >
                <div className="flex items-center gap-3 border-b pb-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <category.icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    {category.label}
                  </h2>
                  <Badge variant="secondary" className="ml-auto">
                    {tools.length}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {tools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}
