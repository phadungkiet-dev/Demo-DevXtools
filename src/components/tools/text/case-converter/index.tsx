"use client";

import { useState, useMemo } from "react";
// ✅ 1. Use the UI Textarea component
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  ClipboardPaste,
  Sparkles,
  Type, // Added icon for consistency
} from "lucide-react";
import { transformers, caseLabels, CaseType } from "@/lib/transformers";
import { CopyButton } from "@/components/shared/copy-button";
import { DownloadButton } from "@/components/shared/download-button";
import { toast } from "sonner";
import { cn } from "@/lib/utils"; // Needed for cn()

export function CaseConverter() {
  const [input, setInput] = useState("");

  const stats = useMemo(() => {
    return {
      chars: input.length,
      words: input.trim() ? input.trim().split(/\s+/).length : 0,
      lines: input ? input.split(/\r\n|\r|\n/).length : 0,
    };
  }, [input]);

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

  const handleDemo = () => {
    setInput("Hello World welcome to CodeXKit");
    toast.info("Demo text loaded");
  };

  return (
    <div className="space-y-6">
      {/* --- Input Section (Refactored to Card + Toolbar) --- */}
      <Card className="border-border/60 shadow-md flex flex-col overflow-hidden bg-card p-0">
        {/* Toolbar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-3 border-b border-border/40 bg-muted/30 min-h-[56px] gap-4 sm:gap-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-primary/10 rounded-md text-primary">
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
              className="text-xs h-8 text-primary hover:text-primary hover:bg-primary/10"
              onClick={handleDemo}
            >
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Demo
            </Button>

            <div className="w-px h-4 bg-border mx-1 hidden sm:block" />

            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8 text-muted-foreground hover:text-foreground"
              onClick={handlePaste}
            >
              <ClipboardPaste className="mr-2 h-3.5 w-3.5" />
              Paste
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8 text-muted-foreground hover:text-destructive"
              onClick={() => setInput("")}
              disabled={!input}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Clear
            </Button>
          </div>
        </div>

        {/* Text Area (Full Bleed) */}
        <CardContent className="p-0 relative min-h-[150px]">
          <Textarea
            id="input-text"
            className={cn(
              "w-full h-full min-h-[150px] resize-y border-0 focus-visible:ring-0 p-6 text-base leading-relaxed text-foreground/90 font-mono bg-transparent rounded-none shadow-none",
              "scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent selection:bg-primary/20"
            )}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste your text here to convert case..."
            spellCheck={false}
          />

          {/* Stats Overlay (Bottom Right) */}
          <div className="absolute bottom-2 right-4 flex items-center gap-4 text-[10px] font-mono text-muted-foreground/60 select-none bg-background/50 backdrop-blur-sm px-2 py-1 rounded-md border border-border/20">
            <span>{stats.chars} chars</span>
            <span className="w-px h-2 bg-border/50" />
            <span>{stats.words} words</span>
            <span className="w-px h-2 bg-border/50" />
            <span>{stats.lines} lines</span>
          </div>
        </CardContent>
      </Card>

      {/* --- Outputs Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Object.keys(transformers) as CaseType[]).map((key) => {
          const result = input ? transformers[key](input) : "";

          return (
            <Card
              key={key}
              className="overflow-hidden group hover:border-primary/50 transition-all duration-200 hover:shadow-sm"
            >
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/50 px-2 py-0.5 rounded-full">
                    {caseLabels[key]}
                  </span>

                  <div className="flex items-center gap-1">
                    <DownloadButton
                      text={result}
                      filename={key}
                      className="h-7 w-7 text-muted-foreground hover:text-primary"
                    />
                    <CopyButton
                      text={result}
                      className="h-7 w-7 text-muted-foreground hover:text-primary"
                    />
                  </div>
                </div>

                <div className="min-h-[3rem] max-h-[150px] overflow-y-auto p-2.5 bg-muted/30 border border-border/50 rounded-md font-mono text-sm break-all relative scrollbar-thin scrollbar-thumb-muted-foreground/20">
                  {result || (
                    <span className="text-muted-foreground/30 italic select-none text-xs">
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
