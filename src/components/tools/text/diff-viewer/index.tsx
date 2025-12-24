"use client";

// Imports ==================
import { useState, useMemo } from "react";
// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
// Icons
import { Eye, FileDiff, Search, PenLine } from "lucide-react";
// Shared Components
import {
  CopyButton,
  PasteButton,
  ClearButton,
  SwapButton,
} from "@/components/shared/buttons";

// Utils & Libs
import { diffLines, Change } from "diff";
import { cn } from "@/lib/utils";

// Main Component ===================
export function DiffViewer() {
  // --- State Management ---
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");

  // Derived State: Diff Calculation
  const differences: Change[] = useMemo(() => {
    if (!original && !modified) return [];
    return diffLines(original, modified);
  }, [original, modified]);

  // Derived State: Diff Calculation
  const rawDiffOutput = useMemo(() => {
    return differences.map((part) => part.value).join("");
  }, [differences]);

  // Handlers
  const handleSwap = () => {
    setOriginal(modified);
    setModified(original);
  };

  const handleClearAll = () => {
    setOriginal("");
    setModified("");
  };

  // Render
  return (
    // Grid Layout: Mobile Stack, Desktop 2 Columns
    <div
      className={cn(
        // Layout & Grid System
        "grid gap-6 lg:grid-cols-2 lg:h-[650px]",
        // Animation Core
        "animate-in fade-in slide-in-from-bottom-4",
        // Animation Timing
        "duration-600 ease-out",
        // Animation Staging
        "delay-200 fill-mode-backwards"
      )}
    >
      {/* ================= LEFT COLUMN: INPUTS ================= */}
      <div className="flex flex-col gap-4 h-full min-h-[500px]">
        {/* Input 1: Original */}
        <Card
          className={cn(
            // Layout
            "flex flex-col flex-1",
            // Visuals
            "bg-card backdrop-blur-sm border-border/60 shadow-md",
            // Container Style
            "p-0 overflow-hidden"
          )}
        >
          <InputToolbar
            title="Original Text"
            icon={Eye}
            onClear={() => setOriginal("")}
            onPaste={setOriginal}
            hasContent={!!original}
          />
          <CardContent className="px-1 py-1 relative min-h-[150px] lg:min-h-0 flex-1">
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
              placeholder="Paste original text here..."
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              spellCheck={false}
            />
          </CardContent>
        </Card>

        {/* Swap Button (Centered visually between inputs) */}
        <div className="flex justify-center -my-2 z-10">
          <SwapButton onSwap={handleSwap} />
        </div>

        {/* Input 2: Modified */}
        <Card
          className={cn(
            // Layout
            "flex flex-col flex-1",
            // Visuals
            "bg-card backdrop-blur-sm border-border/60 shadow-md",
            // Container Style
            "p-0 overflow-hidden"
          )}
        >
          <InputToolbar
            title="Modified Text"
            icon={PenLine}
            onClear={() => setModified("")}
            onPaste={setModified}
            hasContent={!!modified}
          />
          <CardContent className="px-1 py-1 relative min-h-[150px] lg:min-h-0 flex-1">
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
              placeholder="Paste modified text here..."
              value={modified}
              onChange={(e) => setModified(e.target.value)}
              spellCheck={false}
            />
          </CardContent>
        </Card>
      </div>

      {/* ================= RIGHT COLUMN: DIFF OUTPUT ================= */}
      <Card
        className={cn(
          // Grid & Flex Layout
          "lg:col-span-1 h-full flex flex-col overflow-hidden",
          // Visuals
          "bg-card border-border/60 shadow-md",
          // Spacing
          "p-0 gap-2 sm-gap-4 min-h-[400px]",
          // Animation & Interaction
          "transition-all hover:shadow-lg"
        )}
      >
        {/* Output Toolbar */}
        <div
          className={cn(
            // Layout & Direction (การจัดวางและทิศทาง)
            "flex flex-col sm:flex-row justify-between",
            // Sizing & Spacing
            "min-h-[60px] px-6 py-4 md:py-2 gap-4",
            // Visuals
            "bg-muted/40 border-b border-border/60"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-md text-primary shadow-sm">
              <FileDiff size={16} />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              Comparison Result
            </span>
          </div>

          <div
            className={cn(
              // Layout & Sizing
              "flex flex-warp items-center gap-1",
              "w-full sm:w-auto",
              // Alignment
              "justify-center sm:justify-end"
            )}
          >
            {/* ใช้ Shared ClearButton สำหรับ "Clear All" */}
            <ClearButton
              onClear={handleClearAll}
              disabled={!original && !modified}
            />

            <div className="w-px h-4 bg-border mx-1 hidden sm:block" />

            <CopyButton
              text={rawDiffOutput}
              className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10"
            />
          </div>
        </div>

        {/* Output Content */}
        <CardContent className="px-1 py-1 relative min-h-[300px] lg:min-h-0 flex-1">
          <div className="h-full overflow-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 p-4">
            {/* Empty State */}
            {differences.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground/40 gap-3 select-none">
                <Search size={48} strokeWidth={1} />
                <p>Enter text on both sides to compare...</p>
              </div>
            )}

            {/* Diff Render */}
            <div className="font-mono text-xs md:text-sm leading-relaxed whitespace-pre-wrap break-all">
              {differences.map((part, index) => (
                <span
                  key={index}
                  className={cn(
                    "block px-1 py-0.5 rounded-sm transition-colors",
                    {
                      // Added: Green background
                      "bg-green-500/15 text-green-700 dark:text-green-400 border-l-2 border-green-500/50":
                        part.added,
                      // Removed: Red background
                      "bg-red-500/15 text-red-700 dark:text-red-400 border-l-2 border-red-500/50":
                        part.removed,
                      // Unchanged: Default text
                      "text-muted-foreground/80": !part.added && !part.removed,
                    }
                  )}
                >
                  <span
                    className={cn(
                      "inline-block w-4 mr-2 select-none opacity-50 font-bold",
                      part.added
                        ? "text-green-600"
                        : part.removed
                        ? "text-red-600"
                        : "invisible"
                    )}
                  >
                    {part.added ? "+" : part.removed ? "-" : "•"}
                  </span>
                  {part.value}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper Component: Input Toolbar ====================
interface InputToolbarProps {
  title: string;
  icon: React.ElementType;
  onClear: () => void;
  onPaste: (text: string) => void;
  hasContent: boolean;
}

const InputToolbar: React.FC<InputToolbarProps> = ({
  title,
  icon: Icon,
  onClear,
  onPaste,
  hasContent,
}) => (
  <div
    className={cn(
      // Layout & Direction
      "flex flex-col sm:flex-row justify-between",
      // Sizing & Spacing
      "min-h-[60px] px-6 py-4 md:py-2 gap-4",
      // Visuals
      "bg-muted/40 border-b border-borer/60"
    )}
  >
    <div className="flex items-center gap-3">
      <div className="p-2 bg-primary/10 rounded-md text-primary shadow-sm">
        <Icon size={16} />
      </div>
      <span className="text-sm font-semibold text-muted-foreground">
        {title}
      </span>
    </div>

    <div
      className={cn(
        // Layout & Sizing
        "flex flex-warp items-center gap-1",
        "w-full sm:w-auto",
        // Alignment
        "justify-center sm:justify-end"
      )}
    >
      <PasteButton onPaste={onPaste} />
      <ClearButton onClear={onClear} disabled={!hasContent} />
    </div>
  </div>
);
