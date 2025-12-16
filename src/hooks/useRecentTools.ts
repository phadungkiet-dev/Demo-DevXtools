import { useState, useEffect } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface RecentToolsState {
  recents: string[];
  addRecent: (slug: string) => void;
  clearRecents: () => void;
}

const useRecentToolsStore = create<RecentToolsState>()(
  persist(
    (set) => ({
      recents: [],

      addRecent: (slug: string) =>
        set((state) => {
          // กรองอันเก่าออก แล้วใส่ใหม่ไว้หน้าสุด (Stack)
          const filtered = state.recents.filter((s) => s !== slug);
          const newRecents = [slug, ...filtered].slice(0, 10); // เก็บแค่ 10 อันดับ
          return { recents: newRecents };
        }),

      clearRecents: () => set({ recents: [] }),
    }),
    {
      name: "recent-tools-storage",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true, // ✅ ยังคงไว้เพื่อกัน Error
    }
  )
);

export function useRecentTools() {
  const store = useRecentToolsStore();
  const [isLoaded, setIsLoaded] = useState(false);

  // ✅ เพิ่ม Effect นี้: เพื่อสั่ง Rehydrate เมื่อ Mount เสร็จ
  useEffect(() => {
    useRecentToolsStore.persist.rehydrate();
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return {
    // ส่งข้อมูลเปล่าถ้ายังโหลดไม่เสร็จ
    recents: isLoaded ? store.recents : [],
    addRecent: store.addRecent,
    clearRecents: store.clearRecents,
  };
}
