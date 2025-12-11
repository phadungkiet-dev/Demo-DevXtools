"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

export function GradientTextGenerator() {
  const [text, setText] = useState("CodeXKit is Awesome");
  const [color1, setColor1] = useState("#8b5cf6"); // Violet
  const [color2, setColor2] = useState("#3b82f6"); // Blue
  const [color3, setColor3] = useState("#ec4899"); // Pink
  const [angle, setAngle] = useState([45]);
  const [fontSize, setFontSize] = useState([60]);

  // CSS Code
  const cssCode = `font-size: ${fontSize[0]}px;
font-weight: 800;
background: linear-gradient(${angle[0]}deg, ${color1}, ${color2}, ${color3});
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
color: transparent;`;

  const copyCss = () => {
    navigator.clipboard.writeText(cssCode);
    toast.success("Copied CSS!");
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Controls */}
      <div className="bg-card p-6 rounded-xl border shadow-sm space-y-6">
        <div className="space-y-2">
          <Label>Text Content</Label>
          <Input value={text} onChange={(e) => setText(e.target.value)} />
        </div>

        <div className="space-y-4">
          <Label>Colors</Label>
          <div className="flex gap-4">
            <div className="space-y-1">
              <input
                type="color"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                className="h-10 w-full cursor-pointer rounded border"
              />
              <div className="text-xs font-mono text-center opacity-70">
                {color1}
              </div>
            </div>
            <div className="space-y-1">
              <input
                type="color"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                className="h-10 w-full cursor-pointer rounded border"
              />
              <div className="text-xs font-mono text-center opacity-70">
                {color2}
              </div>
            </div>
            <div className="space-y-1">
              <input
                type="color"
                value={color3}
                onChange={(e) => setColor3(e.target.value)}
                className="h-10 w-full cursor-pointer rounded border"
              />
              <div className="text-xs font-mono text-center opacity-70">
                {color3}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <Label>Angle ({angle[0]}°)</Label>
          </div>
          <Slider value={angle} onValueChange={setAngle} min={0} max={360} />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <Label>Font Size ({fontSize[0]}px)</Label>
          </div>
          <Slider
            value={fontSize}
            onValueChange={setFontSize}
            min={20}
            max={150}
          />
        </div>

        <div className="relative pt-2">
          <Label className="mb-2 block">CSS Code</Label>
          <pre className="p-4 bg-muted/50 rounded-lg text-xs font-mono overflow-x-auto border relative">
            {cssCode}
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={copyCss}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </pre>
        </div>
      </div>

      {/* Preview */}
      <div className="flex items-center justify-center min-h-[400px] bg-muted/20 rounded-xl border border-dashed p-8 overflow-hidden">
        <h1
          style={{
            fontSize: `${fontSize[0]}px`,
            fontWeight: 800,
            backgroundImage: `linear-gradient(${angle[0]}deg, ${color1}, ${color2}, ${color3})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          {text}
        </h1>
      </div>
    </div>
  );
}
