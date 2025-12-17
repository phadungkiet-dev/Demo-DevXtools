"use client";

// =============================================================================
// Imports
// =============================================================================
import { useState, useEffect } from "react"; // ✅ เพิ่ม Hooks
import { ClipboardPaste, Check, Info, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// =============================================================================
// Types
// =============================================================================
// กำหนด Interface เอง เพื่อลด Dependency และแก้ปัญหา Import Error
interface PasteButtonProps {
  /** * Callback function ที่จะส่ง text จาก Clipboard กลับไปให้ Parent Component
   * (เช่น: (text) => setInput(text))
   */
  onPaste: (text: string) => void;

  /** * Class เพิ่มเติมสำหรับปรับแต่ง Style
   */
  className?: string;

  /** * สถานะปิดการใช้งานปุ่ม
   */
  disabled?: boolean;
}

// =============================================================================
// Component
// =============================================================================
export function PasteButton({
  onPaste,
  className,
  disabled,
}: PasteButtonProps) {
  // ✅ เพิ่ม State สำหรับจัดการ Icon Feedback
  const [isPasted, setIsPasted] = useState(false);

  // ✅ Reset Icon กลับหลัง 2 วินาที
  useEffect(() => {
    if (isPasted) {
      const timeout = setTimeout(() => setIsPasted(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [isPasted]);

  /**
   * 📋 Handle Clipboard Read
   * ใช้ Async/Await เพื่ออ่านข้อมูลจาก Clipboard API ของ Browser
   */
  const handlePaste = async () => {
    try {
      // 1. อ่านข้อมูล Text
      const text = await navigator.clipboard.readText();

      // 2. ตรวจสอบว่ามีข้อมูลหรือไม่
      if (text) {
        onPaste(text); // ส่งข้อมูลกลับ
        setIsPasted(true); // ✅ เริ่มแสดง icon สีเขียว
        toast("Text pasted from clipboard", {
          icon: <Check className="h-4 w-4 text-green-500" />,
        });
      } else {
        toast("Clipboard is empty", {
          icon: <Info className="h-4 w-4 text-blue-500" />,
        });
      }
    } catch (err) {
      // 3. กรณีเกิด Error (เช่น Browser ไม่รองรับ หรือ User ไม่อนุญาต)
      console.error("Clipboard paste failed:", err);
      toast("Failed to read clipboard", {
        description: "Please check your browser permissions.",
        icon: <AlertCircle className="h-4 w-4 text-destructive" />,
      });
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn(
        // ✅ ปรับสีให้เหมือนกัน: ปกติเทา -> Hover สีหลัก (Primary)
        "text-xs h-8 text-muted-foreground hover:text-primary hover:bg-primary/10 hidden sm:flex transition-colors",
        className
      )}
      onClick={handlePaste}
      disabled={disabled}
      title="Paste from Clipboard"
    >
      {/* ✅ Icon Feedback: เปลี่ยนเป็น Check สีเขียวเมื่อ Paste สำเร็จ */}
      {isPasted ? (
        <Check className="mr-2 h-3.5 w-3.5 text-green-500 animate-in zoom-in spin-in-90 duration-300" />
      ) : (
        <ClipboardPaste className="mr-2 h-3.5 w-3.5" />
      )}
      Paste
    </Button>
  );
}
