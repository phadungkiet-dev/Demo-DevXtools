"use client";

import { Star } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  slug: string; // ID หรือ Slug ของ Tool ที่จะบันทึก
  className?: string;
  showText?: boolean; // Option: จะให้แสดงข้อความ "Add to Favorites" ด้วยไหม
}

export function FavoriteButton({
  slug,
  className,
  showText = false,
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isSaved = isFavorite(slug);

  return (
    <Button
      variant="ghost"
      size={showText ? "sm" : "icon"}
      onClick={() => toggleFavorite(slug)}
      className={cn(
        "group transition-all duration-300",
        isSaved
          ? "text-amber-500 hover:text-amber-600 hover:bg-amber-500/10"
          : "text-muted-foreground hover:text-amber-500",
        className
      )}
      title={isSaved ? "Remove from favorites" : "Add to favorites"}
    >
      <Star
        className={cn(
          "h-5 w-5 transition-transform duration-300",
          isSaved ? "fill-current scale-110" : "scale-100 group-hover:scale-110"
        )}
      />
      {showText && (
        <span className="ml-2">{isSaved ? "Saved" : "Favorite"}</span>
      )}
    </Button>
  );
}
