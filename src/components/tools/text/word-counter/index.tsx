"use client";

// Imports =============================
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

// Main Component ==============================
export function WordCounter() {
  // --- State Management ---
  const [text, setText] = useState("");

  // Derived State: Statistics Calculation
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
    <div
      className={cn(
        // Grid Layout
        "grid gap-6 lg:grid-cols-3 lg:h-[580]",
        // Animation Core (ท่าทาง: เริ่มต้น + จางเข้า + ลอยขึ้น)
        "animate-in fade-in slide-in-from-bottom-4",
        // Animation Timing (ความเร็วและจังหวะ)
        "duration-600 ease-out",
        // Animation Staging (การรอ: รอ 0.2 วินาที ก่อนเริ่มเพื่อให้แม่มาครบก่อน)
        "delay-200 fill-mode-backwards"
      )}
    >
      {/* ================= LEFT PANEL: INPUT ================= */}
      <Card
        className={cn(
          // Grid & Flex Layout
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
            // Layout & Direction
            "flex flex-col sm:flex-row justify-between",
            // Sizing & Spacing
            "min-h-[60px] px-6 py-4 md:py-2 gap-4",
            // Visuals
            "bg-muted/40 border-b border-border/60"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-md text-primary shadow-sm">
              <PenTool size={16} />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              Editor & Input
            </span>
          </div>

          {/* Actions Toolbar: ใช้ Shared Buttons ทั้งหมด */}
          <div
            className={cn(
              // Layout & Sizing
              "flex flex-warp items-center gap-1",
              "w-full sm:w-auto",
              // Alignment
              "justify-center sm:justify-end"
            )}
          >
            {/* PasteButton: จัดการ Clipboard + Toast ภายในตัว */}
            <PasteButton onPaste={setText} />

            {/* ClearButton: จัดการ Toast ภายในตัว */}
            <ClearButton onClear={() => setText("")} disabled={!text} />

            <div className="w-px h-4 bg-border mx-1 hidden sm:block" />

            <DownloadButton
              text={text}
              filename="word-counter-content"
              extension="txt"
              className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10"
            />
            <CopyButton
              text={text}
              className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10"
            />
          </div>
        </div>

        {/* Text Area */}
        <CardContent className="px-1 py-1 relative min-h-[300px] lg:min-h-0 flex-1">
          <Textarea
            className={cn(
              // Layout & Sizing
              "w-full h-full resize-none",
              // Spacing
              "p-4 pb-12",
              // Typography
              "font-serif text-base leading-relaxed text-foreground/90",
              // Appearance Reset
              "border-0 focus-visible:ring-0 bg-transparent rounded-none shadow-none",
              // Scrollbar & Selection
              "scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent",
              "selection:bg-primary/20",
              // Placeholder
              "placeholder:text-muted-foreground/30"
            )}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here to analyze..."
            spellCheck={false}
          />
        </CardContent>
      </Card>

      {/* ================= RIGHT PANEL: STATS ================= */}
      <Card
        className={cn(
          // Grid & Layout
          "lg:col-span-1 flex flex-col h-full",
          // Visuals
          "bg-card backdrop-blur-sm border-border/60 shadow-md",
          // Container Style
          "p-0 overflow-hidden"
        )}
      >
        <CardContent className="p-4 flex flex-col h-full gap-6">
          {/* Header */}
          <div className="flex items-center gap-2 pb-4 border-b border-border/40">
            <div className="p-2 bg-primary/10 rounded-md text-primary shadow-sm">
              <BarChart3 size={16} />
            </div>
            <h3 className="font-bold text-sm text-foreground/80 uppercase tracking-wide">
              Analysis
            </h3>
          </div>

          {/* Stats Content */}
          <div className="space-y-4 flex-1 overflow-y-auto scrollbar-none">
            {/* Primary Stats Grid (Words & Chars) */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className={cn(
                  // Flexbox Layout
                  "flex flex-col items-center justify-center gap-1",
                  // Sizing & Spacing
                  "min-h-[90px] p-3",
                  // Visuals
                  "bg-muted/40 border border-border/50 rounded-xl shadow-sm",
                  // Typography
                  "text-center"
                )}
              >
                <span className="text-3xl font-extrabold text-primary tracking-tight">
                  {stats.words.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Words
                </span>
              </div>
              <div
                className={cn( 
                  // Flexbox Layout
                  "flex flex-col items-center justify-center gap-1",
                  // Sizing & Spacing
                  "min-h-[90px] p-3",
                  // Visuals
                  "bg-muted/40 border border-border/50 rounded-xl shadow-sm",
                  // Typography
                  "text-center"
                )}
              >
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
            <div className="bg-muted/40 rounded-xl border border-border/50 shadow-sm p-4">
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

// Helper Component: Stat Row ======================
interface StatRowProps {
  label: string;
  value: number;
  icon: ElementType;
}

function StatRow({ label, value, icon: Icon }: StatRowProps) {
  return (
    <div
      className={cn(
        // Layout & Alignment
        "flex justify-between items-center",
        // Spacing
        "px-2 py-1",
        // Shape & Initial State
        "rounded-lg border border-transparent",
        // Interaction
        "transition-all hover:bg-muted/40 hover:border-border/60"
      )}
    >
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
