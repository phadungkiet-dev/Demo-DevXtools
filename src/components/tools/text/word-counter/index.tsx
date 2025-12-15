"use client";

import { useState, useMemo, ElementType } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Trash2,
  ClipboardPaste,
  Type,
  AlignLeft,
  Clock,
  FileText,
  Hash,
} from "lucide-react";
import { CopyButton } from "@/components/shared/copy-button";
import { DownloadButton } from "@/components/shared/download-button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function WordCounter() {
  const [text, setText] = useState("");

  // Logic: Stats Calculation
  const stats = useMemo(() => {
    const trimmed = text.trim();
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const words = trimmed === "" ? 0 : trimmed.split(/\s+/).length;
    const sentences =
      trimmed === "" ? 0 : text.split(/[.!?]+/).filter(Boolean).length;
    const paragraphs =
      trimmed === "" ? 0 : text.split(/\n+/).filter(Boolean).length;

    // Time calculations
    const readingTime = Math.ceil(words / 200);
    const speakingTime = Math.ceil(words / 130);

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime,
      speakingTime,
    };
  }, [text]);

  // Handler: Paste
  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
      toast.success("Text pasted from clipboard");
    } catch {
      toast.error("Failed to read clipboard");
    }
  };

  return (
    // ✅ 1. ใช้ Grid Layout เหมือน Lorem Ipsum (สูง 550px บน Desktop)
    <div className="grid gap-6 lg:grid-cols-3 lg:h-[550px] transition-all">
      {/* ================= LEFT PANEL: INPUT (2 Columns) ================= */}
      {/* ใช้โครงสร้าง p-0 + overflow-hidden เหมือน Card ขวาของ Lorem Ipsum */}
      <Card className="lg:col-span-2 border-border/60 shadow-md flex flex-col h-full overflow-hidden bg-card p-0">
        {/* Toolbar Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-muted/30 min-h-[60px]">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-primary/10 rounded-md text-primary">
              <Type size={16} />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              Input Content
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8 text-muted-foreground hover:text-foreground hidden sm:flex"
              onClick={handlePaste}
            >
              <ClipboardPaste className="mr-2 h-3.5 w-3.5" />
              Paste
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8 text-muted-foreground hover:text-destructive"
              onClick={() => setText("")}
              disabled={!text}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Clear
            </Button>

            <div className="w-px h-4 bg-border mx-1" />

            {/* Copy & Download Buttons */}
            <div className="flex items-center gap-1">
              <DownloadButton
                text={text}
                filename="word-counter-content"
                className="h-8 w-8 hover:bg-background hover:text-primary transition-colors"
              />
              <CopyButton
                text={text}
                className="h-8 w-8 hover:bg-background hover:text-primary transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Text Area (Input) */}
        <CardContent className="p-0 flex-1 relative min-h-[300px] lg:min-h-0">
          <textarea
            className={cn(
              // p-6: คืนระยะห่างให้ข้อความ
              "w-full h-full resize-none bg-transparent border-none focus:ring-0 p-6 text-base leading-relaxed text-foreground/90 font-serif",
              "scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent selection:bg-primary/20"
            )}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here to count words..."
            spellCheck={false}
          />
        </CardContent>
      </Card>

      {/* ================= RIGHT PANEL: STATS (1 Column) ================= */}
      {/* ใช้โครงสร้าง flex-col h-full เหมือน Card ซ้ายของ Lorem Ipsum */}
      <Card className="lg:col-span-1 border-border/60 shadow-md flex flex-col h-full bg-card/50 backdrop-blur-sm p-0">
        <CardContent className="p-6 flex flex-col h-full gap-6">
          {/* Header */}
          <div className="flex items-center gap-2 pb-2 border-b border-border/50">
            <div className="p-1.5 bg-primary/10 rounded-md text-primary">
              <Hash size={16} />
            </div>
            <h3 className="font-semibold text-sm">Statistics</h3>
          </div>

          {/* Controls Container (Stats List) */}
          <div className="space-y-6 flex-1">
            {/* Primary Stats (Big Cards) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primary/5 border border-primary/10 p-3 rounded-xl text-center flex flex-col items-center justify-center gap-1 min-h-[80px]">
                <span className="text-2xl font-bold text-primary tracking-tight">
                  {stats.words.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Words
                </span>
              </div>
              <div className="bg-muted/40 border border-border/50 p-3 rounded-xl text-center flex flex-col items-center justify-center gap-1 min-h-[80px]">
                <span className="text-2xl font-bold text-foreground tracking-tight">
                  {stats.characters.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Chars
                </span>
              </div>
            </div>

            {/* Detailed Stats List */}
            <div className="space-y-3 pt-2">
              <StatRow
                label="Chars (no spaces)"
                value={stats.charactersNoSpaces}
                icon={Type}
              />
              <StatRow
                label="Sentences"
                value={stats.sentences}
                icon={AlignLeft}
              />
              <StatRow
                label="Paragraphs"
                value={stats.paragraphs}
                icon={FileText}
              />
            </div>
          </div>

          {/* Footer (Time Stats): ดันลงล่างสุดด้วย mt-auto */}
          <div className="mt-auto pt-4">
            <div className="bg-muted/30 rounded-lg p-4 space-y-3 border border-border/50">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                <Clock className="w-3.5 h-3.5" /> Estimated Time
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Reading</span>
                <span className="font-medium text-foreground">
                  ~ {stats.readingTime} min
                </span>
              </div>
              <div className="w-full h-px bg-border/50" />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Speaking</span>
                <span className="font-medium text-foreground">
                  ~ {stats.speakingTime} min
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper Component for consistent rows
function StatRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: ElementType;
}) {
  return (
    <div className="flex justify-between items-center py-2 px-1 border-b border-border/40 last:border-0 hover:bg-muted/20 rounded-md transition-colors">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="w-4 h-4 opacity-70" />
        <span>{label}</span>
      </div>
      <span className="font-mono font-medium text-foreground">
        {value.toLocaleString()}
      </span>
    </div>
  );
}
