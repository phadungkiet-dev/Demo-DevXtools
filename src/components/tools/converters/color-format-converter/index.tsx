"use client";

// =============================================================================
// Imports
// =============================================================================
import { useState, useCallback } from "react";
// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Palette, Pipette, RefreshCcw, Info } from "lucide-react";
// Shared & Utils
import { CopyButton } from "@/components/shared/copy-button";
import { cn } from "@/lib/utils";
// Colord Library (Powerful color manipulation)
import { colord, extend, Colord } from "colord";
import cmykPlugin from "colord/plugins/cmyk";
import namesPlugin from "colord/plugins/names";
import a11yPlugin from "colord/plugins/a11y"; // สำหรับเช็ค Contrast

// ✅ Extend Plugins: เพิ่มความสามารถให้ colord
extend([cmykPlugin, namesPlugin, a11yPlugin]);

// =============================================================================
// Main Component
// =============================================================================
export function ColorFormatConverter() {
  // --- State Management ---
  // เราแยก State ของแต่ละ Input ออกจากกันเพื่อให้ User สามารถพิมพ์แก้ได้อิสระ
  // โดยไม่ถูก Override ทันทีที่พิมพ์ไม่เสร็จ
  const [hex, setHex] = useState("#3B82F6");
  const [rgb, setRgb] = useState("rgb(59, 130, 246)");
  const [hsl, setHsl] = useState("hsl(217, 91%, 60%)");
  const [cmyk, setCmyk] = useState("device-cmyk(76%, 47%, 0%, 4%)");

  // State สำหรับ Color Object หลักที่ใช้แสดงผล (Preview)
  const [previewColor, setPreviewColor] = useState<Colord>(colord("#3B82F6"));
  const [colorName, setColorName] = useState("Blue Ribbon");

  /**
   * 🟢 Centralized Update Function
   * ฟังก์ชันกลางสำหรับอัปเดตทุกค่าเมื่อได้รับ Valid Color
   * @param colorObj - วัตถุสีจาก colord
   * @param sourceFormat - รูปแบบต้นทาง (เพื่อไม่ให้ไปทับค่าที่กำลังพิมพ์อยู่)
   */
  const syncColors = useCallback((colorObj: Colord, sourceFormat?: string) => {
    if (!colorObj.isValid()) return;

    // อัปเดต Preview และชื่อสี
    setPreviewColor(colorObj);
    setColorName(colorObj.toName({ closest: true }) || "Unknown Color");

    // อัปเดต Input อื่นๆ ที่ไม่ใช่ต้นทาง (Source)
    if (sourceFormat !== "hex") setHex(colorObj.toHex());
    if (sourceFormat !== "rgb") setRgb(colorObj.toRgbString());
    if (sourceFormat !== "hsl") setHsl(colorObj.toHslString());
    if (sourceFormat !== "cmyk") setCmyk(colorObj.toCmykString());
  }, []);

  /**
   * 🎨 Handlers
   */

  // จัดการเมื่อ User พิมพ์ใน Input ต่างๆ
  const handleInputChange = (
    value: string,
    format: "hex" | "rgb" | "hsl" | "cmyk"
  ) => {
    // 1. อัปเดต State ของ Input นั้นทันที (เพื่อให้ UI ตอบสนองการพิมพ์)
    switch (format) {
      case "hex":
        setHex(value);
        break;
      case "rgb":
        setRgb(value);
        break;
      case "hsl":
        setHsl(value);
        break;
      case "cmyk":
        setCmyk(value);
        break;
    }

    // 2. ลอง Parse สีดูว่า Valid ไหม
    const c = colord(value);

    // 3. ถ้า Valid -> สั่ง Sync ค่าอื่นๆ
    if (c.isValid()) {
      syncColors(c, format);
    }
  };

  // จัดการปุ่ม Random Color
  const handleRandomColor = () => {
    const random = colord({
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256),
    });
    syncColors(random);
    // ต้อง Force update HEX เพราะไม่มี sourceFormat
    setHex(random.toHex());
  };

  // จัดการ Native Color Picker Input
  const handleNativePicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const c = colord(val);
    syncColors(c, "hex"); // ถือว่า Source คือ Hex
    setHex(val);
  };

  // คำนวณ Text Color (Black/White) ตาม Contrast ของพื้นหลัง
  const textColor = previewColor.isLight() ? "text-slate-900" : "text-white";
  const borderColor = previewColor.isLight()
    ? "border-slate-900/20"
    : "border-white/20";

  return (
    <div className="grid gap-6 lg:grid-cols-3 lg:h-[600px] transition-all duration-300 ease-in-out">
      {/* ================= LEFT PANEL: PREVIEW ================= */}
      <Card className="lg:col-span-1 border-border/60 shadow-md flex flex-col h-full overflow-hidden bg-card p-0 relative group">
        {/* Header Toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/40 bg-muted/30 min-h-[56px] absolute top-0 w-full z-10 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-md text-primary shadow-sm">
              <Palette size={16} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Preview
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRandomColor}
            className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
            title="Randomize Color"
          >
            <RefreshCcw size={14} />
          </Button>
        </div>

        <CardContent className="p-0 flex-1 relative flex flex-col pt-[56px]">
          {/* Main Color Block */}
          <div
            className="flex-1 w-full relative transition-colors duration-200 ease-linear cursor-pointer"
            style={{ backgroundColor: previewColor.toHex() }}
            onClick={() =>
              document.getElementById("native-color-picker")?.click()
            }
          >
            {/* Native Picker (Hidden but clickable via label/div) */}
            <input
              type="color"
              id="native-color-picker"
              value={previewColor.toHex()}
              onChange={handleNativePicker}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20"
            />

            {/* Overlay Instruction */}
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 backdrop-blur-[1px] z-10 pointer-events-none">
              <div className="bg-background/90 text-foreground px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                <Pipette size={16} />
                <span className="text-xs font-bold">Click to Pick</span>
              </div>
            </div>

            {/* Color Info Overlay (Always visible) */}
            <div
              className={cn(
                "absolute bottom-6 left-6 right-6 flex flex-col gap-1",
                textColor
              )}
            >
              <p
                className={cn(
                  "text-xs font-bold uppercase opacity-60 tracking-wider"
                )}
              >
                Closest Name
              </p>
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight capitalize drop-shadow-sm">
                {colorName}
              </h3>

              {/* Contrast Badges */}
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold border backdrop-blur-md bg-white/10",
                    borderColor
                  )}
                >
                  {previewColor.isLight() ? "Light" : "Dark"}
                </span>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold border backdrop-blur-md bg-white/10",
                    borderColor
                  )}
                >
                  Lum: {previewColor.luminance().toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ================= RIGHT PANEL: CONVERTERS ================= */}
      <Card className="lg:col-span-2 border-border/60 shadow-md flex flex-col h-full bg-card/50 backdrop-blur-sm p-0">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border/40 bg-muted/30 min-h-[56px]">
          <div className="p-1.5 bg-primary/10 rounded-md text-primary shadow-sm">
            <RefreshCcw size={16} />
          </div>
          <span className="text-sm font-semibold text-muted-foreground">
            Format Converters
          </span>
        </div>

        <CardContent className="p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
          {/* Input Groups */}
          <ColorInputRow
            label="HEX"
            value={hex}
            onChange={(val) => handleInputChange(val, "hex")}
            placeholder="#000000"
            copyValue={hex}
          />

          <ColorInputRow
            label="RGB"
            value={rgb}
            onChange={(val) => handleInputChange(val, "rgb")}
            placeholder="rgb(0, 0, 0)"
            copyValue={rgb}
          />

          <ColorInputRow
            label="HSL"
            value={hsl}
            onChange={(val) => handleInputChange(val, "hsl")}
            placeholder="hsl(0, 0%, 0%)"
            copyValue={hsl}
          />

          <ColorInputRow
            label="CMYK"
            value={cmyk}
            onChange={(val) => handleInputChange(val, "cmyk")}
            placeholder="device-cmyk(0, 0, 0, 1)"
            copyValue={cmyk}
          />

          {/* CSS Example Section */}
          <div className="mt-auto pt-6 border-t border-border/40">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-3 flex items-center gap-2">
              <Info size={12} />
              CSS Usage Example
            </Label>
            <div className="relative group bg-muted/30 rounded-lg border border-border/50 hover:border-primary/20 transition-colors">
              <pre className="p-4 text-xs md:text-sm font-mono text-muted-foreground overflow-x-auto">
                <span className="text-pink-500">.custom-color</span> {"{"}
                {"\n  "}
                <span className="text-sky-500">color</span>:{" "}
                <span className="text-foreground font-semibold">{hex}</span>;
                {"\n  "}
                <span className="text-sky-500">background-color</span>:{" "}
                <span className="text-foreground font-semibold">{rgb}</span>;
                {"\n"}
                {"}"}
              </pre>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <CopyButton
                  text={`color: ${hex}; background-color: ${rgb};`}
                  className="h-7 w-7"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// =============================================================================
// Helper Component (Sub-component)
// =============================================================================

interface ColorInputRowProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  copyValue: string;
}

function ColorInputRow({
  label,
  value,
  onChange,
  placeholder,
  copyValue,
}: ColorInputRowProps) {
  return (
    <div className="space-y-2 group">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide group-focus-within:text-primary transition-colors">
          {label}
        </Label>
        {/* Format Indicator Dot */}
        <div className="w-1.5 h-1.5 rounded-full bg-primary/20 group-focus-within:bg-primary transition-colors" />
      </div>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="font-mono text-sm h-10 border-border/60 focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all bg-background/50"
          spellCheck={false}
        />
        <CopyButton
          text={copyValue}
          className="h-10 w-10 shrink-0 border-border/60 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
        />
      </div>
    </div>
  );
}
