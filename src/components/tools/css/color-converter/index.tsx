"use client";

import { useState, useMemo } from "react"; // เปลี่ยน useEffect เป็น useMemo
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/shared/copy-button";

export function ColorConverter() {
  const [hex, setHex] = useState("#3b82f6");

  // ✅ ใช้ useMemo คำนวณค่า (Derived State) แทนการใช้ useEffect
  const { rgb, hsl } = useMemo(() => {
    let color = hex.replace("#", "");
    if (color.length === 3)
      color = color
        .split("")
        .map((c) => c + c)
        .join("");

    if (color.length === 6) {
      const r = parseInt(color.substring(0, 2), 16);
      const g = parseInt(color.substring(2, 4), 16);
      const b = parseInt(color.substring(4, 6), 16);

      const rgbVal = `rgb(${r}, ${g}, ${b})`;

      // Calculate HSL
      const rNorm = r / 255,
        gNorm = g / 255,
        bNorm = b / 255;
      const max = Math.max(rNorm, gNorm, bNorm),
        min = Math.min(rNorm, gNorm, bNorm);

      // ✅ แก้ไข: เปลี่ยน let เป็น const สำหรับ l เพราะไม่ได้ถูกเปลี่ยนค่าอีก
      const l = (max + min) / 2;

      let h = 0,
        s = 0;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case rNorm:
            h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
            break;
          case gNorm:
            h = (bNorm - rNorm) / d + 2;
            break;
          case bNorm:
            h = (rNorm - gNorm) / d + 4;
            break;
        }
        h /= 6;
      }

      const hslVal = `hsl(${Math.round(h * 360)}, ${Math.round(
        s * 100
      )}%, ${Math.round(l * 100)}%)`;

      return { rgb: rgbVal, hsl: hslVal };
    }

    return { rgb: "", hsl: "" };
  }, [hex]);

  return (
    <div className="grid gap-8 lg:grid-cols-2 max-w-4xl mx-auto">
      <div className="space-y-6">
        <Card
          className="h-48"
          style={{
            backgroundColor:
              hex.length === 7 || hex.length === 4 ? hex : "#fff",
          }}
        >
          <CardContent className="h-full flex items-center justify-center">
            <span className="bg-white/90 px-4 py-2 rounded-lg font-mono font-bold text-black">
              {hex}
            </span>
          </CardContent>
        </Card>
        <div className="space-y-2">
          <Label>HEX Input</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="w-16 h-10 p-1 cursor-pointer"
            />
            <Input
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="uppercase font-mono"
              maxLength={7}
            />
          </div>
        </div>
      </div>
      <div className="space-y-6 pt-4">
        <div className="space-y-2">
          <Label>RGB</Label>
          <div className="flex gap-2">
            <Input value={rgb} readOnly />
            <CopyButton text={rgb} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>HSL</Label>
          <div className="flex gap-2">
            <Input value={hsl} readOnly />
            <CopyButton text={hsl} />
          </div>
        </div>
      </div>
    </div>
  );
}
