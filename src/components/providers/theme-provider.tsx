"use client"; // ทำงานฝั่ง Client เพราะ Theme ต้องยุ่งกับ LocalStorage และ DOM Context

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes"; // Import ตัวหลักมา

// Component Definition
// จุดที่แก้ไข: การใช้ React.ComponentProps<typeof NextThemesProvider>
export function ThemeProvider({
  children,
  ...props // รับ Props ทั้งหมดที่ NextThemesProvider รองรับ
}: React.ComponentProps<typeof NextThemesProvider>) {
  // Render: ส่งต่อ Props และ Children เข้าไปทำงาน
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
