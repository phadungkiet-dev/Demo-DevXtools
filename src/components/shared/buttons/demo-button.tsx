"use client";

// Imports ================
import { useState, useEffect } from "react";
import { Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Types =================
interface DemoButtonProps {
  onDemo: () => void;
  className?: string;
  disabled?: boolean;
}

// Component ==============
export function DemoButton({ onDemo, className, disabled }: DemoButtonProps) {
  // เพิ่ม State สำหรับจัดการ Icon Feedback
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset Icon กลับหลัง 2 วินาที
  useEffect(() => {
    if (isLoaded) {
      const timeout = setTimeout(() => setIsLoaded(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [isLoaded]);

  // Wrapper Function: กดปุ่มแล้วทำ 2 อย่าง (Load Data + Show Toast)
  const handleClick = () => {
    // เรียกฟังก์ชันหลัก
    onDemo();
    setIsLoaded(true);

    // แสดง Toast (ย้ายมาจากหน้า CaseConverter)
    // ใช้ Style Minimal: พื้นหลังขาว + Icon สี Primary
    toast("Demo content loaded", {
      icon: <Sparkles className="h-4 w-4 text-purple-500" />,
    });
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
      onClick={handleClick}
      disabled={disabled}
      title="Load data example"
    >
      {/* Icon Feedback: เปลี่ยนเป็น Check สีเขียวเมื่อโหลดเสร็จ */}
      {isLoaded ? (
        <Check className="h-3.5 w-3.5 text-green-500 animate-in zoom-in spin-in-90 duration-300" />
      ) : (
        <Sparkles className="h-3.5 w-3.5" />
      )}
      Demo
    </Button>
  );
}
