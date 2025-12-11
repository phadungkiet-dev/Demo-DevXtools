import { Metadata } from "next"; // ✅ Import Metadata
import { notFound } from "next/navigation";
import { getToolBySlug, toolCategories } from "@/config/tools";
import { ToolHeader } from "@/components/shared/tool-header";
import { Separator } from "@/components/ui/separator";
import { RecentToolTracker } from "@/components/tools/recent-tool-tracker"; // ✅ Import ตัวช่วยเก็บ History
import { toolRegistry } from "@/config/registries";

interface PageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {
      title: "Tool Not Found",
    };
  }

  return {
    title: tool.title, // จะไปรวมกับ Template ใน layout.tsx เป็น "Tool Name | DevToolX"
    description: tool.description,
    keywords: tool.keywords,
    openGraph: {
      title: tool.title,
      description: tool.description,
      type: "website",
    },
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { category, slug } = await params;
  const tool = getToolBySlug(slug);

  // 1. Validation
  if (!tool || tool.category !== category) {
    notFound();
  }

  const categoryConfig = toolCategories.find((c) => c.id === tool.category);

  const ToolComponent = toolRegistry[tool.slug];

  if (!ToolComponent) {
    return (
      <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
        <p>
          Component not found for slug:{" "}
          <span className="font-mono text-primary">{tool.slug}</span>
        </p>
        <p className="text-sm mt-2 text-muted-foreground/60">
          Please add the component to{" "}
          <code>src/config/registries/{tool.category}.ts</code>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Tracker Component */}
      <RecentToolTracker slug={tool.slug} />

      <ToolHeader
        title={tool.title}
        description={tool.description}
        categoryLabel={categoryConfig?.label || tool.category}
        slug={tool.slug}
      />

      <Separator className="my-6" />

      <div className="min-h-[400px]">
        {/* Render Component */}
        <ToolComponent />
      </div>
    </div>
  );
}
