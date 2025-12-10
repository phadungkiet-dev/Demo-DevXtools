import { useState, useEffect } from "react";

const MAX_RECENTS = 5; // เก็บย้อนหลังสูงสุด 5 รายการ
const STORAGE_KEY = "5kkVsddFSg";

export function useRecentTools() {
  const [recents, setRecents] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recents));
  }, [recents]);

  const addRecent = (toolSlug: string) => {
    setRecents((prev) => {
      // 1. ลบของเดิมออกก่อน (ถ้ามี) เพื่อจะย้ายไปบนสุด
      const filtered = prev.filter((slug) => slug !== toolSlug);
      // 2. ใส่ของใหม่ไว้หน้าสุด + ตัดให้เหลือตามจำนวนที่กำหนด
      return [toolSlug, ...filtered].slice(0, MAX_RECENTS);
    });
  };

  return { recents, addRecent };
}
