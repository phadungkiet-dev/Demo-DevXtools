"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DownloadButtonProps {
  text: string; // ข้อความที่จะดาวน์โหลด
  filename: string; // ชื่อไฟล์ (ไม่ต้องใส่นามสกุล)
  extension?: string; // นามสกุลไฟล์ (default: txt)
  className?: string;
}

export function DownloadButton({
  text,
  filename,
  extension = "txt",
  className,
}: DownloadButtonProps) {
  const handleDownload = () => {
    if (!text) return;

    try {
      // Create Blob
      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);

      // Create invisible link
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.${extension}`;
      document.body.appendChild(a);

      // Trigger click & Cleanup
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Downloaded ${filename}.${extension}`);
    } catch (err) {
      console.error("Download failed", err);
      toast.error("Failed to download file");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("text-muted-foreground hover:text-primary", className)}
      onClick={handleDownload}
      disabled={!text}
      title={`Download as .${extension}`}
      aria-label={`Download ${filename}.${extension}`}
    >
      <Download className="h-4 w-4" />
    </Button>
  );
}
