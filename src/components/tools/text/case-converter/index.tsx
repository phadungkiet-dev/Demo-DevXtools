"use client";

// =============================================================================
// Imports
// =============================================================================
import { useState, useMemo } from "react";
// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
// Icons
import {
  Trash2,
  ClipboardPaste,
  Sparkles,
  Type,
  FileText, // Icon for stats
} from "lucide-react";
// Shared Components
import { CopyButton } from "@/components/shared/copy-button";
import { DownloadButton } from "@/components/shared/download-button";
// Utils & Libs
import { toast } from "sonner";
import { cn } from "@/lib/utils";
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
   * ใช้ useMemo เพื่อป้องกันการคำนวณซ้ำโดยไม่จำเป็น (แม้ว่า cost จะต่ำก็ตาม)
   */
  const stats = useMemo(() => {
    return {
      chars: input.length,
      words: input.trim() ? input.trim().split(/\s+/).length : 0,
      lines: input ? input.split(/\r\n|\r|\n/).length : 0,
    };
  }, [input]);

  /**
   * 📋 Helper: Paste from Clipboard
   */
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      toast.success("Text pasted from clipboard");
    } catch (err) {
      console.error("Clipboard paste failed:", err);
      toast.error("Failed to read clipboard");
    }
  };

  /**
   * 🚀 Helper: Load Demo Text
   */
  const handleDemo = () => {
    setInput("Hello World welcome to CodeXKit Case Converter Tool");
    toast.info("Demo text loaded");
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

          <div className="flex flex-wrap items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8 text-primary hover:text-primary hover:bg-primary/10 transition-colors"
              onClick={handleDemo}
              title="Load Example Text"
            >
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Demo
            </Button>

            <div className="w-px h-4 bg-border mx-1 hidden sm:block" />

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
              className="text-xs h-8 text-muted-foreground hover:text-destructive transition-colors"
              onClick={() => setInput("")}
              disabled={!input}
              title="Clear Input"
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Clear
            </Button>
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
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2.5 py-1 rounded-md border border-border/50 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                    {caseLabels[key]}
                  </span>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
