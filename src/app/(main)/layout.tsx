"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { CommandMenu } from "@/components/layout/command-menu"; // Import เข้ามา
import { useSidebarStore } from "@/store/use-sidebar-store";
import { cn } from "@/lib/utils";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen } = useSidebarStore();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <CommandMenu />{" "}
      {/* ✅ แปะไว้ตรงนี้ (มันเป็น Dialog ซ่อนอยู่ จะไม่กวน UI หลัก) */}
      <main
        className={cn(
          "transition-all duration-300 ease-in-out min-h-screen",
          isOpen ? "ml-64" : "ml-16"
        )}
      >
        <div className="container mx-auto p-6 md:p-8 max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
