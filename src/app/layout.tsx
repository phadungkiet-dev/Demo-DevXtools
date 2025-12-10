import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider"; // Import ที่สร้างตะกี้
import { Toaster } from "@/components/ui/sonner"; // 👈 เพิ่ม Import Toaster
import { cn } from "@/lib/utils"; // 👈 เพิ่ม Import cn

// 1. เปลี่ยนชื่อจาก geistSans เป็น fontSans ให้ตรงกับที่เรียกใช้ข้างล่าง
const fontSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevToolX",
  description: "All-in-One Developer Tools Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable, // ✅ ตอนนี้ชื่อตัวแปรตรงกันแล้ว
          geistMono.variable // เพิ่ม Mono font เข้าไปด้วยเผื่อใช้
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster /> {/* ✅ Import มาแล้ว ใช้งานได้ */}
        </ThemeProvider>
      </body>
    </html>
  );
}
