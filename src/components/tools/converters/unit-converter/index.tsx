"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, Settings2 } from "lucide-react";
import { CopyButton } from "@/components/shared/copy-button";

export function UnitConverter() {
  const [baseSize, setBaseSize] = useState<number>(16);
  const [px, setPx] = useState<string>("16");
  const [rem, setRem] = useState<string>("1");

  // Handle PX Change
  const handlePxChange = (value: string) => {
    setPx(value);
    if (value === "") {
      setRem("");
      return;
    }
    const val = parseFloat(value);
    if (!isNaN(val)) {
      setRem((val / baseSize).toFixed(4).replace(/\.?0+$/, "")); // ตัด 0 ท้ายทิ้ง
    }
  };

  // Handle REM Change
  const handleRemChange = (value: string) => {
    setRem(value);
    if (value === "") {
      setPx("");
      return;
    }
    const val = parseFloat(value);
    if (!isNaN(val)) {
      setPx((val * baseSize).toFixed(0)); // PX มักเป็นจำนวนเต็ม หรือทศนิยมไม่เยอะ
    }
  };

  // Handle Base Size Change (Recalculate REM based on current PX)
  const handleBaseChange = (value: string) => {
    const val = parseFloat(value);
    setBaseSize(val);
    if (!isNaN(val) && val > 0 && px) {
      const pxVal = parseFloat(px);
      if (!isNaN(pxVal)) {
        setRem((pxVal / val).toFixed(4).replace(/\.?0+$/, ""));
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Base Setting */}
      <Card className="bg-muted/30">
        <CardContent className="p-4 flex items-center gap-4">
          <Settings2 className="w-5 h-5 text-muted-foreground" />
          <div className="flex-1 flex items-center gap-2">
            <Label htmlFor="base-size" className="whitespace-nowrap">
              Base Font Size (px):
            </Label>
            <Input
              id="base-size"
              type="number"
              value={baseSize}
              onChange={(e) => handleBaseChange(e.target.value)}
              className="w-20 bg-background"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Default is usually 16px
          </div>
        </CardContent>
      </Card>

      {/* Converter Area */}
      <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
        {/* PX Input */}
        <div className="space-y-2">
          <Label htmlFor="px-input" className="text-lg">
            Pixels (px)
          </Label>
          <div className="relative">
            <Input
              id="px-input"
              type="number"
              value={px}
              onChange={(e) => handlePxChange(e.target.value)}
              className="h-14 text-2xl font-mono pr-12"
              placeholder="16"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <CopyButton text={px} />
            </div>
          </div>
        </div>

        {/* Arrow Icon (Hidden on mobile, shown on desktop) */}
        <div className="flex justify-center py-2 md:py-0 text-muted-foreground">
          <ArrowRightLeft className="w-6 h-6 rotate-90 md:rotate-0" />
        </div>

        {/* REM Input */}
        <div className="space-y-2">
          <Label htmlFor="rem-input" className="text-lg">
            REM
          </Label>
          <div className="relative">
            <Input
              id="rem-input"
              type="number"
              value={rem}
              onChange={(e) => handleRemChange(e.target.value)}
              className="h-14 text-2xl font-mono pr-12"
              placeholder="1"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <CopyButton text={rem} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Reference Table (Optional but useful) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
        {[8, 12, 14, 16, 20, 24, 32, 48].map((size) => (
          <Button
            key={size}
            variant="outline"
            className="flex justify-between font-mono"
            onClick={() => handlePxChange(size.toString())}
          >
            <span>{size}px</span>
            <span className="text-muted-foreground">
              {(size / baseSize).toFixed(3).replace(/\.?0+$/, "")}rem
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
