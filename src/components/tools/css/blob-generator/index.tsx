"use client";

import { useState } from "react";
import { Copy, RefreshCw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

export function BlobGenerator() {
  // ค่าความโค้งมนของทั้ง 4 มุม (8 values for border-radius)
  const [points, setPoints] = useState({
    r1: 50,
    r2: 50,
    r3: 50,
    r4: 50, // Horizontal radii
    r5: 50,
    r6: 50,
    r7: 50,
    r8: 50, // Vertical radii
  });

  const [size, setSize] = useState([300]);
  const [color, setColor] = useState("#3b82f6"); // Primary Blue

  // สุ่มรูปทรงใหม่
  const randomize = () => {
    const random = () => Math.floor(Math.random() * 40) + 30; // Random between 30-70%
    setPoints({
      r1: random(),
      r2: random(),
      r3: random(),
      r4: random(),
      r5: random(),
      r6: random(),
      r7: random(),
      r8: random(),
    });
  };

  // สร้าง CSS string
  const borderRadius = `${points.r1}% ${100 - points.r1}% ${100 - points.r2}% ${
    points.r2
  }% / ${points.r3}% ${points.r4}% ${100 - points.r4}% ${100 - points.r3}%`;
  const cssCode = `border-radius: ${borderRadius};\nbackground: ${color};`;

  const copyCss = () => {
    navigator.clipboard.writeText(cssCode);
    toast.success("Copied CSS to clipboard!");
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      {/* Controls */}
      <div className="space-y-6 bg-card p-6 rounded-xl border shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Configuration</h3>
          <Button variant="outline" size="sm" onClick={randomize}>
            <RefreshCw className="h-4 w-4 mr-2" /> Randomize
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Size ({size[0]}px)</Label>
            <Slider
              value={size}
              onValueChange={setSize}
              min={100}
              max={500}
              step={10}
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2 flex-wrap">
              {[
                "#3b82f6",
                "#ec4899",
                "#10b981",
                "#8b5cf6",
                "#f59e0b",
                "#000000",
              ].map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                    color === c ? "border-primary" : "border-transparent"
                  }`}
                  style={{ background: c }}
                />
              ))}
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 p-0 border-0 rounded-full overflow-hidden cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="relative group pt-4">
          <Label className="mb-2 block">CSS Code</Label>
          <pre className="p-4 bg-muted/50 rounded-lg text-sm font-mono overflow-x-auto border relative">
            {cssCode}
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={copyCss}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </pre>
        </div>
      </div>

      {/* Preview Area (The Wow Part) */}
      <div className="min-h-[400px] flex items-center justify-center bg-muted/30 rounded-xl border border-dashed relative overflow-hidden">
        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        ></div>

        {/* The Blob */}
        <div
          className="transition-all duration-500 ease-in-out shadow-xl flex items-center justify-center"
          style={{
            width: `${size[0]}px`,
            height: `${size[0]}px`,
            borderRadius: borderRadius,
            background: color,
          }}
        >
          <span className="text-white/80 font-medium mix-blend-overlay text-lg">
            Blob
          </span>
        </div>
      </div>
    </div>
  );
}
