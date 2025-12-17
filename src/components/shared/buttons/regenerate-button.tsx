"use client";

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RegenerateButtonProps {
  /** ฟังก์ชันที่จะทำงานเมื่อกดปุ่ม */
  onRegenerate: () => void;

  /** ข้อความบนปุ่ม (ถ้าไม่มีจะเป็น Icon Only) */
  label?: string;

  /** Class เพิ่มเติม */
  className?: string;

  /** Disabled state */
  disabled?: boolean;

  /** ขนาดปุ่ม */
  size?: "default" | "sm" | "lg" | "icon";

  /** รูปแบบปุ่ม */
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";

  /** * ข้อความที่จะแสดงใน Toast
   * (Default: "Regenerated successfully")
   */
  toastMessage?: string;

  /** ปิดการใช้งาน Toast หรือไม่ */
  disableToast?: boolean;
}

export function RegenerateButton({
  onRegenerate,
  label,
  className,
  disabled,
  size = "default",
  variant = "ghost",
  toastMessage = "Regenerated successfully",
  disableToast = false,
}: RegenerateButtonProps) {
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    if (isSpinning) {
      const timeout = setTimeout(() => setIsSpinning(false), 500); // หมุน 0.5 วินาที
      return () => clearTimeout(timeout);
    }
  }, [isSpinning]);

  const handleClick = () => {
    onRegenerate();
    setIsSpinning(true);

    // ✅ Trigger Toast
    if (!disableToast) {
      toast(toastMessage, {
        // ใช้ Icon Refresh สีฟ้า เพื่อสื่อถึงการโหลดใหม่/เปลี่ยนค่า
        icon: <RefreshCw className="h-4 w-4 text-blue-500" />,
      });
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={label ? size : "icon"}
      onClick={handleClick}
      disabled={disabled}
      className={cn(className)}
      title={label || "Regenerate"}
      aria-label={label || "Regenerate"}
    >
      <RefreshCw
        className={cn(
          "h-4 w-4 transition-all",
          isSpinning && "animate-spin", // Animation หมุน
          label && "mr-2"
        )}
      />
      {label}
    </Button>
  );
}
