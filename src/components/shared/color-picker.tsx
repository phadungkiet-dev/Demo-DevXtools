"use client";

import { HexColorPicker } from "react-colorful";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // ✅ Import จากไฟล์ที่ shadcn สร้างให้
import { Paintbrush } from "lucide-react";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
}

export function ColorPicker({ color, onChange, className }: ColorPickerProps) {
  // Preset Colors (Tailwind Palette Style)
  const presets = [
    "#ef4444", // red
    "#f97316", // orange
    "#f59e0b", // amber
    "#84cc16", // lime
    "#10b981", // emerald
    "#06b6d4", // cyan
    "#3b82f6", // blue
    "#6366f1", // indigo
    "#8b5cf6", // violet
    "#d946ef", // fuchsia
    "#f43f5e", // rose
    "#000000", // black
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal px-3 py-6 relative overflow-hidden group border-border/60 hover:border-primary/50 transition-all",
            className
          )}
        >
          {/* Background Preview (จางๆ ด้านหลังปุ่ม) */}
          <div
            className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
            style={{ backgroundColor: color }}
          />

          <div className="flex items-center gap-3 z-10 w-full">
            {/* Color Swatch (กล่องสีเล็ก) */}
            <div
              className="w-6 h-6 rounded-md border border-border/50 shadow-sm shrink-0"
              style={{ backgroundColor: color }}
            />

            <div className="flex flex-col items-start gap-0.5 min-w-0">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Pick Color
              </span>
              <span className="font-mono text-sm font-medium truncate">
                {color}
              </span>
            </div>

            <Paintbrush className="ml-auto h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-4 space-y-4" align="start">
        {/* Custom CSS for react-colorful to match Shadcn Theme */}
        <style jsx global>{`
          .react-colorful {
            width: 100% !important;
            height: 180px !important;
            border-radius: 0.5rem;
          }
          .react-colorful__saturation {
            border-radius: 0.5rem 0.5rem 0 0;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          }
          .react-colorful__hue {
            height: 24px;
            border-radius: 0 0 0.5rem 0.5rem;
            margin-top: -1px;
          }
          .react-colorful__pointer {
            width: 20px;
            height: 20px;
            border: 2px solid #fff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
        `}</style>

        {/* Color Wheel */}
        <div className="w-[240px]">
          <HexColorPicker color={color} onChange={onChange} />
        </div>

        {/* Presets Grid */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Presets
          </span>
          <div className="grid grid-cols-6 gap-2">
            {presets.map((preset) => (
              <button
                key={preset}
                className={cn(
                  "w-8 h-8 rounded-md border border-border/50 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50",
                  color.toLowerCase() === preset.toLowerCase() &&
                    "ring-2 ring-primary border-primary"
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
