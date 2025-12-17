"use client";

// =============================================================================
// Imports
// =============================================================================
import { useState, useEffect } from "react";
import { Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// =============================================================================
// Types
// =============================================================================
// กำหนด Interface เอง ไม่ต้องดึงจาก ui/button เพื่อแก้ปัญหา import error
interface ClearButtonProps {
  /** * ฟังก์ชันที่จะทำงานเมื่อกดปุ่ม (เช่น setInput(""))
   */
  onClear: () => void;

  /** * รับ Class เพิ่มเติมเพื่อปรับแต่ง Style
   */
  className?: string;

  /** * สถานะปิดการใช้งานปุ่ม (เช่น เมื่อไม่มีข้อมูลใน Input)
   */
  disabled?: boolean;
}

// =============================================================================
// Component
// =============================================================================
export function ClearButton({
  onClear,
  className,
  disabled,
}: ClearButtonProps) {
  // ✅ เพิ่ม State สำหรับจัดการ Icon Feedback
  const [isCleared, setIsCleared] = useState(false);

  // ✅ Reset Icon กลับหลัง 2 วินาที
  useEffect(() => {
    if (isCleared) {
      const timeout = setTimeout(() => setIsCleared(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [isCleared]);

  // 🟢 Wrapper Function: สั่งลบข้อมูล + แจ้งเตือน
  const handleClear = () => {
    // 1. เรียกฟังก์ชันหลัก (ลบข้อมูล)
    onClear();
    setIsCleared(true);

    // 2. แสดง Toast (Minimal Style)
    // ใช้ Icon สีแดง (Destructive) เพื่อสื่อถึงการลบ
    toast("Content cleared!!!", {
      icon: <Trash2 className="h-4 w-4 text-destructive" />,
    });
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn(
        // ปกติสีเทา -> Hover เป็นสีแดง (Destructive)
        "text-xs h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
        className
      )}
      onClick={handleClear}
      disabled={disabled}
      title="Clear Input"
      aria-label="Clear all input"
    >
      {/* ✅ Icon Feedback: เปลี่ยนเป็น Check สีเขียวเมื่อลบสำเร็จ */}
      {isCleared ? (
        <Check className="mr-2 h-3.5 w-3.5 text-green-500 animate-in zoom-in spin-in-90 duration-300" />
      ) : (
        <Trash2 className="mr-2 h-3.5 w-3.5" />
      )}
      Clear
    </Button>
  );
}
