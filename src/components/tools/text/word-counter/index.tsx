"use client";

// =============================================================================
// Imports
// =============================================================================
import { useState, useMemo, ElementType } from "react";
// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
// Icons
import {
  Type,
  AlignLeft,
  Clock,
  FileText,
  PenTool,
  BarChart3,
} from "lucide-react";
import {
  CopyButton,
  DownloadButton,
  PasteButton,
  ClearButton,
} from "@/components/shared/buttons";
// Utils & Libs
import { cn } from "@/lib/utils";

// =============================================================================
// Main Component
// =============================================================================
export function WordCounter() {
  // --- State Management ---
  const [text, setText] = useState("");

  /**
   * 📊 Derived State: Statistics Calculation
   * คำนวณสถิติทั้งหมดในครั้งเดียวผ่าน useMemo เพื่อ Performance ที่ดี
   */
  const stats = useMemo(() => {
    // Trim whitespace to avoid counting empty spaces
    const trimmed = text.trim();

    // Basic Counts
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;

    // Word Count: Split by whitespace, check if empty
    const words = trimmed === "" ? 0 : trimmed.split(/\s+/).length;

    // Sentence Count: Split by punctuation (. ! ?)
    const sentences =
      trimmed === "" ? 0 : text.split(/[.!?]+/).filter(Boolean).length;

    // Paragraph Count: Split by newlines
    const paragraphs =
      trimmed === "" ? 0 : text.split(/\n+/).filter(Boolean).length;

    // Reading/Speaking Time Estimation
    // Avg reading speed: 200 wpm | Avg speaking speed: 130 wpm
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

  return (
    // Grid Layout: Mobile Stacked, Desktop Split 2:1 Fixed Height
    <div className="grid gap-6 lg:grid-cols-3 lg:h-[550px] transition-all animate-in fade-in duration-500">
      {/* ================= LEFT PANEL: INPUT ================= */}
      <Card className="lg:col-span-2 border-border/60 shadow-md flex flex-col h-full overflow-hidden bg-card p-0 transition-all hover:shadow-lg">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-border/40 bg-muted/30 min-h-[60px] gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-primary/10 rounded-md text-primary shadow-sm">
              <PenTool size={16} />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              Editor & Input
            </span>
          </div>

          {/* ✅ Actions Toolbar: ใช้ Shared Buttons ทั้งหมด */}
          <div className="flex items-center gap-1">
            {/* PasteButton: จัดการ Clipboard + Toast ภายในตัว */}
            <PasteButton onPaste={setText} />

            {/* ClearButton: จัดการ Toast ภายในตัว */}
            <ClearButton onClear={() => setText("")} disabled={!text} />

            <div className="w-px h-4 bg-border mx-1 hidden sm:block" />

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

        {/* Text Area */}
        <CardContent className="p-0 flex-1 relative min-h-[300px] lg:min-h-0">
          <Textarea
            className={cn(
              "w-full h-full resize-none border-0 focus-visible:ring-0 p-6 text-base leading-relaxed text-foreground/90 bg-transparent rounded-none shadow-none",
              "placeholder:text-muted-foreground/40",
              "scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent selection:bg-primary/20"
            )}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here to analyze..."
            spellCheck={false}
          />
        </CardContent>
      </Card>

      {/* ================= RIGHT PANEL: STATS ================= */}
      <Card className="lg:col-span-1 border-border/60 shadow-md flex flex-col h-full bg-card/50 backdrop-blur-sm p-0 overflow-hidden">
        <CardContent className="p-6 flex flex-col h-full gap-6">
          {/* Header */}
          <div className="flex items-center gap-2 pb-2 border-b border-border/50">
            <div className="p-1.5 bg-primary/10 rounded-md text-primary shadow-sm">
              <BarChart3 size={16} />
            </div>
            <h3 className="font-bold text-sm text-foreground/80 uppercase tracking-wide">
              Analysis
            </h3>
          </div>

          {/* Stats Content */}
          <div className="space-y-6 flex-1 overflow-y-auto scrollbar-none">
            {/* Primary Stats Grid (Words & Chars) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primary/5 border border-primary/10 p-3 rounded-xl text-center flex flex-col items-center justify-center gap-1 min-h-[90px] shadow-sm">
                <span className="text-3xl font-extrabold text-primary tracking-tight">
                  {stats.words.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Words
                </span>
              </div>
              <div className="bg-muted/40 border border-border/50 p-3 rounded-xl text-center flex flex-col items-center justify-center gap-1 min-h-[90px] shadow-sm">
                <span className="text-3xl font-bold text-foreground tracking-tight">
                  {stats.characters.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Chars
                </span>
              </div>
            </div>

            {/* Detailed Stats List */}
            <div className="space-y-2 pt-2">
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

          {/* Footer: Estimated Time */}
          <div className="mt-auto pt-4">
            <div className="bg-muted/30 rounded-lg p-4 space-y-3 border border-border/50 shadow-sm">
              <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                <Clock className="w-3 h-3" /> Estimated Time
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Reading</span>
                  <span className="font-semibold text-foreground">
                    ~ {stats.readingTime} min
                  </span>
                </div>
                <div className="w-full h-px bg-border/50" />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Speaking</span>
                  <span className="font-semibold text-foreground">
                    ~ {stats.speakingTime} min
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// =============================================================================
// Helper Component: Stat Row
// =============================================================================
interface StatRowProps {
  label: string;
  value: number;
  icon: ElementType;
}

function StatRow({ label, value, icon: Icon }: StatRowProps) {
  return (
    <div className="flex justify-between items-center py-2.5 px-3 border border-transparent hover:border-border/40 hover:bg-muted/40 rounded-lg transition-all">
      <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
        <Icon className="w-4 h-4 opacity-70" />
        <span>{label}</span>
      </div>
      <span className="font-mono font-medium text-foreground">
        {value.toLocaleString()}
      </span>
    </div>
  );
}
