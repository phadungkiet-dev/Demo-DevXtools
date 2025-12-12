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
  const [count, setCount] = useState<number>(3);
  const [type, setType] = useState<LoremType>("paragraph");
  const [startWithLorem, setStartWithLorem] = useState<boolean>(true);
  const [seed, setSeed] = useState(0);
  const [output, setOutput] = useState("");

  // Logic: Generate Text
  useEffect(() => {
    const timer = setTimeout(() => {
      const text = generateLorem(count, type, startWithLorem);
      setOutput(text);
    }, 0);
    return () => clearTimeout(timer);
  }, [count, type, startWithLorem, seed]);

  // ฟังก์ชันกดปุ่ม แค่เปลี่ยนค่า seed เพื่อกระตุ้น useMemo
  const handleRegenerate = () => {
    setSeed((prev) => prev + 1);
  };

  // Logic: Stats
  const stats = useMemo(() => {
    return {
      chars: output.length,
      words: output.trim().split(/\s+/).length,
    };
  }, [output]);

  return (
    <div className="grid gap-6 lg:grid-cols-3 lg:h-[550px] transition-all">
      {/* --- Left Panel: Settings --- */}
      <Card className="p-0 lg:col-span-1 border-border/60 shadow-md flex flex-col h-full bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6 flex flex-col h-full gap-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <div className="p-1.5 bg-primary/10 rounded-md text-primary">
                <AlignLeft size={16} />
              </div>
              <h3 className="font-semibold text-sm">Configuration</h3>
            </div>

            {/* Type Selection */}
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

            {/* Count Slider */}
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

            {/* Toggle: Redesigned */}
            <div
              className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group"
              onClick={() => setStartWithLorem(!startWithLorem)}
            >
              <div className="flex items-center gap-3">
                {/* Icon Box */}
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <Quote size={18} className="fill-current" />
                </div>

                {/* Label Text */}
                <div className="space-y-0.5">
                  <Label
                    htmlFor="start-lorem"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Start with Lorem
                  </Label>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    Prefix with &quot;Lorem ipsum...&quot;
                  </p>
                </div>
              </div>

              <Switch
                id="start-lorem"
                checked={startWithLorem}
                onCheckedChange={setStartWithLorem}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>

          <div className="mt-auto pt-4">
            <Button
              className="w-full h-11 font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98]"
              onClick={handleRegenerate}
              variant="default"
            >
              <RefreshCw className="mr-2 h-4 w-4 animate-in spin-in-180 duration-500" />
              Regenerate Text
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* --- Right Panel: Output --- */}
      <Card className="p-0 lg:col-span-2 border-border/60 shadow-md flex flex-col h-full overflow-hidden bg-card">
        {/* Toolbar: ปรับ Padding เป็น px-6 py-4 เพื่อให้สูงเท่ากับ Padding ฝั่งซ้าย */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-muted/30">
          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground font-mono">
            <div className="flex items-center gap-1.5 bg-background px-2 py-1 rounded-md border border-border/50 shadow-sm">
              <span className="text-foreground">{stats.chars}</span> chars
            </div>
            <div className="flex items-center gap-1.5 bg-background px-2 py-1 rounded-md border border-border/50 shadow-sm">
              <span className="text-foreground">{stats.words}</span> words
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DownloadButton
              text={output}
              filename="lorem-ipsum"
              className="h-8 w-8 hover:bg-background hover:text-primary transition-colors"
            />
            <CopyButton
              text={output}
              className="h-8 w-8 hover:bg-background hover:text-primary transition-colors"
            />
          </div>
        </div>

        {/* Text Area Container */}
        <CardContent className="p-0 flex-1 relative min-h-[300px] lg:min-h-0">
          <textarea
            className={cn(
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
