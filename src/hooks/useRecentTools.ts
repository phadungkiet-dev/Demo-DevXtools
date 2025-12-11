import { useState, useEffect } from "react";

const MAX_RECENTS = 5; // เก็บย้อนหลังสูงสุด 5 รายการ
const STORAGE_KEY = "devtoolx-recents";

export function useRecentTools() {
  const [recents, setRecents] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Load data (Asynchronous to fix hydration/sync errors)
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
        setIsLoaded(true);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // 2. Save data
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recents));
    }
  }, [recents, isLoaded]);

  const addRecent = (toolSlug: string) => {
    setRecents((prev) => {
      // ลบตัวเดิมออกก่อน (ถ้ามี) แล้วเอาไปใส่หน้าสุด
      const filtered = prev.filter((slug) => slug !== toolSlug);
      const newRecents = [toolSlug, ...filtered].slice(0, MAX_RECENTS);
      return newRecents;
    });
  };

  const clearRecents = () => {
    setRecents([]);
  };

  return { recents, addRecent, clearRecents };
}
