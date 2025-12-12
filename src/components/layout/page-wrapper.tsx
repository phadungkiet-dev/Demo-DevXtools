"use client"; // ทำงานฝั่ง Client เพราะต้องฟังค่าจาก Store

import { useSidebarStore } from "@/store/use-sidebar-store";
import { cn } from "@/lib/utils";

export function PageWrapper({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebarStore(); // ดึงสถานะ Sidebar มาใช้คำนวณ

  return (
    <div
      className={cn(
        // Layout Structure:
        // - grid: ใช้ Grid จัดการ Layout ภาพรวม
        // - min-h-screen: ความสูงอย่างน้อยเต็มจอ
        // - transition-all: ให้การขยับ Padding นุ่มนวล (Sync กับ Sidebar)
        "grid grid-rows-[auto_1fr] min-h-screen transition-all duration-300 ease-in-out",
        // Header Spacing:
        // - pt-16 (4rem/64px): เว้นที่ให้ Fixed Header ด้านบน
        "pt-16",
        // Sidebar Spacing (Desktop Only):
        // - isOpen ? "md:pl-72" : "md:pl-[72px]"
        // - ถ้าเปิด: เว้นซ้าย 288px / ถ้าปิด: เว้นซ้าย 72px
        // - Mobile (default): ไม่เว้น (pl-0)
        isOpen ? "md:pl-72" : "md:pl-[72px]"
      )}
    >
      {/* Content Safety Wrapper: 
          - w-full: กว้างเต็มพื้นที่ที่เหลือ
          - min-w-0: **สำคัญมาก** ป้องกัน Grid Blowout (Content ดันทะลุจอ)
      */}
      <div className="w-full min-w-0">{children}</div>
    </div>
  );
}
