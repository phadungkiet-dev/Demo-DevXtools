"use client";

import { useSidebarStore } from "@/store/use-sidebar-store";
import { cn } from "@/lib/utils";

export function PageWrapper({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebarStore();

  return (
    <main
      className={cn(
        "flex min-h-screen flex-col transition-all duration-300 ease-in-out",
        "pt-16", // ✅ Fix Overlap: ดันเนื้อหาลงมาเท่ากับความสูง Header (64px/4rem)
        isOpen ? "md:pl-72" : "md:pl-[72px]" // ✅ Fix Sidebar Overlap: ดันเนื้อหาไปขวา
      )}
    >
      <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
        {children}
      </div>
    </main>
  );
}
