import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { CommandMenu } from "@/components/layout/command-menu";

const fontSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  ? `https://${process.env.NEXT_PUBLIC_APP_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          geistMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          {/* <CommandMenu /> */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
