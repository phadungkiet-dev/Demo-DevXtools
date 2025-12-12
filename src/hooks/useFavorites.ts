import { useState, useEffect } from "react";

export function useFavorites() {
  // State: เริ่มต้นเป็นอาเรย์ว่างเสมอ เพื่อให้ Server Render ผ่านฉลุย
  const [favorites, setFavorites] = useState<string[]>([]);
  // Loading Flag: หัวใจสำคัญ! บอกว่า "โหลดของเก่าเสร็จหรือยัง"
  const [isLoaded, setIsLoaded] = useState(false);

  // --- Effect: Load Data (ทำงานครั้งเดียวตอน Mount) ---
  useEffect(() => {
    // ใช้ setTimeout(..., 0) เพื่อย้ายการทำงานไปที่ Event Loop รอบถัดไป
    // ช่วยแก้ปัญหา Hydration Warning และ Performance
    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("codexkit-favorites");
        if (saved) {
          try {
            setFavorites(JSON.parse(saved)); // แปลง JSON กลับเป็น Array
          } catch (e) {
            console.error("Failed to parse favorites", e); // กันเหนียวเผื่อไฟล์เสีย
          }
        }
        setIsLoaded(true); // ปลดล็อค! บอกว่าโหลดเสร็จแล้ว พร้อมให้ Save ได้
      }
    }, 0);

    return () => clearTimeout(timer); // Cleanup
  }, []);

  // --- Effect: Save Data (ทำงานเมื่อ favorites เปลี่ยน) ---
  useEffect(() => {
    // Guard Clause: ถ้ายังโหลดของเก่าไม่เสร็จ ห้าม Save เด็ดขาด!
    // เพราะตอนเริ่ม favorites เป็น [] ถ้าเผลอ Save ตอนนี้ ข้อมูลเก่าจะหายหมด
    if (isLoaded) {
      localStorage.setItem("codexkit-favorites", JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]); // dependencies ครบถ้วน

  // Helper Functions
  const toggleFavorite = (toolId: string) => {
    setFavorites((prev) =>
      prev.includes(toolId)
        ? prev.filter((id) => id !== toolId)
        : [...prev, toolId]
    );
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const isFavorite = (toolId: string) => favorites.includes(toolId);

  return { favorites, toggleFavorite, isFavorite, clearFavorites };
}
