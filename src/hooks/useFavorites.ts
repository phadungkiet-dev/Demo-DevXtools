import { useState, useEffect } from "react";

export function useFavorites() {
  // 1. เริ่มต้นค่าว่างเสมอ (เพื่อแก้ Hydration Mismatch)
  const [favorites, setFavorites] = useState<string[]>([]);
  // 2. ตัวแปรเช็คว่าโหลดข้อมูลเสร็จหรือยัง (ป้องกันการ Save ทับข้อมูลว่างๆ)
  const [isLoaded, setIsLoaded] = useState(false);

  // --- Effect 1: โหลดข้อมูล (ทำงานครั้งเดียวตอนเริ่ม) ---
  useEffect(() => {
    // ใช้ setTimeout เพื่อแก้ Error: Calling setState synchronously
    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("devtoolx-favorites");
        if (saved) {
          try {
            setFavorites(JSON.parse(saved));
          } catch (e) {
            console.error("Failed to parse favorites", e);
          }
        }
        // บอกว่าโหลดเสร็จแล้วนะ
        setIsLoaded(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // --- Effect 2: บันทึกข้อมูล (ทำงานเมื่อ favorites เปลี่ยน) ---
  useEffect(() => {
    // ต้องรอให้โหลดของเก่าเสร็จก่อน (isLoaded === true) ถึงจะยอมให้ Save
    // ไม่งั้นมันจะเอากล่องว่างๆ ไป Save ทับข้อมูลเก่าหายหมด
    if (isLoaded) {
      localStorage.setItem("devtoolx-favorites", JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

  // ฟังก์ชัน Toggle (เหมือนเดิม)
  const toggleFavorite = (toolId: string) => {
    setFavorites((prev) =>
      prev.includes(toolId)
        ? prev.filter((id) => id !== toolId)
        : [...prev, toolId]
    );
  };

  const isFavorite = (toolId: string) => favorites.includes(toolId);

  return { favorites, toggleFavorite, isFavorite };
}
