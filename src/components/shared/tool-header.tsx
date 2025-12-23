// =============================================================================
// Imports
// =============================================================================
import Link from "next/link";
import { ArrowLeft, LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/tools/favorite-button";
import { cn } from "@/lib/utils";

// =============================================================================
// Type Definitions
// =============================================================================
interface ToolHeaderProps {
  /** ชื่อหลักของเครื่องมือ (H1) */
  title: string;

  /** คำอธิบายการใช้งานสั้นๆ */
  description: string;

  /** ชื่อหมวดหมู่ที่จะแสดงใน Breadcrumb */
  categoryLabel: string;

  /** รหัสเครื่องมือ (Slug) ใช้สำหรับเก็บ Favorite (ถ้าไม่ส่งมาจะไม่แสดงปุ่มดาว) */
  slug?: string;

  /** ไอคอนประจำเครื่องมือ (Lucide React Component) */
  icon?: LucideIcon;

  /** Custom CSS Class */
  className?: string;
}

// =============================================================================
// Component
// =============================================================================
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
        // Layout & Spacing
        "mb-8 space-y-6",
        // Animation: Fade-in & Slide-down นุ่มนวลเมื่อเข้าหน้าเว็บ
        "animate-in fade-in slide-in-from-top-2 duration-500",
        className
      )}
    >
      {/* Breadcrumb Navigation */}
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
            {/* Responsive Text Logic:
                - Mobile: แสดงแค่ "Back" ประหยัดที่
                - Desktop: แสดง "Back to Home" เต็มยศ
            */}
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </Button>

        <span
          aria-hidden="true"
          className="text-muted-foreground/40 select-none"
        >
          /
        </span>

        <span className="font-medium text-foreground">{categoryLabel}</span>
      </nav>

      {/* Main Header Content (Icon + Title + Actions) */}
      <div className="flex flex-col md:flex-row md:items-start gap-5 md:gap-8">
        {/* Desktop Icon: กล่องใหญ่ด้านซ้าย (แสดงเฉพาะจอ MD ขึ้นไป) */}
        {Icon && (
          <div className="hidden md:flex shrink-0 p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 text-primary shadow-sm">
            <Icon size={40} strokeWidth={1.5} />
          </div>
        )}

        {/* Text & Actions Area */}
        <div className="space-y-3 flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            {/* Title Wrapper */}
            <div className="flex items-center gap-3">
              {/* Mobile Icon: กล่องเล็กข้างชื่อ (แสดงเฉพาะจอ Mobile) */}
              {Icon && (
                <div className="md:hidden p-2.5 rounded-xl bg-primary/10 text-primary shrink-0 border border-primary/20">
                  <Icon size={24} />
                </div>
              )}

              {/* H1 Title */}
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">
                {title}
              </h1>
            </div>

            {/* Favorite Button (Optional)
                - shrink-0: ป้องกันปุ่มหดตัว
                - mt-1: ปรับตำแหน่งแนวตั้งให้ตรงกับ Optical Center ของ Font H1
            */}
            {slug && (
              <FavoriteButton slug={slug} className="shrink-0 mt-1 md:mt-2" />
            )}
          </div>

          {/* Description Text */}
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
