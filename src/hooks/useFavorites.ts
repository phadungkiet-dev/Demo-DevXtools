import { useState, useEffect } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// =============================================================================
// Interface: กำหนดโครงสร้างข้อมูลของ Store
// =============================================================================
interface FavoritesState {
  favorites: string[]; // เก็บรายการ Slug ของเครื่องมือที่ชอบ
  toggleFavorite: (slug: string) => void; // ฟังก์ชันสลับสถานะ (เพิ่ม/ลบ)
  clearFavorites: () => void; // ล้างรายการทั้งหมด
}

// =============================================================================
// Store Definition (Zustand)
// =============================================================================
const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      favorites: [],

      // Action: Toggle (Add/Remove)
      toggleFavorite: (slug) =>
        set((state) => {
          const isExist = state.favorites.includes(slug);
          return {
            favorites: isExist
              ? state.favorites.filter((s) => s !== slug) // ถ้ามีแล้ว -> เอาออก
              : [...state.favorites, slug], // ถ้ายังไม่มี -> เพิ่มเข้าไป
          };
        }),

      // Action: Clear All
      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: "codexkit-favorites", // Key ใน LocalStorage
      storage: createJSONStorage(() => localStorage), // ใช้ LocalStorage
      skipHydration: true, // ป้องกัน Hydration Error (เราจะจัดการเรื่อง Mount ที่ Component เอง)
    }
  )
);

// =============================================================================
// Export Hook Wrapper
// =============================================================================
// สร้าง Hook ครอบไว้เพื่อให้เรียกใช้ง่าย และคงรูปแบบ Interface เดิมไว้
export function useFavorites() {
  const store = useFavoritesStore();
  const [isLoaded, setIsLoaded] = useState(false);

  // ✅ เพิ่ม Effect นี้: เพื่อสั่ง Rehydrate (โหลดข้อมูล) เมื่อ Mount เสร็จ
  useEffect(() => {
    useFavoritesStore.persist.rehydrate();
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return {
    // ถ้ายังโหลดไม่เสร็จ ให้ส่ง [] ไปก่อนเพื่อความปลอดภัย
    favorites: isLoaded ? store.favorites : [],
    toggleFavorite: store.toggleFavorite,
    clearFavorites: store.clearFavorites,

    // Helper function
    isFavorite: (slug: string) =>
      isLoaded ? store.favorites.includes(slug) : false,
  };
}
