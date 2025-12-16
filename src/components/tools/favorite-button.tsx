"use client"; // Client Component เพราะมี Interaction (Click)

// =============================================================================
// Imports
// =============================================================================
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
// UI Components
import { Button } from "@/components/ui/button";
// Hooks & Utils
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";
// import { toast } from "sonner"; // Uncomment ถ้าต้องการ Toast

// =============================================================================
// Interface Definition
// =============================================================================
interface FavoriteButtonProps {
  slug: string; // Key หลักในการระบุเครื่องมือ
  className?: string; // รับ Style เพิ่มเติมจากภายนอก
  showText?: boolean; // Toggle รูปแบบการแสดงผล (มี Text หรือ Icon ล้วน)
}

// =============================================================================
// Component
// =============================================================================
export function FavoriteButton({
  slug,
  className,
  showText = false,
}: FavoriteButtonProps) {
  // --- Hooks ---
  // เรียกใช้ Hook ที่เราปรับเป็น Zustand Store แล้ว
  const { isFavorite, toggleFavorite } = useFavorites();

  // --- State: Hydration Fix ---
  // ใช้ mounted check เพื่อป้องกัน Error: "Text content does not match server-rendered HTML"
  // และป้องกัน UI กระตุกเวลากด Refresh
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // --- Logic ---
  // ถ้ายังไม่ Mount ให้ถือว่ายังไม่ Save (Safe Default)
  const isSaved = mounted ? isFavorite(slug) : false;

  // --- Handler ---
  const handleClick = (e: React.MouseEvent) => {
    // สำคัญ: หยุด Event ไม่ให้ทะลุไปกด Link/Card ด้านหลัง
    e.preventDefault();
    e.stopPropagation();

    // Toggle Action
    toggleFavorite(slug);

    // Optional: Feedback
    // if (!isSaved) toast.success("Added to favorites");
  };

  // --- Render Fallback ---
  // แสดงปุ่มจางๆ ระหว่างรอโหลดข้อมูล (ป้องกัน Layout Shift)
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size={showText ? "sm" : "icon"}
        className={cn("opacity-50 pointer-events-none", className)}
      >
        <Star className="h-5 w-5" />
        {showText && <span className="ml-2">Favorite</span>}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost" // ปุ่มใส ไม่มีพื้นหลัง (จนกว่าจะ Active)
      size={showText ? "sm" : "icon"} // ปรับขนาดตามโหมด
      onClick={handleClick}
      // Accessibility Attributes
      aria-label={isSaved ? "Remove from favorites" : "Add to favorites"}
      title={isSaved ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        // Base Styles
        "group relative transition-all duration-300",
        // Interaction: กดแล้วปุ่มยุบลงเล็กน้อย (Tactile Feedback)
        "active:scale-90",
        // State Styles: สีเหลืองเมื่อ Save, สีเทาเมื่อไม่ Save
        isSaved
          ? "text-amber-500 hover:text-amber-600 hover:bg-amber-500/10"
          : "text-muted-foreground hover:text-amber-500 hover:bg-muted/50",
        className
      )}
    >
      {/* Icon with Scale Animation */}
      <Star
        className={cn(
          "h-5 w-5 transition-transform duration-300 ease-in-out",
          // Animation Logic:
          // - isSaved: เติมสี + ขยาย 110%
          // - !isSaved: ขยายเมื่อเอาเมาส์ Hover
          isSaved ? "fill-current scale-110" : "scale-100 group-hover:scale-110"
        )}
        strokeWidth={isSaved ? 2.5 : 2} // เพิ่มความหนาเส้นเมื่อเลือก
      />

      {/* Text Label (Optional) */}
      {showText && (
        <span
          className={cn(
            "ml-2 font-medium transition-colors",
            isSaved
              ? "text-amber-600 dark:text-amber-500"
              : "text-muted-foreground"
          )}
        >
          {isSaved ? "Saved" : "Favorite"}
        </span>
      )}
    </Button>
  );
}
