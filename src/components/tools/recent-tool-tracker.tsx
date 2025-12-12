"use client"; // ทำงานฝั่ง Client (เพราะต้องใช้ Effect และ localStorage ผ่าน Hook)

import { useEffect } from "react";
import { useRecentTools } from "@/hooks/useRecentTools";

export function RecentToolTracker({ slug }: { slug: string }) {
  // เรียกใช้ Hook เพื่อเอาฟังก์ชัน addRecent มา
  const { addRecent } = useRecentTools();

  // Effect: ทำงานเมื่อ 'slug' หรือ 'addRecent' เปลี่ยนแปลง
  useEffect(() => {
    if (slug) {
      addRecent(slug); // บันทึกว่า "ฉันมาเยี่ยมเยียน tool นี้แล้วนะ"
    }
  }, [slug, addRecent]); // Dependency Array สำคัญมาก เพื่อให้ทำงานถูกต้อง

  // Render: ไม่แสดงอะไรเลย (Invisible Helper)
  return null;
}
