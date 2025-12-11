"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { CommandMenu } from "@/components/layout/command-menu";
import { SiteHeader } from "@/components/layout/site-header"; // ✅ เพิ่ม 1. Import Header
import { PageWrapper } from "@/components/layout/page-wrapper"; // ✅ เพิ่ม 2. Import Wrapper
// ลบ useSidebarStore และ cn ออกได้เลย เพราะย้าย Logic ไปจัดการใน PageWrapper แล้ว

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* 1. Sidebar (Fixed ซ้าย) */}
      <Sidebar />

      {/* 2. Command Menu (Dialog ซ่อนอยู่) */}
      <CommandMenu />

      {/* 3. PageWrapper (จัดการขยับเนื้อหาหนี Sidebar อัตโนมัติ) */}
      <PageWrapper>
        {/* 4. Topbar (อยู่บนสุด) */}
        <SiteHeader />

        {/* 5. Main Content Area */}
        <main className="container mx-auto p-6 md:p-8 max-w-7xl">
          {children}
        </main>
      </PageWrapper>
    </div>
  );
}
