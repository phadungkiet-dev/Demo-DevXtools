"use client";

// =============================================================================
// Imports
// =============================================================================
import { useState, useEffect } from "react";
import { ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// =============================================================================
// Types
// =============================================================================
interface SwapButtonProps {
  /** ฟังก์ชันสลับข้อมูลของ Parent Component */
  onSwap: () => void;

  /** Class เพิ่มเติม */
  className?: string;

  /** Disabled state */
  disabled?: boolean;
}

// =============================================================================
// Component
// =============================================================================
export function SwapButton({ onSwap, className, disabled }: SwapButtonProps) {
  // State สำหรับ Animation หมุนปุ่ม
  const [isSwapping, setIsSwapping] = useState(false);

  useEffect(() => {
    if (isSwapping) {
      const timeout = setTimeout(() => setIsSwapping(false), 500); // หมุน 0.5 วินาที
      return () => clearTimeout(timeout);
    }
  }, [isSwapping]);

  const handleSwap = () => {
    onSwap();
    setIsSwapping(true);

    // ✅ Toast: Minimal Style (พื้นหลังขาว + Icon ฟ้า)
    toast("Values swapped", {
      icon: <ArrowRightLeft className="h-4 w-4 text-blue-500" />,
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleSwap}
      disabled={disabled}
      className={cn(
        "rounded-full h-8 w-8 p-0 border-border/60 shadow-sm bg-background hover:bg-muted transition-all active:scale-95",
        className
      )}
      title="Swap Inputs"
      aria-label="Swap inputs"
    >
      <ArrowRightLeft
        size={14}
        className={cn(
          "text-muted-foreground transition-transform duration-500",
          isSwapping && "rotate-180 text-blue-500" // หมุนและเปลี่ยนสีเมื่อกด
        )}
      />
    </Button>
  );
}
