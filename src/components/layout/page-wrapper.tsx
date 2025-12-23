"use client";

// =============================================================================
// Imports
// =============================================================================
import React, { useState, useEffect } from "react";
import { useSidebarStore } from "@/store/use-sidebar-store";
import { cn } from "@/lib/utils";

// =============================================================================
// Component
// =============================================================================
export function PageWrapper({ children }: { children: React.ReactNode }) {
  // Store state
  const { isOpen } = useSidebarStore();

  // Local state for Hydration Safety
  const [isMounted, setIsMounted] = useState(false);

  // ---------------------------------------------------------------------------
  // Effects
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        // -------------------------------------------------------
        // **Layout Fundamentals:
        // - flex-col + min-h-screen: ดัน Footer (ถ้ามี) ให้ลงล่างสุดเสมอ
        // - w-full: บังคับเต็มจอแนวนอน
        // -------------------------------------------------------
        "flex flex-col min-h-screen w-full bg-background",

        // -------------------------------------------------------
        // **Sidebar Transition Logic (Desktop Only):
        // - transition-[padding]: ทำ Animation เฉพาะ padding เพื่อ performance ที่ดี
        // -------------------------------------------------------
        "transition-[padding] duration-300 ease-in-out",

        // **Logic:
        // - ถ้ายังไม่ Mount หรือ Sidebar ปิด -> เว้นซ้าย 72px (Icon only mode)
        // - ถ้า Mount แล้ว + Sidebar เปิด -> เว้นซ้าย 72 (288px)
        isMounted && isOpen ? "md:pl-72" : "md:pl-[72px]"
      )}
    >
      {/* **Content Boundary:
        - flex-1: ยืดพื้นที่ที่เหลือ
        - min-w-0: **สำคัญมาก** (CSS Hack) ช่วยป้องกัน Flex items (เช่น Table, CodeBlock) 
          ดัน Layout จนล้นออกนอกจอ (Overflow issue)
      */}
      <div className="flex-1 w-full min-w-0 flex flex-col">{children}</div>
    </div>
  );
}
