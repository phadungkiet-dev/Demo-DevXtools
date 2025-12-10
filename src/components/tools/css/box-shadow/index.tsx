"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/shared/copy-button";

export function BoxShadowGenerator() {
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(4);
  const [blur, setBlur] = useState(10);
  const [spread, setSpread] = useState(0);
  const [opacity, setOpacity] = useState(50); // 0-100
  const [color, setColor] = useState("#000000");
  const [inset, setInset] = useState(false);

  // คำนวณ CSS String
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha / 100})`;
  };

  const shadowValue = `${
    inset ? "inset " : ""
  }${offsetX}px ${offsetY}px ${blur}px ${spread}px ${hexToRgba(
    color,
    opacity
  )}`;
  const cssCode = `box-shadow: ${shadowValue};`;

  return (
    <div className="grid gap-8 lg:grid-cols-12 h-full">
      {/* Controls Panel (Left/Top) */}
      <div className="lg:col-span-5 space-y-6">
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Offset X */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Horizontal Offset (X)</Label>
                <span className="text-xs text-muted-foreground">
                  {offsetX}px
                </span>
              </div>
              <Slider
                min={-50}
                max={50}
                step={1}
                value={[offsetX]}
                onValueChange={(v) => setOffsetX(v[0])}
              />
            </div>

            {/* Offset Y */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Vertical Offset (Y)</Label>
                <span className="text-xs text-muted-foreground">
                  {offsetY}px
                </span>
              </div>
              <Slider
                min={-50}
                max={50}
                step={1}
                value={[offsetY]}
                onValueChange={(v) => setOffsetY(v[0])}
              />
            </div>

            {/* Blur */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Blur Radius</Label>
                <span className="text-xs text-muted-foreground">{blur}px</span>
              </div>
              <Slider
                min={0}
                max={100}
                step={1}
                value={[blur]}
                onValueChange={(v) => setBlur(v[0])}
              />
            </div>

            {/* Spread */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Spread Radius</Label>
                <span className="text-xs text-muted-foreground">
                  {spread}px
                </span>
              </div>
              <Slider
                min={-50}
                max={50}
                step={1}
                value={[spread]}
                onValueChange={(v) => setSpread(v[0])}
              />
            </div>

            {/* Opacity */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Opacity</Label>
                <span className="text-xs text-muted-foreground">
                  {opacity}%
                </span>
              </div>
              <Slider
                min={0}
                max={100}
                step={1}
                value={[opacity]}
                onValueChange={(v) => setOpacity(v[0])}
              />
            </div>

            {/* Color Picker */}
            <div className="space-y-3">
              <Label>Shadow Color</Label>
              <div className="flex gap-3">
                <Input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="font-mono uppercase"
                  maxLength={7}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Panel (Right/Bottom) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        {/* Visual Preview */}
        <Card className="flex-1 min-h-[300px] flex items-center justify-center bg-muted/20 overflow-hidden">
          <div
            className="w-48 h-48 bg-background rounded-xl flex items-center justify-center border transition-all duration-200"
            style={{ boxShadow: shadowValue }}
          >
            <span className="text-muted-foreground font-medium">Preview</span>
          </div>
        </Card>

        {/* Code Output */}
        <Card className="bg-muted/50 border-primary/20">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <code className="font-mono text-sm text-primary break-all">
              {cssCode}
            </code>
            <CopyButton text={cssCode} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
