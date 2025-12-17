"use client";

// =============================================================================
// Imports
// =============================================================================
import { HexColorPicker } from "react-colorful";
import { Paintbrush } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// =============================================================================
// Constants
// =============================================================================
const PRESET_COLORS = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#84cc16",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#d946ef",
  "#f43f5e",
  "#000000",
];

// =============================================================================
// Types
// =============================================================================
interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
  disabled?: boolean;
}

// =============================================================================
// Component
// =============================================================================
export function ColorPicker({
  color,
  onChange,
  className,
  disabled = false,
}: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal px-3 py-6 relative overflow-hidden group border-border/60 hover:border-primary/50 transition-all",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
        >
          <div
            className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"
            style={{ backgroundColor: color }}
          />

          <div className="flex items-center gap-3 z-10 w-full">
            <div
              className="w-6 h-6 rounded-md border border-border/50 shadow-sm shrink-0"
              style={{ backgroundColor: color }}
            />
            <div className="flex flex-col items-start gap-0.5 min-w-0">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Pick Color
              </span>
              <span className="font-mono text-sm font-medium truncate uppercase">
                {color}
              </span>
            </div>
            <Paintbrush className="ml-auto h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[280px] sm:w-[320px] p-4 space-y-4"
        align="start"
      >
        {/* 🎨 Responsive Style for react-colorful 
          - w-full: ยืดเต็มความกว้าง Popover
          - h-[200px]: ความสูงมาตรฐานที่กดง่ายทั้ง Desktop/Mobile
        */}
        <div className="w-full [&_.react-colorful]:w-full [&_.react-colorful]:h-[200px] [&_.react-colorful]:rounded-lg [&_.react-colorful__saturation]:rounded-t-lg [&_.react-colorful__saturation]:border-b [&_.react-colorful__saturation]:border-border/10 [&_.react-colorful__hue]:h-8 [&_.react-colorful__hue]:rounded-b-lg [&_.react-colorful__hue]:mt-[-1px] [&_.react-colorful__pointer]:w-6 [&_.react-colorful__pointer]:h-6 [&_.react-colorful__pointer]:border-2 [&_.react-colorful__pointer]:border-white [&_.react-colorful__pointer]:shadow-sm">
          <HexColorPicker color={color} onChange={onChange} />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Presets
          </span>
          <div className="grid grid-cols-6 gap-2">
            {PRESET_COLORS.map((preset) => (
              <button
                key={preset}
                type="button"
                className={cn(
                  "aspect-square rounded-md border border-border/50 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50",
                  color.toLowerCase() === preset.toLowerCase() &&
                    "ring-2 ring-primary border-primary scale-105"
                )}
                style={{ backgroundColor: preset }}
                onClick={() => onChange(preset)}
                title={preset}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
