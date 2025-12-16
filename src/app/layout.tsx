// =============================================================================
// Imports
// =============================================================================
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // Optimized Google Fonts
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import "./globals.css"; // Global Tailwind Styles

// =============================================================================
// Font Configuration
// =============================================================================
// ใช้ Font optimization ของ Next.js เพื่อลด CLS (Cumulative Layout Shift)
const geistSans = Geist({
  variable: "--font-sans", // CSS Variable สำหรับ Tailwind (font-sans)
  subsets: ["latin"],
  display: "swap", // แสดง fallback font ก่อนโหลดเสร็จ เพื่อความเร็ว
});

const geistMono = Geist_Mono({
  variable: "--font-mono", // CSS Variable สำหรับ Tailwind (font-mono)
  subsets: ["latin"],
  display: "swap",
});

// =============================================================================
// Helper: Base URL Construction
// =============================================================================
// คำนวณ URL รากฐานสำหรับการทำ SEO OpenGraph Image
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return `https://${process.env.NEXT_PUBLIC_APP_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3030";
};

const baseUrl = getBaseUrl();

// =============================================================================
// Metadata (SEO)
// =============================================================================
export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "CodeXKit - All-in-One Developer Tools",
    template: "%s | CodeXKit", // รูปแบบ Title หน้าลูก: "JSON Formatter | CodeXKit"
  },
  description:
    "Free online developer tools: formatters, converters, generators, and more. Open source, fast, and privacy-focused.",
  keywords: [
    "developer tools",
    "web tools",
    "json formatter",
    "base64 converter",
    "productivity",
    "codexkit",
  ],
  authors: [
    {
      name: "CodeXKit Team",
      url: baseUrl,
    },
  ],
  creator: "CodeXKit",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "CodeXKit",
    title: "CodeXKit - All-in-One Developer Tools",
    description:
      "Boost your productivity with our collection of free developer tools. No ads, no tracking.",
    images: [
      {
        url: "/og-image.png", // ควรเตรียมรูป og-image.png ไว้ใน folder public
        width: 1200,
        height: 630,
        alt: "CodeXKit Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeXKit",
    description: "All-in-One Developer Tools Platform",
    creator: "@codexkit", // ใส่ Twitter Handle จริงถ้ามี
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// =============================================================================
// Viewport (Next.js 14+ Separation)
// =============================================================================
// แยกการตั้งค่า Viewport ออกจาก Metadata เพื่อการจัดการที่ถูกต้อง
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // ป้องกันการ Zoom ที่อาจทำให้ UI พังในบาง App (Optional)
};

// =============================================================================
// Root Layout Component
// =============================================================================
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: จำเป็นสำหรับ next-themes เพื่อป้องกัน Error
    // เรื่อง Class 'dark'/'light' ที่ไม่ตรงกันระหว่าง Server/Client
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased selection:bg-primary/20 selection:text-primary", // Selection style
          geistSans.variable,
          geistMono.variable
        )}
      >
        {/* ThemeProvider: จัดการ Dark/Light Mode */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}

          {/* Toaster: Global Notification System */}
          <Toaster
            position="bottom-right"
            richColors
            closeButton
            theme="system"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
