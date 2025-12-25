"use client";

// Imports ================
import { HexColorPicker } from "react-colorful";
import { Paintbrush } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Constants ===============
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

// Types ==================
interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
  disabled?: boolean;
}

// Component ===============
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
          variant="ghost"
          disabled={disabled}
          className={cn(
            // Layout & Flexbox
            "relative w-full flex items-center justify-between overflow-hidden",
            // Spacing
            "px-3 py-6",
            // Typography
            "text-left font-normal",
            // Visuals
            "group border border-border/60",
            // Interaction
            "transition-all hover:border-border/80",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
        >
          <div
            className={cn(
              // Positioning
              "absolute inset-0",
              // UX/Interaction
              "pointer-events-none",
              // Visuals
              "opacity-10",
              // Animation & State
              "transition-opacity group-hover:opacity-20"
            )}
            style={{ backgroundColor: color }}
          />
          <div className="flex gap-3 items-center w-full">
            <div
              // w-6 h-6 rounded-md border border-border/50 shadow-sm shrink-0
              className="w-8 h-8 rounded-md border border-border/40 shadow-sm"
              style={{ backgroundColor: color }}
            />
            <div className="flex flex-col items-start gap-0.5 min-w-0">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">
                Pick Color
              </span>
              <span className="font-mono text-sm font-medium truncate uppercase">
                {color}
              </span>
            </div>
            <Paintbrush className="ml-auto h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-full sm:w-[300px] p-4 space-y-4"
        align="start"
      >
        {/* 🎨 Responsive Style for react-colorful 
          - w-full: ยืดเต็มความกว้าง Popover
          - h-[200px]: ความสูงมาตรฐานที่กดง่ายทั้ง Desktop/Mobile
        */}
        {/* w-full [&_.react-colorful]:w-full [&_.react-colorful]:h-[200px] [&_.react-colorful]:rounded-lg [&_.react-colorful__saturation]:rounded-t-lg [&_.react-colorful__saturation]:border-b [&_.react-colorful__saturation]:border-border/10 [&_.react-colorful__hue]:h-8 [&_.react-colorful__hue]:rounded-b-lg [&_.react-colorful__hue]:mt-[-1px] [&_.react-colorful__pointer]:w-6 [&_.react-colorful__pointer]:h-6 [&_.react-colorful__pointer]:border-2 
        [&_.react-colorful__pointer]:border-white [&_.react-colorful__pointer]:shadow-sm */}
        <div className="w-full flex flex-col [&_.react-colorful]:!w-full ">
          <HexColorPicker color={color} onChange={onChange} />
        </div>

        <div className="space-y-2">
          <span className="text-[12px] font-bold text-muted-foreground uppercase">
            Presets
          </span>
          <div className="grid grid-cols-6 gap-2">
            {PRESET_COLORS.map((preset) => (
              <button
                key={preset}
                type="button"
                className={cn(
                  // Base Shape
                  "aspect-square rounded-md border border-border/50",
                  // Base Interaction
                  "transition-all duration-300 hover:scale-110",
                  // Focus State
                  "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background",
                  "focus:outline-none focus:ring-2 focus:ring-muted/50",
                  color.toLowerCase() === preset.toLowerCase() &&
                    cn(
                      // scale:
                      "scale-105",
                      // border:
                      "border-muted-foreground/60",
                      // ring:
                      "ring-2 ring-primary/60",
                      "ring-offset-2 ring-offset-background"
                    )
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
