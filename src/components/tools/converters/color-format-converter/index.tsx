"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette, Pipette, Hash, Copy, Check, RefreshCcw } from "lucide-react";
import { CopyButton } from "@/components/shared/copy-button";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Colord Imports
import { colord, extend } from "colord";
import cmykPlugin from "colord/plugins/cmyk";
import namesPlugin from "colord/plugins/names";

// Extend plugins
extend([cmykPlugin, namesPlugin]);

export function ColorFormatConverter() {
  // State หลักเก็บเป็น HEX string
  const [color, setColor] = useState("#3B82F6"); // Default Blue-500

  // Derived States (คำนวณค่าต่างๆ จาก State หลัก)
  const [hex, setHex] = useState(color);
  const [rgb, setRgb] = useState("");
  const [hsl, setHsl] = useState("");
  const [cmyk, setCmyk] = useState("");
  const [name, setName] = useState("");

  // Sync: เมื่อ color เปลี่ยน -> อัปเดตทุกค่า
  useEffect(() => {
    // ✅ ใช้ setTimeout เพื่อแก้ Error setState-in-effect
    const timer = setTimeout(() => {
      const c = colord(color);
      setHex(c.toHex());
      setRgb(c.toRgbString());
      setHsl(c.toHslString());
      setCmyk(c.toCmykString());
      setName(c.toName({ closest: true }) || "Unknown");
    }, 0);

    return () => clearTimeout(timer);
  }, [color]);

  // Handler: เมื่อ User พิมพ์แก้ค่าในช่องต่างๆ
  const handleInputChange = (value: string) => {
    const c = colord(value);
    if (c.isValid()) {
      setColor(c.toHex());
    }
    // Note: เราไม่อัปเดต input state ทันทีถ้ามัน invalid
    // เพื่อให้ User พิมพ์ให้เสร็จก่อน (UI จะ update ตามเมื่อ valid)
  };

  const generateRandomColor = () => {
    const randomColor = colord({
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256),
    }).toHex();
    setColor(randomColor);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3 lg:h-[550px] transition-all">
      {/* ================= LEFT: VISUAL PREVIEW ================= */}
      <Card className="lg:col-span-1 border-border/60 shadow-md flex flex-col h-full overflow-hidden bg-card p-0">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-muted/30 min-h-[60px]">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-primary/10 rounded-md text-primary">
              <Palette size={16} />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              Color Preview
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={generateRandomColor}
            title="Random Color"
          >
            <RefreshCcw size={14} className="text-muted-foreground" />
          </Button>
        </div>

        <CardContent className="p-0 flex-1 relative flex flex-col">
          {/* Big Color Block */}
          <div
            className="flex-1 w-full relative group cursor-pointer transition-all"
            style={{ backgroundColor: color }}
            onClick={() => {
              const input = document.getElementById(
                "native-color-picker"
              ) as HTMLInputElement;
              input?.click();
            }}
          >
            {/* Hidden Native Input */}
            <input
              type="color"
              id="native-color-picker"
              value={hex}
              onChange={(e) => setColor(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />

            {/* Overlay Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
              <Pipette className="text-white w-8 h-8 mb-2 drop-shadow-md" />
              <span className="text-white font-medium text-sm drop-shadow-md">
                Click to Pick
              </span>
            </div>
          </div>

          {/* Color Info Footer */}
          <div className="p-6 bg-card border-t border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                  Closest Name
                </p>
                <p className="text-lg font-bold capitalize text-foreground mt-0.5">
                  {name}
                </p>
              </div>
              {/* Contrast Badge (Optional Idea) */}
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                  Contrast
                </p>
                <p
                  className={cn(
                    "text-sm font-bold px-2 py-0.5 rounded mt-1 inline-block",
                    colord(color).isLight()
                      ? "bg-black text-white"
                      : "bg-white text-black border border-border"
                  )}
                >
                  {colord(color).isLight() ? "Light" : "Dark"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ================= RIGHT: CONVERTERS ================= */}
      <Card className="lg:col-span-2 border-border/60 shadow-md flex flex-col h-full bg-card/50 backdrop-blur-sm p-0">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border/40 bg-muted/30 min-h-[60px]">
          <div className="p-1.5 bg-primary/10 rounded-md text-primary">
            <RefreshCcw size={16} />
          </div>
          <span className="text-sm font-semibold text-muted-foreground">
            Converters
          </span>
        </div>

        <CardContent className="p-6 flex flex-col gap-6 overflow-y-auto">
          {/* HEX Input */}
          <ColorInputRow
            label="HEX"
            value={hex}
            onChange={(val) => {
              setHex(val); // Update local for typing feel
              handleInputChange(val);
            }}
            placeholder="#000000"
          />

          {/* RGB Input */}
          <ColorInputRow
            label="RGB"
            value={rgb}
            onChange={(val) => {
              setRgb(val);
              handleInputChange(val);
            }}
            placeholder="rgb(0, 0, 0)"
          />

          {/* HSL Input */}
          <ColorInputRow
            label="HSL"
            value={hsl}
            onChange={(val) => {
              setHsl(val);
              handleInputChange(val);
            }}
            placeholder="hsl(0, 0%, 0%)"
          />

          {/* CMYK Input */}
          <ColorInputRow
            label="CMYK"
            value={cmyk}
            onChange={(val) => {
              setCmyk(val);
              handleInputChange(val);
            }}
            placeholder="device-cmyk(0, 0, 0, 1)"
          />

          {/* CSS Variable Example (Read only) */}
          <div className="pt-4 border-t border-border/50">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-3 block">
              CSS Usage
            </Label>
            <div className="relative group">
              <code className="block w-full p-4 rounded-lg bg-muted/50 border border-border font-mono text-sm text-foreground">
                color: {hex}; <br />
                {"/* or */"} <br />
                background-color: {rgb};
              </code>
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <CopyButton text={`color: ${hex};`} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper Component for Input Rows
function ColorInputRow({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        {/* Visual Indicator dot */}
        <div className="w-2 h-2 rounded-full bg-primary/20" />
      </div>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="font-mono"
        />
        <CopyButton text={value} className="h-10 w-10 shrink-0" />
      </div>
    </div>
  );
}
