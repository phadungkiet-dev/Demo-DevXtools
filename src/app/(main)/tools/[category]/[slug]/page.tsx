// =============================================================================
// Imports
// =============================================================================
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

// Config & Data
import { getToolBySlug, toolCategories } from "@/config/tools";
import { toolRegistry } from "@/config/registries";

// Components
import { ToolHeader } from "@/components/shared/tool-header";
import { RecentToolTracker } from "@/components/tools/recent-tool-tracker";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, FileCode } from "lucide-react";

// =============================================================================
// Type Definitions (Next.js 15+ Async Params)
// =============================================================================
type PageProps = {
  params: Promise<{
    category: string;
    slug: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

// =============================================================================
// 1. Generate Metadata (Dynamic SEO)
// =============================================================================
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  // ⚠️ Next.js 15+: ต้อง await params ก่อนใช้งาน
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {
      title: "Tool Not Found",
      description: "The requested developer tool could not be found.",
    };
  }

  return {
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
    openGraph: {
      title: `${tool.title} - CodeXKit`,
      description: tool.description,
      type: "website",
      // images: [...] // สามารถเพิ่ม Dynamic OG Image ได้ที่นี่
    },
  };
}

// =============================================================================
// 2. Main Page Component
// =============================================================================
export default async function ToolPage({ params }: PageProps) {
  // ⚠️ Await Params (Critical for Next.js 15/16)
  const { category, slug } = await params;

  // Fetch Tool Data
  const tool = getToolBySlug(slug);

  // 🛡️ Validation:
  // 1. Tool ต้องมีอยู่จริง
  // 2. Category ใน URL ต้องตรงกับ Config (กัน Duplicate Content /tools/wrong-cat/slug)
  if (!tool || tool.category !== category) {
    notFound();
  }

  const categoryConfig = toolCategories.find((c) => c.id === tool.category);

  // 🏭 Registry Lookup: ค้นหา React Component จาก Config map
  const ToolComponent = toolRegistry[tool.slug];

  // ⚠️ Developer Error State:
  // กรณี Config มีข้อมูล Tool แต่ลืม map component ใน registries.tsx
  if (!ToolComponent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 animate-in fade-in zoom-in duration-500">
        <div className="bg-destructive/10 text-destructive p-4 rounded-full mb-4 ring-1 ring-destructive/20">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">
          Component Not Found
        </h2>
        {/* ✅ แก้ไข ESLint Error: hasn't -> hasn&apos;t */}
        <p className="text-muted-foreground max-w-md mb-6">
          The tool configuration exists, but the UI component hasn&apos;t been
          registered yet.
        </p>
        <div className="bg-muted/50 border border-border rounded-lg p-4 font-mono text-sm text-left w-full max-w-lg overflow-x-auto">
          <p className="text-muted-foreground mb-2 flex items-center gap-2">
            <FileCode size={14} /> Missing Registry Entry:
          </p>
          <div className="text-foreground">
            <span className="text-purple-500">const</span> toolRegistry = {"{"}
            <br />
            &nbsp;&nbsp;...
            <br />
            {/* ✅ แก้ไข ESLint Error: Quote ใน String */}
            &nbsp;&nbsp;
            <span className="text-green-500">
              &quot;{tool.slug}&quot;
            </span>: <span className="text-amber-500">YourComponent</span>,
            <br />
            {"}"};
          </div>
        </div>
      </div>
    );
  }

  return (
    // Layout Container
    // ใช้ max-w-[1600px] เพื่อให้ Tool ที่ซับซ้อน (Table/Diff) มีพื้นที่กว้างพอ
    <div className="w-full max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* 👻 Logic Tracker: บันทึกการใช้งานลง Recent (Client Component) */}
      <RecentToolTracker slug={tool.slug} />

      {/* Header Section */}
      <div className="space-y-6">
        <ToolHeader
          title={tool.title}
          description={tool.description}
          categoryLabel={categoryConfig?.label || tool.category}
          slug={tool.slug}
          icon={tool.icon} // ✅ ตอนนี้ ToolHeader รองรับ icon แล้ว Error จะหายไป
        />

        <Separator className="bg-border/60" />
      </div>

      {/* Workspace Area */}
      {/* min-h: กัน Layout Shift เวลา Component โหลด */}
      <section className="relative min-h-[500px] w-full">
        <ToolComponent />
      </section>
    </div>
  );
}
