"use client";

import { useEffect, useRef } from "react";
import { useRecentTools } from "@/hooks/useRecentTools";

interface RecentToolTrackerProps {
  slug: string;
}

export function RecentToolTracker({ slug }: RecentToolTrackerProps) {
  // ดึง state และ function มาใช้
  const { addRecent } = useRecentTools();
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!slug) return;

    // ป้องกันการยิงซ้ำใน Strict Mode
    if (!hasTracked.current) {
      console.log(`🔍 Tracking Tool: ${slug}`); // ✅ Debug: เช็คว่าทำงานไหม
      addRecent(slug);
      hasTracked.current = true;
    }
    
    // Reset เมื่อ slug เปลี่ยน (กรณีเปลี่ยนหน้าเครื่องมือโดยไม่ reload)
    return () => {
      hasTracked.current = false;
    };
  }, [slug, addRecent]);

  return null;
}