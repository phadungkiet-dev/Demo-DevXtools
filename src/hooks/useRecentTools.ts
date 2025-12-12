import { useState, useEffect } from "react";

const MAX_RECENTS = 5; // เก็บย้อนหลังสูงสุด 5 รายการ
const STORAGE_KEY = "codexkit-recents";

export function useRecentTools() {
  const [recents, setRecents] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false); // Flag สำคัญเหมือนเดิม

  // --- Effect: Load (Safe Hydration) ---
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            setRecents(JSON.parse(saved));
          } catch (e) {
            console.error("Failed to parse recents", e);
          }
        }
        setIsLoaded(true); // พร้อมทำงานต่อ
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // --- Effect: Save (Auto Sync) ---
  useEffect(() => {
    if (isLoaded) { // Guard: ป้องกันการเซฟทับข้อมูลเก่าตอนโหลดไม่เสร็จ
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recents));
    }
  }, [recents, isLoaded]);

  // --- Logic หลัก: เพิ่มประวัติ ---
  const addRecent = (toolSlug: string) => {
    setRecents((prev) => {
      // Filter: เอาตัวเดิมออกก่อน (ถ้ามี) เพื่อไม่ให้ซ้ำ และเตรียมย้ายตำแหน่ง
      const filtered = prev.filter((slug) => slug !== toolSlug);

      // Prepend: เอาตัวใหม่ใส่หน้าสุด
      // Slice: ตัดให้เหลือแค่ 5 ตัว
      const newRecents = [toolSlug, ...filtered].slice(0, MAX_RECENTS);
      return newRecents;
    });
  };

  const clearRecents = () => {
    setRecents([]);
  };

  return { recents, addRecent, clearRecents };
}
