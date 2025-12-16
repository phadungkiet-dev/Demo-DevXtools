import { Sidebar } from "@/components/layout/sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    // 1. Parent Flex Container
    <div className="relative flex min-h-screen bg-background font-sans antialiased overflow-hidden">
      {/* Sidebar (Fixed Left) */}
      <Sidebar />

      {/* PageWrapper (Handles Width & Transition) */}
      <PageWrapper>
        <div className="flex flex-col min-h-screen w-full">
          {/* Header (Fixed Top) */}
          <SiteHeader />

          {/* ✅ MAIN CONTENT FIX:
            - pt-20 (80px): สำหรับ Mobile (Header 64px + 16px gap)
            - md:pt-24 (96px): สำหรับ Desktop (ให้ห่างลงมาสวยๆ ไม่ชนขอบ)
            - pb-20: เว้นด้านล่างเผื่อไว้เล็กน้อย
          */}
          <main
            className={cn(
              "flex-1 w-full container mx-auto",
              "px-4 md:px-6 lg:px-8", // Horizontal Padding
              "pt-20 md:pt-24 lg:pt-28", // ✅ Vertical Padding (ดันเนื้อหาหนี Header)
              "pb-10", // Bottom Padding
              "max-w-[1600px]",
              "animate-in fade-in slide-in-from-bottom-2 duration-500"
            )}
          >
            {children}
          </main>
        </div>
      </PageWrapper>
    </div>
  );
}
