"use client";

// =============================================================================
// Imports
// =============================================================================
import { useState, useEffect } from "react";
import { Check, Copy, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// =============================================================================
// Types
// =============================================================================
interface CopyButtonProps {
  text: string;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
}

// =============================================================================
// Component
// =============================================================================
export function CopyButton({
  text,
  className,
  variant = "ghost",
  size = "icon",
  disabled,
}: CopyButtonProps) {
  // ✅ State สำหรับจัดการ Icon Feedback
  const [hasCopied, setHasCopied] = useState(false);

  // ✅ Reset Icon กลับหลัง 2 วินาที
  useEffect(() => {
    if (hasCopied) {
      const timeout = setTimeout(() => setHasCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [hasCopied]);

  const handleCopy = async () => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setHasCopied(true); // ✅ เปลี่ยนไอคอนปุ่ม

      // ✅ Toast: Minimal Style (พื้นหลังขาว + ไอคอนเขียว)
      toast("Copied to clipboard", {
        icon: <Check className="h-4 w-4 text-green-500" />,
      });
    } catch (err) {
      console.error("Copy failed", err);

      // ✅ Error Toast: พื้นหลังขาว + ไอคอนแดง
      toast("Failed to copy text", {
        icon: <AlertCircle className="h-4 w-4 text-destructive" />,
      });
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      // ✅ แก้ไข: ย้ายสีมาคุมที่ Button แทน เพื่อให้รับ Class จากภายนอกได้สมบูรณ์
      className={cn(
        "text-muted-foreground hover:text-primary transition-all duration-200",
        className
      )}
      onClick={handleCopy}
      disabled={disabled || !text}
      aria-label={hasCopied ? "Copied" : "Copy to clipboard"}
      title="Copy to clipboard"
    >
      {hasCopied ? (
        <Check className="h-4 w-4 text-green-500 animate-in zoom-in spin-in-90 duration-300" />
      ) : (
        // ✅ แก้ไข: ลบ text-muted-foreground/group-hover ออกจาก icon
        // ให้ Icon ใช้สีตาม Button (Inherit)
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );
}
