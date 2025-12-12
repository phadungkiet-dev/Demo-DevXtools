"use client"; // Client Component เพราะมี Interaction (Click)

import { Star } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  slug: string; // Key หลักในการระบุเครื่องมือ
  className?: string; // รับ Style เพิ่มเติมจากภายนอก (เช่น margin)
  showText?: boolean; // Toggle รูปแบบการแสดงผล
}

export function FavoriteButton({
  slug,
  className,
  showText = false,
}: FavoriteButtonProps) {
  // Logic: ดึงฟังก์ชันมาจาก Hook โดยตรง (Decoupled Logic)
  const { isFavorite, toggleFavorite } = useFavorites();
  const isSaved = isFavorite(slug); // คำนวณสถานะ

  // Helper สำหรับหยุด Event ไม่ให้ทะลุไปหา Parent (เช่น Card หรือ Link)
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // ป้องกัน Link ทำงาน
    e.stopPropagation(); // ป้องกัน Event Bubbling
    toggleFavorite(slug);
  };

  return (
    <Button
      variant="ghost" // ปุ่มใส ไม่มีพื้นหลัง (จนกว่าจะ Active)
      size={showText ? "sm" : "icon"} // ปรับขนาดตามโหมด
      // Action Handler
      onClick={handleClick} // ✅ ใช้ Handler ที่ปลอดภัย
      className={cn(
        "group transition-all duration-300",
        isSaved
          ? "text-amber-500 hover:text-amber-600 hover:bg-amber-500/10"
          : "text-muted-foreground hover:text-amber-500",
        className
      )}
      // ✅ เพิ่ม aria-label เพื่อ Accessibility ที่ดีกว่า title อย่างเดียว
      aria-label={isSaved ? "Remove from favorites" : "Add to favorites"}
      title={isSaved ? "Remove from favorites" : "Add to favorites"}
    >
      {/* 4. Icon Animation */}
      <Star
        className={cn(
          "h-5 w-5 transition-transform duration-300",
          isSaved ? "fill-current scale-110" : "scale-100 group-hover:scale-110"
        )}
      />
      {/* 5. Text Option */}
      {showText && (
        <span className="ml-2">{isSaved ? "Saved" : "Favorite"}</span>
      )}
    </Button>
  );
}
