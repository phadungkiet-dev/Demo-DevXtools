"use client";

// Imports =====================
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

// Main Component =================
export function LoremIpsumGenerator() {
  // --- State Management ---
  const [count, setCount] = useState<number>(3);
  const [type, setType] = useState<LoremType>("paragraph");
  const [startWithLorem, setStartWithLorem] = useState<boolean>(true);
  const [seed, setSeed] = useState(0); // Trigger for manual regeneration
  const [output, setOutput] = useState("");

  // Effect: Generate Text
  useEffect(() => {
    const timer = setTimeout(() => {
      const text = generateLorem(count, type, startWithLorem);
      setOutput(text);
    }, 0);
    return () => clearTimeout(timer);
  }, [count, type, startWithLorem, seed]);

  // Derived State: Statistics
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
    <div
      className={cn(
        // Layout & Grid System (โครงสร้าง)
        "grid gap-6 lg:grid-cols-3 lg:h-[500px]",
        // Animation & Transition (การเคลื่อนไหว)
        "transition-all animate-in fade-in duration-500"
      )}
    >
      {/* ================= LEFT PANEL: SETTINGS ================= */}
      <Card
        className={cn(
          // Grid & Layout (การจัดวางใน Grid และ Flexbox)
          "lg:col-span-1 flex flex-col h-full",
          // Visuals (พื้นหลัง, ขอบ, และเงา)
          "bg-card backdrop-blur-sm border-border/60 shadow-md",
          // Container Style (การตัดขอบและ Padding)
          "p-0 overflow-hidden"
        )}
      >
        <CardContent className="p-4 flex flex-col h-full gap-6">
          {/* Header */}
          <div className="flex items-center gap-2 pb-4 border-b border-border/40">
            <div className="p-2 bg-primary/10 rounded-md text-primary shadow-sm">
              <Settings2 size={16} />
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
                <span
                  className={cn(
                    // Layout & Alignment (การจัดวาง)
                    "inline-flex items-center justify-center",
                    // Sizing & Shape (ขนาดและรูปร่าง)
                    "min-w-[2.5rem] h-7 rounded",
                    // Typography (ตัวอักษร)
                    "text-sm font-bold text-primary",
                    // Visuals (สีพื้นหลังและขอบ)
                    "bg-primary/10 border border-primary/20 shadow-sm"
                  )}
                >
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
                // Layout & Spacing (การจัดวางและระยะห่าง)
                "flex items-center justify-between p-3",

                // Shape & Border (รูปร่างและเส้นขอบพื้นฐาน)
                "rounded-xl border border-border/40",

                // Interactivity (การตอบสนองพื้นฐาน)
                "cursor-pointer group transition-all",

                // Conditional State (เปลี่ยนสีตามสถานะ Checked/Unchecked)
                startWithLorem
                  ? "bg-primary/5 border-primary/20" // Active State
                  : "bg-muted/20 hover:bg-muted/40" // Inactive State
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
                  <Quote size={14} className="fill-current" />
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
              variant="default"
              className="w-full h-10 font-semibold shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            />
          </div>
        </CardContent>
      </Card>

      {/* ================= RIGHT PANEL: OUTPUT ================= */}
      {/* <Card className="border-border/60 shadow-md flex flex-col overflow-hidden bg-card p-0 transition-all hover:shadow-lg gap-2 sm:gap-4"></Card> */}
      {/* <Card className="lg:col-span-2 border-border/60 shadow-md flex flex-col h-full overflow-hidden bg-card p-0 transition-all hover:shadow-lg"></Card> */}
      <Card
        className={cn(
          // Grid & Flex Layout (การจัดวางและขนาด)
          "lg:col-span-2 h-full flex flex-col overflow-hidden",
          // Visuals (พื้นหลัง, ขอบ, และเงา)
          "bg-card border-border/60 shadow-md",
          // Spacing (ระยะห่างภายในและระหว่างลูก)
          "p-0 gap-2 sm:gap-4",
          // Animation & Interaction (การตอบสนองเมื่อ Hover)
          "transition-all hover:shadow-lg"
        )}
      >
        {/* Toolbar */}
        <div
          className={cn(
            // Layout & Direction (การจัดวางและทิศทาง)
            "flex flex-col sm:flex-row justify-between",
            "sm:items-center",
            // Sizing & Spacing (ขนาดและระยะห่าง)
            "min-h-[60px]",
            "px-6 py-4 md:py-2",
            "gap-4",
            // Visuals (พื้นหลังและเส้นขอบ)
            "bg-muted/40 border-b border-border/60"
          )}
        >
          {/* Stats Badges */}
          <div
            className={cn(
              // Layout & Sizing
              "flex items-center gap-3",
              "w-full sm:w-auto",

              // Alignment
              "justify-center sm:justify-start",

              // Typography
              "text-xs font-medium font-mono text-muted-foreground"
            )}
          >
            <div className="flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-md border border-border/50 shadow-sm">
              <span className="text-foreground/80 font-bold">
                {stats.chars}
              </span>{" "}
              chars
            </div>
            <div className="flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-md border border-border/50 shadow-sm">
              <span className="text-foreground/80  font-bold">
                {stats.words}
              </span>{" "}
              words
            </div>
          </div>

          {/* Actions: Download & Copy */}
          <div
            className={cn(
              // Layout & Sizing
              "flex items-center gap-2",
              "w-full sm:w-auto",
              // Alignment
              "justify-end"
            )}
          >
            <DownloadButton
              text={output}
              filename="lorem-ipsum"
              extension="txt"
              // h-6 w-6 text-muted-foreground hover:text-primary hover:bg-primary/10
              className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10"
            />
            <CopyButton
              text={output}
              className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10"
            />
          </div>
        </div>

        {/* Output Textarea */}
        <CardContent className="px-1 py-1 relative min-h-[300px] lg:min-h-0 flex-1">
          <Textarea
            className={cn(
              // Layout & Sizing (ขนาดและการยืดหด)
              "w-full h-full resize-none",
              // Spacing (ระยะห่างภายใน - ให้ดูโล่งสบายตา)
              "p-4 pb-12",
              // Typography (เน้นความสวยงามแบบ Serif/Italic)
              "font-serif text-base leading-relaxed italic",
              "text-foreground/90",
              // Appearance Reset (ลบเส้นขอบ, เงา, และพื้นหลังเดิม)
              "border-0 focus-visible:ring-0 bg-transparent rounded-none shadow-none",
              // Scrollbar & Selection (สไตล์สโครลบาร์และสีไฮไลท์)
              "scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent",
              "selection:bg-primary/20",
              // Placeholder (สีข้อความตัวอย่างจางๆ)
              "placeholder:text-muted-foreground/30"
            
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
