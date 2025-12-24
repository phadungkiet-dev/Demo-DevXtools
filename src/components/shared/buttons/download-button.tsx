"use client";

// Imports =================
import { useState, useEffect } from "react";
import { Download, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Types ============
interface DownloadButtonProps {
  /** ข้อความหรือข้อมูลที่ต้องการดาวน์โหลด */
  text: string;

  /** ชื่อไฟล์ (ไม่ต้องใส่นามสกุล) */
  filename: string;

  /** นามสกุลไฟล์ (default: txt) */
  extension?: string;

  /** Class เพิ่มเติมสำหรับปรับแต่ง Style */
  className?: string;

  /** สถานะปิดการใช้งาน */
  disabled?: boolean;
}

// Component ======================
export function DownloadButton({
  text,
  filename,
  extension = "txt",
  className,
  disabled,
}: DownloadButtonProps) {
  // State สำหรับจัดการ Icon Feedback
  const [isDownloaded, setIsDownloaded] = useState(false);

  // Reset Icon กลับหลัง 2 วินาที
  useEffect(() => {
    if (isDownloaded) {
      const timeout = setTimeout(() => setIsDownloaded(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [isDownloaded]);

  /** Handle File Download */
  const handleDownload = () => {
    if (!text) return;

    try {
      // สร้าง Blob Object จาก Text
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });

      // สร้าง URL สำหรับ Blob
      const url = URL.createObjectURL(blob);

      // สร้าง Element <a> ชั่วคราว (Invisible Link)
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.${extension}`;
      link.style.display = "none";
      document.body.appendChild(link);

      // Trigger Download & Cleanup
      link.click();

      // ลบ Element และคืนค่า Memory
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // เปลี่ยนไอคอนปุ่มเป็นสีเขียว
      setIsDownloaded(true);

      // Toast: Minimal Style (พื้นหลังขาว + ไอคอนเขียว)
      toast(`Downloaded ${filename}.${extension}`, {
        icon: <Check className="h-4 w-4 text-green-500" />,
      });
    } catch (err) {
      console.error("Download failed", err);

      // Error Toast: พื้นหลังขาว + ไอคอนแดง
      toast("Failed to download file", {
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
        "text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors",
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
