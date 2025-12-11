"use client";

import { useEffect } from "react";
import { useRecentTools } from "@/hooks/useRecentTools";

export function RecentToolTracker({ slug }: { slug: string }) {
  const { addRecent } = useRecentTools();

  useEffect(() => {
    if (slug) {
      addRecent(slug);
    }
  }, [slug, addRecent]);

  return null; // Component นี้ไม่มี UI มีหน้าที่แค่รัน Logic
}
