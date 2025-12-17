"use client";

// =============================================================================
// Imports
// =============================================================================
import { useState, useMemo } from "react";
// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
// Icons (เหลือเฉพาะที่ใช้ใน Layout หลัก)
import {
  Type,
  FileText, // Icon for stats
} from "lucide-react";
// Shared Components
import {
  CopyButton,
  DownloadButton,
  DemoButton,
  PasteButton,
  ClearButton,
} from "@/components/shared/buttons";
// Utils & Libs
import { cn } from "@/lib/utils";
// Logic
import { transformers, caseLabels, CaseType } from "@/lib/transformers";

// =============================================================================
// Main Component
// =============================================================================
export function CaseConverter() {
  // --- State Management ---
  const [input, setInput] = useState("");

  /**
   * 📊 Derived State: Statistics
   * คำนวณจำนวนตัวอักษร, คำ, และบรรทัด แบบ Real-time
   */
  const stats = useMemo(() => {
    return {
      chars: input.length,
      words: input.trim() ? input.trim().split(/\s+/).length : 0,
      lines: input ? input.split(/\r\n|\r|\n/).length : 0,
    };
  }, [input]);

  /**
   * 🚀 Helper: Load Demo Text
   */
  const handleDemo = () => {
    setInput("Hello World welcome to CodeXKit Case Converter Tool");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ================= INPUT SECTION ================= */}
      <Card className="border-border/60 shadow-md flex flex-col overflow-hidden bg-card p-0 transition-all hover:shadow-lg">
        {/* Toolbar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-3 border-b border-border/40 bg-muted/30 min-h-[56px] gap-4 sm:gap-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-primary/10 rounded-md text-primary shadow-sm">
              <Type size={16} />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              Input Text
            </span>
          </div>

          {/* ✅ Refactored Toolbar Buttons: ใช้ Shared Components */}
          <div className="flex flex-wrap items-center gap-1">
            <DemoButton onDemo={handleDemo} />

            <div className="w-px h-4 bg-border mx-1 hidden sm:block" />

            {/* PasteButton จัดการ Clipboard logic ภายในตัว */}
            <PasteButton onPaste={setInput} />

            {/* ClearButton จัดการ Style สีแดงเมื่อ Hover */}
            <ClearButton onClear={() => setInput("")} disabled={!input} />
          </div>
        </div>

        {/* Text Area with Stats Overlay */}
        <CardContent className="p-0 relative min-h-[180px]">
          <Textarea
            id="input-text"
            className={cn(
              "w-full h-full min-h-[180px] resize-y border-0 focus-visible:ring-0 p-6 pb-12 text-base leading-relaxed text-foreground/90 font-mono bg-transparent rounded-none shadow-none",
              "scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent selection:bg-primary/20",
              "placeholder:text-muted-foreground/40"
            )}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste your text here..."
            spellCheck={false}
          />

          {/* Real-time Statistics Overlay */}
          <div className="absolute bottom-3 right-4 flex items-center gap-3 text-[10px] font-mono font-medium text-muted-foreground/70 select-none bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/30 shadow-sm pointer-events-none transition-opacity duration-200">
            <div className="flex items-center gap-1.5">
              <FileText size={10} />
              <span>{stats.chars} chars</span>
            </div>
            <span className="w-px h-3 bg-border/50" />
            <span>{stats.words} words</span>
            <span className="w-px h-3 bg-border/50" />
            <span>{stats.lines} lines</span>
          </div>
        </CardContent>
      </Card>

      {/* ================= OUTPUTS GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {(Object.keys(transformers) as CaseType[]).map((key) => {
          // Calculate result on the fly (Fast & Efficient)
          const result = input ? transformers[key](input) : "";

          return (
            <Card
              key={key}
              className="overflow-hidden group hover:border-primary/40 transition-all duration-300 hover:shadow-md bg-card/50"
            >
              <CardContent className="p-4 space-y-3">
                {/* Output Header */}
                <div className="flex items-center justify-between min-h-[28px]">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2.5 py-1 rounded-md border border-border/50 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                    {caseLabels[key]}
                  </span>

                  {/* UX Fix for Mobile */}
                  <div
                    className={cn(
                      "flex items-center gap-1 transition-opacity duration-200",
                      "opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                    )}
                  >
                    <DownloadButton
                      text={result}
                      filename={`converted-${key}.txt`}
                      className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10"
                    />
                    <CopyButton
                      text={result}
                      className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10"
                    />
                  </div>
                </div>

                {/* Output Display */}
                <div
                  className={cn(
                    "min-h-[4rem] max-h-[160px] overflow-y-auto p-3 rounded-lg border border-border/40 font-mono text-sm break-all relative scrollbar-thin scrollbar-thumb-muted-foreground/20 transition-colors",
                    result ? "bg-muted/30 text-foreground" : "bg-muted/10"
                  )}
                >
                  {result || (
                    <span className="text-muted-foreground/30 italic select-none text-xs flex items-center justify-center h-full">
                      Waiting for input...
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
