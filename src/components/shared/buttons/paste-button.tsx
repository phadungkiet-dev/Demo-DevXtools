"use client";

// Imports ===================
import { useState, useEffect } from "react";
import { ClipboardPaste, Check, Info, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Types ====================
interface PasteButtonProps {
  /** * Callback function ที่จะส่ง text จาก Clipboard กลับไปให้ Parent Component
   * (เช่น: (text) => setInput(text))
   */
  onPaste: (text: string) => void;
  /** Class เพิ่มเติมสำหรับปรับแต่ง Style */
  className?: string;
  /** สถานะปิดการใช้งานปุ่ม */
  disabled?: boolean;
}

// Component ===================
export function PasteButton({
  onPaste,
  className,
  disabled,
}: PasteButtonProps) {
  // เพิ่ม State สำหรับจัดการ Icon Feedback
  const [isPasted, setIsPasted] = useState(false);

  // Reset Icon กลับหลัง 2 วินาที
  useEffect(() => {
    if (isPasted) {
      const timeout = setTimeout(() => setIsPasted(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [isPasted]);

  /** Handle Clipboard Read */
  const handlePaste = async () => {
    try {
      // อ่านข้อมูล Text
      const text = await navigator.clipboard.readText();

      // ตรวจสอบว่ามีข้อมูลหรือไม่
      if (text) {
        onPaste(text); 
        setIsPasted(true); 
        toast("Text pasted from clipboard", {
          icon: <ClipboardPaste className="h-4 w-4 text-green-500" />,
        });
      } else {
        toast("Clipboard is empty", {
          icon: <Info className="h-4 w-4 text-blue-500" />,
        });
      }
    } catch (err) {
      // กรณีเกิด Error (เช่น Browser ไม่รองรับ หรือ User ไม่อนุญาต)
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
        "text-xs h-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors",
        className
      )}
      onClick={handlePaste}
      disabled={disabled}
      title="Paste from Clipboard"
    >
      {/* ✅ Icon Feedback: เปลี่ยนเป็น Check สีเขียวเมื่อ Paste สำเร็จ */}
      {isPasted ? (
        <Check className="h-3.5 w-3.5 text-green-500 animate-in zoom-in spin-in-90 duration-300" />
      ) : (
        <ClipboardPaste className="h-3.5 w-3.5" />
      )}
      Paste
    </Button>
  );
}
