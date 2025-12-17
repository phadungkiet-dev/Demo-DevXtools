"use client";

// =============================================================================
// Imports
// =============================================================================
import { useState, useEffect, useMemo } from "react";
// UI Components
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
// Icons
import { Type, Hash, Quote, Settings2 } from "lucide-react";
// Shared Components
import {
  CopyButton,
  DownloadButton,
  RegenerateButton,
} from "@/components/shared/buttons";
// Utils & Libs
import { generateLorem, LoremType } from "@/lib/generators";
import { cn } from "@/lib/utils";

// =============================================================================
// Main Component
// =============================================================================
export function LoremIpsumGenerator() {
  // --- State Management ---
  const [count, setCount] = useState<number>(3);
  const [type, setType] = useState<LoremType>("paragraph");
  const [startWithLorem, setStartWithLorem] = useState<boolean>(true);
  const [seed, setSeed] = useState(0); // Trigger for manual regeneration
  const [output, setOutput] = useState("");

  /**
   * 🔄 Effect: Generate Text
   * ทำงานเมื่อ count, type, settings, หรือ seed เปลี่ยนแปลง
   * ใช้ setTimeout(0) เพื่อเลื่อนการทำงานไปหลัง render cycle (non-blocking UI)
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      const text = generateLorem(count, type, startWithLorem);
      setOutput(text);
    }, 0);
    return () => clearTimeout(timer);
  }, [count, type, startWithLorem, seed]);

  /**
   * 📊 Derived State: Statistics
   * คำนวณจำนวนตัวอักษรและคำแบบ Real-time
   */
  const stats = useMemo(() => {
    if (!output) return { chars: 0, words: 0 };
    return {
      chars: output.length,
      // Regex split by whitespace for accurate word count
      words: output.trim().split(/\s+/).length,
    };
  }, [output]);

  return (
    // Grid Layout: Mobile Stacked, Desktop Split 1:2 Fixed Height
    <div className="grid gap-6 lg:grid-cols-3 lg:h-[550px] transition-all animate-in fade-in duration-500">
      {/* ================= LEFT PANEL: SETTINGS ================= */}
      <Card className="lg:col-span-1 border-border/60 shadow-md flex flex-col h-full bg-card/50 backdrop-blur-sm p-0 overflow-hidden">
        <CardContent className="p-6 flex flex-col h-full gap-6">
          {/* Header */}
          <div className="flex items-center gap-2 pb-4 border-b border-border/50">
            <div className="p-1.5 bg-primary/10 rounded-md text-primary shadow-sm">
              <Settings2 size={18} />
            </div>
            <h3 className="font-bold text-sm text-foreground/80 uppercase tracking-wide">
              Generator Settings
            </h3>
          </div>

          {/* Controls Container */}
          <div className="space-y-6 flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-muted-foreground/20">
            {/* Control: Type Selection */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
                <Type size={14} /> Type
              </Label>
              <Select
                value={type}
                onValueChange={(v) => setType(v as LoremType)}
              >
                <SelectTrigger className="w-full h-10 bg-background/50 border-border/60 focus:ring-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paragraph">Paragraphs</SelectItem>
                  <SelectItem value="sentence">Sentences</SelectItem>
                  <SelectItem value="word">Words</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Control: Count Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
                  <Hash size={14} /> Quantity
                </Label>
                <span className="inline-flex items-center justify-center min-w-[2.5rem] h-7 rounded bg-primary/10 text-primary text-sm font-bold shadow-sm border border-primary/20">
                  {count}
                </span>
              </div>
              <Slider
                value={[count]}
                onValueChange={(val) => setCount(val[0])}
                max={type === "word" ? 100 : 20}
                min={1}
                step={1}
                className="py-2 cursor-pointer"
              />
            </div>

            {/* Control: Start with Lorem Toggle */}
            <div
              className={cn(
                "flex items-center justify-between p-3 rounded-xl border border-border/40 transition-all cursor-pointer group",
                startWithLorem
                  ? "bg-primary/5 border-primary/20"
                  : "bg-muted/20 hover:bg-muted/40"
              )}
              onClick={() => setStartWithLorem(!startWithLorem)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-lg transition-colors",
                    startWithLorem
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Quote size={18} className="fill-current" />
                </div>
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium cursor-pointer">
                    Start with Lorem
                  </Label>
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    Prefix with &quot;Lorem ipsum...&quot;
                  </p>
                </div>
              </div>
              <Switch
                checked={startWithLorem}
                onCheckedChange={setStartWithLorem}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-auto pt-4 border-t border-border/40">
            <RegenerateButton
              label="Regenerate Text"
              onRegenerate={() => setSeed((s) => s + 1)}
              variant="default" // ใช้สีทึบ
              className="w-full h-11 font-semibold shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            />
          </div>
        </CardContent>
      </Card>

      {/* ================= RIGHT PANEL: OUTPUT ================= */}
      <Card className="lg:col-span-2 border-border/60 shadow-md flex flex-col h-full overflow-hidden bg-card p-0 transition-all hover:shadow-lg">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-border/40 bg-muted/30 min-h-[60px] gap-3">
          {/* Stats Badges */}
          <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground font-mono">
            <div className="flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-md border border-border/50 shadow-sm">
              <span className="text-foreground font-bold">{stats.chars}</span>{" "}
              chars
            </div>
            <div className="flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-md border border-border/50 shadow-sm">
              <span className="text-foreground font-bold">{stats.words}</span>{" "}
              words
            </div>
          </div>

          {/* Actions: Download & Copy */}
          <div className="flex items-center gap-2">
            <DownloadButton
              text={output}
              filename="lorem-ipsum"
              extension="txt" // กำหนดนามสกุลไฟล์
              className="h-9 w-9 hover:bg-background hover:text-primary transition-colors"
            />
            <CopyButton
              text={output}
              className="h-9 w-9 hover:bg-background hover:text-primary transition-colors"
            />
          </div>
        </div>

        {/* Output Textarea */}
        <CardContent className="p-0 flex-1 relative min-h-[300px] lg:min-h-0">
          <Textarea
            className={cn(
              "w-full h-full resize-none border-0 focus-visible:ring-0 p-8 text-base leading-relaxed text-foreground/90 font-serif bg-transparent rounded-none shadow-none",
              "scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent selection:bg-primary/20",
              "placeholder:text-muted-foreground/30 italic"
            )}
            value={output}
            readOnly
            spellCheck={false}
            placeholder="Generating text..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
