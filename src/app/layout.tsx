// Imports =============================================
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import "./globals.css"; // Global Tailwind Styles

// Helper: Base URL Construction =========================
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

// Metadata (SEO) =======================================
export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "CodeXKit - All-in-One Developer Tools",
    template: "%s | CodeXKit",
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

// Viewport (Next.js 14+ Separation) =======================
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// Root Layout Component ==========================
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
          GeistSans.variable,
          GeistMono.variable
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
