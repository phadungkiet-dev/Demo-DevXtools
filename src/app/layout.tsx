import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // Optimized Fonts
import "./globals.css"; // Global Styles (Tailwind directives)
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

// Font Configuration
const fontSans = Geist({
  variable: "--font-sans", // ส่งตัวแปร CSS ไปใช้ใน Tailwind
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

// Base URL Logic (สำคัญสำหรับ SEO Image)
const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  ? `https://${process.env.NEXT_PUBLIC_APP_URL}`
  : process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3030";

// Metadata (Smart SEO)
export const metadata: Metadata = {
  metadataBase: new URL(baseUrl), // กำหนดรากฐานให้ URL ทั้งหมดใน metadata
  title: {
    default: "CodeXKit - All-in-One Developer Tools",
    template: "%s | CodeXKit", // ผลลัพธ์จะเป็น: "ชื่อเครื่องมือ | CodeXKit"
  },
  description:
    "Free online developer tools: formatters, converters, generators, and more. Open source, fast, and privacy-focused.",
  keywords: [
    "developer tools",
    "web tools",
    "json formatter",
    "uuid generator",
    "coding utilities",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "CodeXKit",
    title: "CodeXKit - All-in-One Developer Tools",
    description:
      "Boost your productivity with our collection of free developer tools.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeXKit",
    description: "All-in-One Developer Tools Platform",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: จำเป็นต้องมีเมื่อใช้ next-themes เพื่อกัน Error จังหวะโหลดหน้าเว็บ
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          geistMono.variable
        )}
      >
        {/* Providers Wrapper */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster /> {/* Global Toast Notification */}
        </ThemeProvider>
      </body>
    </html>
  );
}
