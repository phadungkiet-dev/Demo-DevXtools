"use client";

// =============================================================================
// Imports
// =============================================================================
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// =============================================================================
// Component
// =============================================================================
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  // ส่งต่อ Props ทั้งหมด (เช่น attribute="class", defaultTheme="system")
  // ไปยัง NextThemesProvider ตัวจริงโดยตรง
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
