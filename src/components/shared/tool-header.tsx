import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ToolHeaderProps {
  title: string;
  description: string;
  categoryLabel: string;
}

export function ToolHeader({
  title,
  description,
  categoryLabel,
}: ToolHeaderProps) {
  return (
    <div className="mb-8 space-y-4">
      {/* Breadcrumb / Back Navigation */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/">
          <Button variant="link" className="h-auto p-0 text-muted-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Home
          </Button>
        </Link>
        <span>/</span>
        <span>{categoryLabel}</span>
      </div>

      {/* Main Title Area */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="text-lg text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
