"use client";

// =============================================================================
// Imports
// =============================================================================
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// =============================================================================
// Component Definition
// =============================================================================

/**
 * ThemeProvider Wrapper
 * * ทำหน้าที่เป็น Client Component Boundary สำหรับระบบ Theme
 * ช่วยให้เราสามารถใช้ ThemeProvider ใน Root Layout (ที่เป็น Server Component) ได้
 * โดยไม่กระทบต่อ Server-Side Rendering (SSR) ของส่วนอื่นๆ
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  // ส่งต่อ Props ทั้งหมด (เช่น attribute="class", defaultTheme="system")
  // ไปยัง NextThemesProvider ตัวจริง
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
