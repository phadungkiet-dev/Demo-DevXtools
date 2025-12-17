"use client";

// =============================================================================
// Imports
// =============================================================================
import { useState, useEffect } from "react";
import { Download, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// =============================================================================
// Types
// =============================================================================
interface DownloadButtonProps {
  /** ข้อความหรือข้อมูลที่ต้องการดาวน์โหลด */
  text: string;

  /** ชื่อไฟล์ (ไม่ต้องใส่นามสกุล) */
  filename: string;

  /** นามสกุลไฟล์ (default: txt) */
  extension?: string;

  /** Class เพิ่มเติมสำหรับปรับแต่ง Style */
  className?: string;

  /** รูปแบบปุ่ม (Optional) */
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";

  /** ขนาดปุ่ม (Optional) */
  size?: "default" | "sm" | "lg" | "icon";

  /** สถานะปิดการใช้งาน */
  disabled?: boolean;
}

// =============================================================================
// Component
// =============================================================================
export function DownloadButton({
  text,
  filename,
  extension = "txt",
  className,
  variant = "ghost", // Default style
  size = "icon", // Default size
  disabled,
}: DownloadButtonProps) {
  // ✅ State สำหรับจัดการ Icon Feedback
  const [isDownloaded, setIsDownloaded] = useState(false);

  // ✅ Reset Icon กลับหลัง 2 วินาที
  useEffect(() => {
    if (isDownloaded) {
      const timeout = setTimeout(() => setIsDownloaded(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [isDownloaded]);

  /**
   * 📥 Handle File Download
   */
  const handleDownload = () => {
    if (!text) return;

    try {
      // 1. สร้าง Blob Object จาก Text
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });

      // 2. สร้าง URL สำหรับ Blob
      const url = URL.createObjectURL(blob);

      // 3. สร้าง Element <a> ชั่วคราว (Invisible Link)
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.${extension}`;
      link.style.display = "none";
      document.body.appendChild(link);

      // 4. Trigger Download & Cleanup
      link.click();

      // 5. ลบ Element และคืนค่า Memory
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // ✅ เปลี่ยนไอคอนปุ่มเป็นสีเขียว
      setIsDownloaded(true);

      // ✅ Toast: Minimal Style (พื้นหลังขาว + ไอคอนเขียว)
      toast(`Downloaded ${filename}.${extension}`, {
        icon: <Check className="h-4 w-4 text-green-500" />,
      });
    } catch (err) {
      console.error("Download failed", err);

      // ✅ Error Toast: พื้นหลังขาว + ไอคอนแดง
      toast("Failed to download file", {
        icon: <AlertCircle className="h-4 w-4 text-destructive" />,
      });
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn(
        "text-muted-foreground hover:text-primary transition-colors",
        className
      )}
      onClick={handleDownload}
      disabled={disabled || !text}
      title={`Download as .${extension}`}
      aria-label={`Download ${filename}.${extension}`}
    >
      {/* ✅ Icon Feedback: เปลี่ยนเป็น Check สีเขียวเมื่อ Download สำเร็จ */}
      {isDownloaded ? (
        <Check className="h-4 w-4 text-green-500 animate-in zoom-in spin-in-90 duration-300" />
      ) : (
        <Download className="h-4 w-4" />
      )}
    </Button>
  );
}
