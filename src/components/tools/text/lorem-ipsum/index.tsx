"use client";

import { useState, useEffect, useMemo } from "react";
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
import { Button } from "@/components/ui/button";
import { RefreshCw, Type, AlignLeft, Hash, Quote } from "lucide-react";
import { CopyButton } from "@/components/shared/copy-button";
import { DownloadButton } from "@/components/shared/download-button";
import { generateLorem, LoremType } from "@/lib/generators";
import { cn } from "@/lib/utils";

export function LoremIpsumGenerator() {
  // --- 1. CONFIGURATION STATE (เก็บค่าที่ User ตั้ง) ---
  const [count, setCount] = useState<number>(3);
  const [type, setType] = useState<LoremType>("paragraph");
  const [startWithLorem, setStartWithLorem] = useState<boolean>(true);

  // Seed: ใช้เทคนิคเปลี่ยนตัวเลขเพื่อบังคับให้เกิดการสุ่มใหม่
  const [seed, setSeed] = useState(0);

  // --- 2. OUTPUT STATE (เก็บผลลัพธ์) ---
  // เริ่มต้นด้วย "" เสมอ เพื่อให้ Server render ออกมาเป็นค่าว่าง (ตรงกับ Client ตอนแรก)
  // นี่คือหัวใจของการแก้ปัญหา Hydration Mismatch
  const [output, setOutput] = useState("");

  // --- 3. EFFECT: GENERATION LOGIC ---
  useEffect(() => {
    // ใช้ setTimeout(..., 0) เพื่อย้ายงานไปทำในรอบถัดไปของ Event Loop
    // ช่วยแก้ปัญหา ESLint "setState inside useEffect" และทำให้ UI ไม่กระตุก
    const timer = setTimeout(() => {
      const text = generateLorem(count, type, startWithLorem);
      setOutput(text);
    }, 0);

    return () => clearTimeout(timer);
  }, [count, type, startWithLorem, seed]); // ทำใหม่เมื่อค่าเหล่านี้เปลี่ยน

  // --- 4. COMPUTED STATS (คำนวณสด ไม่ต้องเก็บลง State) ---
  const stats = useMemo(() => {
    if (!output) return { chars: 0, words: 0 };
    return {
      chars: output.length,
      words: output.trim().split(/\s+/).length,
    };
  }, [output]);

  return (
    // Grid Layout: Desktop สูง 550px, Mobile สูง Auto
    <div className="grid gap-6 lg:grid-cols-3 lg:h-[550px] transition-all">
      {/* ================= LEFT PANEL: SETTINGS ================= */}
      <Card className="lg:col-span-1 border-border/60 shadow-md flex flex-col h-full bg-card/50 backdrop-blur-sm p-0">
        <CardContent className="p-6 flex flex-col h-full gap-6">
          {/* Header */}
          <div className="flex items-center gap-2 pb-2 border-b border-border/50">
            <div className="p-1.5 bg-primary/10 rounded-md text-primary">
              <AlignLeft size={16} />
            </div>
            <h3 className="font-semibold text-sm">Configuration</h3>
          </div>

          {/* Controls Container */}
          <div className="space-y-6 flex-1">
            {/* Input 1: Type Select */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Type size={14} className="text-muted-foreground" /> Generation
                Type
              </Label>
              <Select
                value={type}
                onValueChange={(v) => setType(v as LoremType)}
              >
                <SelectTrigger className="w-full h-10 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paragraph">Paragraphs</SelectItem>
                  <SelectItem value="sentence">Sentences</SelectItem>
                  <SelectItem value="word">Words</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Input 2: Count Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Hash size={14} className="text-muted-foreground" /> Quantity
                </Label>
                <span className="inline-flex items-center justify-center min-w-[2.5rem] h-8 rounded-md bg-background border border-border text-sm font-bold shadow-sm">
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

            {/* Input 3: Toggle Switch (Custom UI) */}
            <div
              className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group"
              onClick={() => setStartWithLorem(!startWithLorem)}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <Quote size={18} className="fill-current" />
                </div>
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium cursor-pointer">
                    Start with Lorem
                  </Label>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    Prefix with &quot;Lorem ipsum...&quot;
                  </p>
                </div>
              </div>
              <Switch
                checked={startWithLorem}
                onCheckedChange={setStartWithLorem}
              />
            </div>
          </div>

          {/* Action Button: ดันลงล่างสุดด้วย mt-auto */}
          <div className="mt-auto pt-4">
            <Button
              className="w-full h-11 font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98]"
              onClick={() => setSeed((s) => s + 1)} // Short syntax update
              variant="default"
            >
              <RefreshCw className="mr-2 h-4 w-4 animate-in spin-in-180 duration-500" />
              Regenerate Text
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ================= RIGHT PANEL: OUTPUT ================= */}
      {/* ใช้ p-0 เพื่อให้ Toolbar ชิดขอบ, overflow-hidden เพื่อตัดมุม */}
      <Card className="lg:col-span-2 border-border/60 shadow-md flex flex-col h-full overflow-hidden bg-card p-0">
        {/* Toolbar: ทำหน้าที่เป็น Header ของ Card นี้ */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-muted/30 min-h-[60px]">
          <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground font-mono">
            {/* Stats Badges */}
            <div className="flex items-center gap-1.5 bg-background px-2.5 py-1 rounded-md border border-border/50 shadow-sm">
              <span className="text-foreground font-bold">{stats.chars}</span>{" "}
              chars
            </div>
            <div className="flex items-center gap-1.5 bg-background px-2.5 py-1 rounded-md border border-border/50 shadow-sm">
              <span className="text-foreground font-bold">{stats.words}</span>{" "}
              words
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DownloadButton
              text={output}
              filename="lorem-ipsum"
              className="h-9 w-9 hover:bg-background hover:text-primary transition-colors"
            />
            <CopyButton
              text={output}
              className="h-9 w-9 hover:bg-background hover:text-primary transition-colors"
            />
          </div>
        </div>

        {/* Output Area */}
        <CardContent className="p-0 flex-1 relative min-h-[300px] lg:min-h-0">
          <textarea
            className={cn(
              // p-6: คืนระยะห่างให้ข้อความ เพราะเราลบ padding card ออกไปแล้ว
              "w-full h-full resize-none bg-transparent border-none focus:ring-0 p-6 text-base leading-relaxed text-foreground/90 font-serif",
              "scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent selection:bg-primary/20"
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
