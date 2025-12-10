"use client";

import { useState } from "react";
import Link from "next/link";
import { allTools, toolCategories } from "@/config/tools";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter tools based on search query
  const filteredTools = allTools.filter((tool) => {
    const query = searchQuery.toLowerCase();
    return (
      tool.title.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.keywords?.some((k) => k.toLowerCase().includes(query))
    );
  });

  // Group filtered tools by category
  const toolsByCategory = toolCategories.reduce((acc, category) => {
    const tools = filteredTools.filter((tool) => tool.category === category.id);
    if (tools.length > 0) {
      acc[category.id] = tools;
    }
    return acc;
  }, {} as Record<string, typeof allTools>);

  return (
    <div className="space-y-10 pb-10">
      {/* Hero Section */}
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

      {/* Tools Grid by Category */}
      <div className="space-y-12">
        {Object.keys(toolsByCategory).length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">
              No tools found matching &quot;{searchQuery}&quot;
            </p>
          </div>
        ) : (
          toolCategories.map((category) => {
            const tools = toolsByCategory[category.id];
            // ถ้าไม่มี tools ในหมวดนี้ (หลัง filter) ก็ข้ามไป
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
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.category}/${tool.slug}`}
                      className="group block h-full"
                    >
                      <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-primary/50 cursor-pointer relative overflow-hidden bg-card/50 backdrop-blur-sm">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between mb-2">
                            <div className="p-2 rounded-lg bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                              <tool.icon size={20} />
                            </div>
                            {tool.isNew && (
                              <Badge
                                variant="default"
                                className="bg-green-500 hover:bg-green-600 text-white text-[10px] px-1.5 py-0 h-5"
                              >
                                NEW
                              </Badge>
                            )}
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
