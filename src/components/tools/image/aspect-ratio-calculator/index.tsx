"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function AspectRatioCalculator() {
  const [width, setWidth] = useState<number>(1920);
  const [height, setHeight] = useState<number>(1080);

  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const divisor = gcd(width, height);
  const ratioW = width / divisor;
  const ratioH = height / divisor;

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-2">
          <Label>Width (px)</Label>
          <Input
            type="number"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label>Height (px)</Label>
          <Input
            type="number"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="p-8 bg-muted rounded-xl flex flex-col items-center justify-center text-center space-y-2">
        <span className="text-muted-foreground uppercase tracking-widest text-xs font-semibold">
          Aspect Ratio
        </span>
        <div className="text-5xl font-black bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          {ratioW} : {ratioH}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Common: 16:9, 4:3, 1:1, 21:9
        </p>
      </div>

      {/* Visual Box */}
      <div className="flex justify-center">
        <div
          className="bg-primary/20 border-2 border-primary rounded-md transition-all duration-300 flex items-center justify-center text-xs font-mono"
          style={{
            width: "200px",
            height: `${(200 * height) / width}px`,
            maxHeight: "300px",
          }}
        >
          Preview
        </div>
      </div>
    </div>
  );
}
