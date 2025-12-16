// ❌ ลบหรือ Comment บรรทัดนี้ออกครับ
// "use client";

// ✅ ส่วนที่เหลือเหมือนเดิมได้เลยครับ เพราะ Server Component
// สามารถ Import Client Component (FavoriteButton) มาแสดงผลได้ปกติครับ

import Link from "next/link";
import { ArrowLeft, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/tools/favorite-button";
import { cn } from "@/lib/utils";

interface ToolHeaderProps {
  title: string;
  description: string;
  categoryLabel: string;
  slug?: string;
  icon?: LucideIcon;
  className?: string;
}

export function ToolHeader({
  title,
  description,
  categoryLabel,
  slug,
  icon: Icon,
  className,
}: ToolHeaderProps) {
  return (
    <div
      className={cn(
        "mb-8 space-y-6 animate-in fade-in slide-in-from-top-2 duration-500",
        className
      )}
    >
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-sm text-muted-foreground"
      >
        <Button
          variant="link"
          className="h-auto p-0 text-muted-foreground hover:text-primary transition-colors font-medium group"
          asChild
        >
          <Link href="/" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </Button>
        <span aria-hidden="true" className="text-muted-foreground/40">
          /
        </span>
        <span className="font-medium text-foreground">{categoryLabel}</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-start gap-5 md:gap-8">
        {/* A. Icon Section (Desktop) */}
        {Icon && (
          <div className="hidden md:flex shrink-0 p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 text-primary shadow-sm">
            <Icon size={40} strokeWidth={1.5} />
          </div>
        )}

        {/* B. Text & Actions Section */}
        <div className="space-y-3 flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            {/* Title Wrapper */}
            <div className="flex items-center gap-3">
              {/* Mobile Icon */}
              {Icon && (
                <div className="md:hidden p-2.5 rounded-xl bg-primary/10 text-primary shrink-0 border border-primary/20">
                  <Icon size={24} />
                </div>
              )}

              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">
                {title}
              </h1>
            </div>

            {/* Favorite Button (Top Right Action) */}
            {slug && <FavoriteButton slug={slug} className="shrink-0 mt-1.5" />}
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
