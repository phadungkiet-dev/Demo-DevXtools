"use client";

import { useState } from "react";
import { Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export function GlassmorphismGenerator() {
  // --- State สำหรับเก็บค่า Config ---
  const [blur, setBlur] = useState([10]);
  const [transparency, setTransparency] = useState([0.25]);
  const [saturation, setSaturation] = useState([180]);
  const [borderRadius, setBorderRadius] = useState([12]);

  // สร้าง CSS Code String
  const cssCode = `background: rgba(255, 255, 255, ${transparency[0]});
backdrop-filter: blur(${blur[0]}px) saturate(${saturation[0]}%);
-webkit-backdrop-filter: blur(${blur[0]}px) saturate(${saturation[0]}%);
border-radius: ${borderRadius[0]}px;
border: 1px solid rgba(209, 213, 219, 0.3);`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode);
    toast.success("Copied CSS to clipboard!");
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* --- Controls Panel --- */}
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Blur ({blur[0]}px)</Label>
              </div>
              <Slider value={blur} onValueChange={setBlur} max={20} step={1} />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Transparency ({transparency[0]})</Label>
              </div>
              <Slider
                value={transparency}
                onValueChange={setTransparency}
                max={1}
                step={0.01}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Saturation ({saturation[0]}%)</Label>
              </div>
              <Slider
                value={saturation}
                onValueChange={setSaturation}
                max={200}
                step={1}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Border Radius ({borderRadius[0]}px)</Label>
              </div>
              <Slider
                value={borderRadius}
                onValueChange={setBorderRadius}
                max={50}
                step={1}
              />
            </div>
          </CardContent>
        </Card>

        {/* CSS Output */}
        <div className="relative group">
          <div className="absolute right-2 top-2">
            <Button size="sm" variant="ghost" onClick={copyToClipboard}>
              <Copy className="h-4 w-4 mr-2" /> Copy CSS
            </Button>
          </div>
          <pre className="p-4 bg-muted/50 rounded-lg text-sm font-mono overflow-x-auto border">
            {cssCode}
          </pre>
        </div>
      </div>

      {/* --- Preview Panel (The Wow Factor) --- */}
      <div
        className="relative h-[400px] lg:h-auto rounded-xl flex items-center justify-center overflow-hidden bg-cover bg-center transition-all"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop')",
        }}
      >
        {/* Floating Shapes for depth */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute bottom-10 right-10 w-20 h-20 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />

        {/* The Glass Card */}
        <div
          className="relative w-64 h-40 p-6 text-black shadow-xl"
          style={{
            background: `rgba(255, 255, 255, ${transparency[0]})`,
            backdropFilter: `blur(${blur[0]}px) saturate(${saturation[0]}%)`,
            WebkitBackdropFilter: `blur(${blur[0]}px) saturate(${saturation[0]}%)`,
            borderRadius: `${borderRadius[0]}px`,
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <h3 className="font-bold text-lg mb-1">Glassmorphism</h3>
          <p className="text-sm opacity-80">
            This creates a frosted glass effect using backdrop-filter.
          </p>
        </div>
      </div>
    </div>
  );
}
