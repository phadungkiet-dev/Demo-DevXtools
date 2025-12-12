"use client";

import { Sidebar } from "@/components/layout/sidebar";
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

      <PageWrapper>
        <SiteHeader />

        <main className="container mx-auto p-4 md:p-6 lg:p-8 max-w-[1600px] animate-in fade-in slide-in-from-bottom-2 duration-500">
          {children}
        </main>
      </PageWrapper>
    </div>
  );
}
