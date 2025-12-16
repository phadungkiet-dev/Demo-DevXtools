"use client";

// =============================================================================
// Imports
// =============================================================================
import { useState, useMemo } from "react";
// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
// Icons
import {
  Trash2,
  Copy,
  Eye,
  ClipboardPaste,
  ArrowRightLeft, // For Swap button
  FileDiff,
  Search,
  PenLine,
} from "lucide-react";
// Utils & Libs
import { diffLines, Change } from "diff";
import { cn } from "@/lib/utils";
import { CopyButton } from "@/components/shared/copy-button";
import { toast } from "sonner";

// =============================================================================
// Main Component
// =============================================================================
export function DiffViewer() {
  // --- State Management ---
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");

  /**
   * 🔄 Derived State: Diff Calculation
   * ใช้ useMemo เพื่อคำนวณ Diff เฉพาะเมื่อ input เปลี่ยน
   * diffLines จะเปรียบเทียบทีละบรรทัด (เหมาะกับ Text/Code ทั่วไป)
   */
  const differences: Change[] = useMemo(() => {
    // ถ้าไม่มีข้อมูลเลย ให้ return array ว่าง
    if (!original && !modified) return [];

    // คำนวณความต่าง
    return diffLines(original, modified);
  }, [original, modified]);

  /**
   * 📝 Helper: Generate Raw Diff Text (สำหรับ Copy)
   */
  const rawDiffOutput = useMemo(() => {
    return differences.map((part) => part.value).join("");
  }, [differences]);

  /**
   * 🎮 Handlers
   */
  const handleClearAll = () => {
    setOriginal("");
    setModified("");
    toast.success("Cleared all inputs");
  };

  const handleSwap = () => {
    setOriginal(modified);
    setModified(original);
    toast.info("Swapped original and modified text");
  };

  const handlePaste = async (setter: (val: string) => void) => {
    try {
      const text = await navigator.clipboard.readText();
      setter(text);
      toast.success("Pasted from clipboard");
    } catch {
      toast.error("Failed to read clipboard");
    }
  };

  return (
    // Grid Layout: Mobile Stack, Desktop 2 Columns
    <div className="grid gap-6 lg:grid-cols-2 lg:h-[650px] transition-all animate-in fade-in duration-500">
      {/* ================= LEFT COLUMN: INPUTS ================= */}
      <div className="flex flex-col gap-4 h-full min-h-[500px]">
        {/* Input 1: Original */}
        <Card className="flex flex-col flex-1 overflow-hidden bg-card p-0 border-border/60 shadow-md">
          <InputToolbar
            title="Original Text"
            icon={Eye}
            onClear={() => setOriginal("")}
            onPaste={() => handlePaste(setOriginal)}
            hasContent={!!original}
          />
          <CardContent className="p-0 flex-1 relative min-h-[150px]">
            <Textarea
              className="w-full h-full resize-none border-0 focus-visible:ring-0 p-4 text-sm leading-relaxed font-mono bg-transparent rounded-none placeholder:text-muted-foreground/30"
              placeholder="Paste original text here..."
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              spellCheck={false}
            />
          </CardContent>
        </Card>

        {/* Swap Button (Centered visually between inputs) */}
        <div className="flex justify-center -my-2 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSwap}
            className="rounded-full h-8 w-8 p-0 border-border/60 shadow-sm bg-background hover:bg-muted transition-transform active:scale-95"
            title="Swap Inputs"
          >
            <ArrowRightLeft size={14} className="text-muted-foreground" />
          </Button>
        </div>

        {/* Input 2: Modified */}
        <Card className="flex flex-col flex-1 overflow-hidden bg-card p-0 border-border/60 shadow-md">
          <InputToolbar
            title="Modified Text"
            icon={PenLine}
            onClear={() => setModified("")}
            onPaste={() => handlePaste(setModified)}
            hasContent={!!modified}
          />
          <CardContent className="p-0 flex-1 relative min-h-[150px]">
            <Textarea
              className="w-full h-full resize-none border-0 focus-visible:ring-0 p-4 text-sm leading-relaxed font-mono bg-transparent rounded-none placeholder:text-muted-foreground/30"
              placeholder="Paste modified text here..."
              value={modified}
              onChange={(e) => setModified(e.target.value)}
              spellCheck={false}
            />
          </CardContent>
        </Card>
      </div>

      {/* ================= RIGHT COLUMN: DIFF OUTPUT ================= */}
      <Card className="lg:col-span-1 border-border/60 shadow-md flex flex-col h-full overflow-hidden bg-card p-0 min-h-[400px]">
        {/* Output Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-muted/30 min-h-[60px]">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-primary/10 rounded-md text-primary shadow-sm">
              <FileDiff size={16} />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              Comparison Result
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8 text-muted-foreground hover:text-destructive transition-colors"
              onClick={handleClearAll}
              disabled={!original && !modified}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Clear All
            </Button>
            <div className="w-px h-4 bg-border mx-1" />
            <CopyButton
              text={rawDiffOutput}
              className="h-8 w-8 hover:bg-background hover:text-primary transition-colors"
            />
          </div>
        </div>

        {/* Output Content */}
        <CardContent className="p-0 flex-1 relative overflow-hidden bg-background/50">
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
                    "block px-2 py-0.5 rounded-sm transition-colors",
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

// =============================================================================
// Helper Component: Input Toolbar
// =============================================================================
interface InputToolbarProps {
  title: string;
  icon: React.ElementType;
  onClear: () => void;
  onPaste: () => void;
  hasContent: boolean;
}

const InputToolbar: React.FC<InputToolbarProps> = ({
  title,
  icon: Icon,
  onClear,
  onPaste,
  hasContent,
}) => (
  <div className="flex items-center justify-between px-4 py-2 border-b border-border/40 bg-muted/30 min-h-[48px]">
    <div className="flex items-center gap-2">
      <Icon size={14} className="text-muted-foreground" />
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {title}
      </span>
    </div>
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="text-[10px] h-7 px-2 text-muted-foreground hover:text-foreground"
        onClick={onPaste}
      >
        <ClipboardPaste className="mr-1.5 h-3 w-3" />
        Paste
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-[10px] h-7 px-2 text-muted-foreground hover:text-destructive"
        onClick={onClear}
        disabled={!hasContent}
      >
        <Trash2 className="mr-1.5 h-3 w-3" />
        Clear
      </Button>
    </div>
  </div>
);
