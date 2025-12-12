"use client"; // Client Component เพราะต้องใช้ Browser API (navigator) และ State

import { useState, useEffect } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CopyButtonProps {
  text: string; // ข้อความที่จะ copy
  className?: string; // รับ styling เพิ่มเติมได้
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false); // State เก็บสถานะการ copy

  // Use Effect for cleanup timeout (More robust way)
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeout); // Cleanup on unmount/change
    }
  }, [copied]);

  const handleCopy = async () => {
    if (!text) return; // Guard clause: ถ้าไม่มี text ไม่ต้องทำอะไร

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard");
    } catch (err) {
      console.error("Copy failed", err); // Log error for debugging
      toast.error("Failed to copy"); // Error handling
    }
  };

  return (
    <Button
      type="button" // ✅ Prevent accidental form submission
      variant="ghost"
      size="icon"
      className={className}
      onClick={handleCopy}
      disabled={!text}
      aria-label="Copy to clipboard" // ✅ Accessibility Support
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4 text-muted-foreground" />
      )}
    </Button>
  );
}
