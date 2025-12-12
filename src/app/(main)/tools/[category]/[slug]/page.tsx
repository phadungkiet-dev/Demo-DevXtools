import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolBySlug, toolCategories } from "@/config/tools";
import { ToolHeader } from "@/components/shared/tool-header";
import { Separator } from "@/components/ui/separator";
import { RecentToolTracker } from "@/components/tools/recent-tool-tracker";
import { toolRegistry } from "@/config/registries";

type PageProps = {
  params: Promise<{
    category: string;
    slug: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Generate Metadata (SEO)
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
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
    openGraph: {
      title: tool.title,
      description: tool.description,
      type: "website",
    },
  };
}

// Main Page Component
export default async function ToolPage({ params }: PageProps) {
  const { category, slug } = await params;
  const tool = getToolBySlug(slug);

  // Validation: ตรวจสอบว่า Slug และ Category ตรงกันจริงไหม
  if (!tool || tool.category !== category) {
    notFound();
  }

  const categoryConfig = toolCategories.find((c) => c.id === tool.category);

  // Registry Lookup: ค้นหา Component จาก Config
  const ToolComponent = toolRegistry[tool.slug];

  // Error State: แจ้งเตือนเมื่อลืม Map Component
  if (!ToolComponent) {
    return (
      <div className="container max-w-5xl mx-auto px-4 py-12">
        <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-xl bg-muted/30">
          <p className="text-lg font-medium text-foreground">
            Component not found for slug:{" "}
            <span className="font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
              {tool.slug}
            </span>
          </p>
          <p className="text-sm mt-3 text-muted-foreground/80">
            Please register the component in{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
              src/config/registries.tsx
            </code>
          </p>
        </div>
      </div>
    );
  }

  return (
    // Responsive Layout:
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Logic: Track Usage (Invisible) */}
      <RecentToolTracker slug={tool.slug} />

      {/* Header Section */}
      <ToolHeader
        title={tool.title}
        description={tool.description}
        categoryLabel={categoryConfig?.label || tool.category}
        slug={tool.slug}
      />

      <Separator className="my-6" />

      {/* Tool Workspace Area */}
      {/* min-h: กันหน้ายุบตอนโหลด Component */}
      <div className="min-h-[400px] w-full">
        <ToolComponent />
      </div>
    </div>
  );
}
