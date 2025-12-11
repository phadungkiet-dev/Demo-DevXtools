"use client";

import { useSidebarStore } from "@/store/use-sidebar-store";
import { cn } from "@/lib/utils";

export function PageWrapper({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebarStore();

  return (
    <div
      className={cn(
        "flex flex-col min-h-screen transition-all duration-300 ease-in-out",
        isOpen ? "ml-64" : "ml-16" // ขยับเนื้อหาตามความกว้าง Sidebar
      )}
    >
      {children}
    </div>
  );
}
