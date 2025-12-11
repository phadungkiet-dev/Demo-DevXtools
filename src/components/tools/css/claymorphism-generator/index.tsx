"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

export function ClaymorphismGenerator() {
  const [color, setColor] = useState("#6366f1"); // Indigo
  const [size, setSize] = useState([200]);
  const [radius, setRadius] = useState([40]);
  const [shadow, setShadow] = useState([20]); // Depth

  // Claymorphism CSS Logic
  // หลักการ: ใช้ Box-Shadow ซ้อนกัน 2 ชั้น (Inset + Outset) เพื่อสร้างมิติ
  const cssCode = `background: ${color};
border-radius: ${radius[0]}px;
box-shadow: 
  ${shadow[0]}px ${shadow[0]}px ${shadow[0] * 2}px rgba(0, 0, 0, 0.25),
  inset ${shadow[0] / 2}px ${shadow[0] / 2}px ${
    shadow[0]
  }px rgba(255, 255, 255, 0.2),
  inset -${shadow[0] / 2}px -${shadow[0] / 2}px ${
    shadow[0]
  }px rgba(0, 0, 0, 0.2);`;

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-center">
      {/* Controls */}
      <div className="bg-card p-6 rounded-xl border shadow-sm space-y-6">
        <div className="space-y-4">
          <Label>Base Color</Label>
          <div className="flex gap-4 flex-wrap">
            {[
              "#6366f1",
              "#ec4899",
              "#ef4444",
              "#f59e0b",
              "#10b981",
              "#3b82f6",
            ].map((c) => (
              <button
                key={c}
                className={`w-8 h-8 rounded-full border-2 ${
                  color === c ? "border-foreground" : "border-transparent"
                }`}
                style={{ background: c }}
                onClick={() => setColor(c)}
              />
            ))}
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 rounded-full overflow-hidden border-0 p-0 cursor-pointer"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <Label>Size ({size[0]}px)</Label>
          </div>
          <Slider value={size} onValueChange={setSize} min={100} max={400} />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <Label>Border Radius ({radius[0]}px)</Label>
          </div>
          <Slider value={radius} onValueChange={setRadius} min={0} max={100} />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <Label>Depth / Shadow ({shadow[0]}px)</Label>
          </div>
          <Slider value={shadow} onValueChange={setShadow} min={5} max={50} />
        </div>

        <div className="relative pt-4">
          <Button
            className="w-full"
            onClick={() => {
              navigator.clipboard.writeText(cssCode);
              toast.success("Copied!");
            }}
          >
            <Copy className="h-4 w-4 mr-2" /> Copy CSS
          </Button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex items-center justify-center min-h-[400px] bg-muted/30 rounded-xl border border-dashed relative">
        <div
          className="flex items-center justify-center transition-all duration-300"
          style={{
            width: `${size[0]}px`,
            height: `${size[0]}px`,
            backgroundColor: color,
            borderRadius: `${radius[0]}px`,
            boxShadow: `
                ${shadow[0]}px ${shadow[0]}px ${
              shadow[0] * 2
            }px rgba(0, 0, 0, 0.25),
                inset ${shadow[0] / 2}px ${shadow[0] / 2}px ${
              shadow[0]
            }px rgba(255, 255, 255, 0.2),
                inset -${shadow[0] / 2}px -${shadow[0] / 2}px ${
              shadow[0]
            }px rgba(0, 0, 0, 0.2)
             `,
          }}
        >
          <span className="text-white font-bold text-xl mix-blend-overlay">
            Clay UI
          </span>
        </div>
      </div>
    </div>
  );
}
