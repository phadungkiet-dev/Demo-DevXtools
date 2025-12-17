// =============================================================================
// Imports
// =============================================================================
import Link from "next/link";
import { ArrowLeft, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/tools/favorite-button";
import { cn } from "@/lib/utils";

// =============================================================================
// Interfaces
// =============================================================================
interface ToolHeaderProps {
  /** ชื่อเครื่องมือ (Title) */
  title: string;

  /** คำอธิบายสั้นๆ (Description) */
  description: string;

  /** หมวดหมู่ของเครื่องมือ (เช่น Text Tools, Image Tools) */
  categoryLabel: string;

  /** Slug ของเครื่องมือ (ใช้สำหรับระบบ Favorite) */
  slug?: string;

  /** Icon Component จาก Lucide React */
  icon?: LucideIcon;

  /** Class เพิ่มเติมสำหรับปรับแต่ง Container */
  className?: string;
}

// =============================================================================
// Component: ToolHeader
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
        // Animation: Fade-in & Slide-down เมื่อเข้าหน้าเว็บ
        "mb-8 space-y-6 animate-in fade-in slide-in-from-top-2 duration-500",
        className
      )}
    >
      {/* ---------------------------------------------------------------------------
          1. Breadcrumb Navigation
      --------------------------------------------------------------------------- */}
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
            {/* Responsive Text: ซ่อน "to Home" บนมือถือเพื่อประหยัดพื้นที่ */}
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

      {/* ---------------------------------------------------------------------------
          2. Header Content Area
      --------------------------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-start gap-5 md:gap-8">
        {/* [A] Desktop Icon Section: แสดง Icon ขนาดใหญ่ด้านซ้าย (ซ่อนบน Mobile) */}
        {Icon && (
          <div className="hidden md:flex shrink-0 p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 text-primary shadow-sm">
            <Icon size={40} strokeWidth={1.5} />
          </div>
        )}

        {/* [B] Text & Actions Section */}
        <div className="space-y-3 flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            {/* Title Wrapper */}
            <div className="flex items-center gap-3">
              {/* [C] Mobile Icon: แสดง Icon ขนาดเล็กคู่กับชื่อ (ซ่อนบน Desktop) */}
              {Icon && (
                <div className="md:hidden p-2.5 rounded-xl bg-primary/10 text-primary shrink-0 border border-primary/20">
                  <Icon size={24} />
                </div>
              )}

              {/* Main Title */}
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">
                {title}
              </h1>
            </div>

            {/* Favorite Button (Client Component) 
                - วางไว้ตรงนี้เพื่อให้ User กดง่าย
                - shrink-0 ป้องกันปุ่มบีบตัวเมื่อชื่อยาว
            */}
            {slug && <FavoriteButton slug={slug} className="shrink-0 mt-1.5" />}
          </div>

          {/* Description */}
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
