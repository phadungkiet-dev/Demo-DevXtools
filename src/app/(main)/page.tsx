import Link from "next/link";
import { toolCategories, getToolsByCategory } from "@/config/tools";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  return (
    <div className="space-y-10 pb-10">
      {/* Hero Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          DevToolX <span className="text-primary">.</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Your all-in-one developer toolbox. Thoughtfully designed micro-tools
          to speed up your workflow.
        </p>
      </div>

      {/* Tools Grid by Category */}
      <div className="space-y-12">
        {toolCategories.map((category) => {
          const tools = getToolsByCategory(category.id);
          if (tools.length === 0) return null;

          return (
            <div key={category.id} className="space-y-6">
              <div className="flex items-center gap-2 border-b pb-2">
                <category.icon className="h-6 w-6 text-muted-foreground" />
                <h2 className="text-2xl font-semibold tracking-tight">
                  {category.label}
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {tools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.category}/${tool.slug}`}
                    className="group block h-full"
                  >
                    <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-primary/50 cursor-pointer relative overflow-hidden">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <tool.icon size={24} />
                          </div>
                          {tool.isNew && (
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-700 hover:bg-green-100"
                            >
                              New
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="group-hover:text-primary transition-colors">
                          {tool.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {tool.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
