"use client";

import { Sidebar } from "@/components/layout/sidebar";
// ❌ ลบ import CommandMenu บรรทัดนี้ออก (ถ้าไม่ได้ใช้ที่อื่นในไฟล์นี้)
// import { CommandMenu } from "@/components/layout/command-menu";
import { SiteHeader } from "@/components/layout/site-header";
import { PageWrapper } from "@/components/layout/page-wrapper";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      {/* Sidebar Component */}
      <Sidebar />

      {/* ❌ ลบ <CommandMenu /> ตรงนี้ออกครับ 
          เพราะมันถูกเรียกใช้ใน SiteHeader ด้านล่างแล้ว 
      */}

      <PageWrapper>
        <SiteHeader />

        <main className="container mx-auto p-4 md:p-6 lg:p-8 max-w-[1600px] animate-in fade-in slide-in-from-bottom-2 duration-500">
          {children}
        </main>
      </PageWrapper>
    </div>
  );
}
