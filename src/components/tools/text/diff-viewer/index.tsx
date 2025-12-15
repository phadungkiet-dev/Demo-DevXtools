"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea"; // ✅ ใช้ของที่มีอยู่แล้ว
import { diffLines, Change } from "diff";
import { Trash2, Copy, Eye, ClipboardPaste } from "lucide-react";
import { cn } from "@/lib/utils";
import { CopyButton } from "@/components/shared/copy-button";
import { toast } from "sonner";

export function DiffViewer() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");

  const differences: Change[] = useMemo(() => {
    if (!original && !modified) return [];
    return diffLines(original, modified);
  }, [original, modified]);

  const handleClear = () => {
    setOriginal("");
    setModified("");
  };

  const handlePaste = async (
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setter(clipboardText);
      toast.success("Text pasted from clipboard");
    } catch {
      toast.error("Failed to read clipboard");
    }
  };

  const diffOutput = useMemo(() => {
    return differences.map((part) => part.value).join("");
  }, [differences]);

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:h-[550px] transition-all">
      {/* ================= LEFT/RIGHT INPUTS ================= */}
      <div className="flex flex-col gap-6 h-full">
        {/* Input Card 1: Original */}
        <Card className="flex flex-col h-1/2 overflow-hidden bg-card p-0 border-border/60 shadow-md">
          <Toolbar
            title="Original Text"
            icon={Eye}
            onClear={() => setOriginal("")}
            onPaste={() => handlePaste(setOriginal)}
            hasContent={!!original}
          />
          <CardContent className="p-0 flex-1 relative min-h-[150px] lg:min-h-0">
            {/* ✅ ใช้ Textarea จาก @/components/ui/textarea */}
            <Textarea
              className="w-full h-full resize-none border-0 focus-visible:ring-0 p-4 text-sm leading-relaxed font-mono bg-transparent rounded-none"
              placeholder="Paste original text here..."
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              spellCheck={false}
            />
          </CardContent>
        </Card>

        {/* Input Card 2: Modified */}
        <Card className="flex flex-col h-1/2 overflow-hidden bg-card p-0 border-border/60 shadow-md">
          <Toolbar
            title="Modified Text"
            icon={Eye}
            onClear={() => setModified("")}
            onPaste={() => handlePaste(setModified)}
            hasContent={!!modified}
          />
          <CardContent className="p-0 flex-1 relative min-h-[150px] lg:min-h-0">
            {/* ✅ ใช้ Textarea จาก @/components/ui/textarea */}
            <Textarea
              className="w-full h-full resize-none border-0 focus-visible:ring-0 p-4 text-sm leading-relaxed font-mono bg-transparent rounded-none"
              placeholder="Paste new text here..."
              value={modified}
              onChange={(e) => setModified(e.target.value)}
              spellCheck={false}
            />
          </CardContent>
        </Card>
      </div>

      {/* ================= RIGHT PANEL: DIFF OUTPUT ================= */}
      <Card className="lg:col-span-1 border-border/60 shadow-md flex flex-col h-full overflow-hidden bg-card p-0">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-muted/30 min-h-[60px]">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-primary/10 rounded-md text-primary">
              <Copy size={16} />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              Difference Result
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8 text-muted-foreground hover:text-destructive"
              onClick={handleClear}
              disabled={!original && !modified}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Clear All
            </Button>
            <div className="w-px h-4 bg-border mx-1" />
            <CopyButton
              text={diffOutput}
              className="h-9 w-9 hover:bg-background hover:text-primary transition-colors"
            />
          </div>
        </div>

        <CardContent className="p-0 flex-1 relative min-h-[300px] lg:min-h-0">
          <pre className="h-full overflow-auto scrollbar-thin scrollbar-thumb-muted-foreground/20">
            <code className="font-mono text-xs leading-relaxed block p-4 h-full whitespace-pre-wrap break-all">
              {differences.length === 0 && (
                <div className="text-muted-foreground opacity-50 text-center mt-10">
                  Waiting for input to compare...
                </div>
              )}
              {differences.map((part, index) => (
                <span
                  key={index}
                  className={cn("block px-1 rounded-sm", {
                    "bg-red-500/10 text-red-700 dark:text-red-400":
                      part.removed,
                    "bg-green-500/10 text-green-700 dark:text-green-400":
                      part.added,
                  })}
                >
                  <span className="inline-block w-4 mr-1 opacity-50 select-none">
                    {part.added ? "+" : part.removed ? "-" : " "}
                  </span>
                  {part.value}
                </span>
              ))}
            </code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper: Toolbar (Reuse Logic)
interface ToolbarProps {
  title: string;
  icon: React.ElementType;
  onClear: () => void;
  onPaste: () => void;
  hasContent: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  title,
  icon: Icon,
  onClear,
  onPaste,
  hasContent,
}) => (
  <div className="flex items-center justify-between px-6 py-3 border-b border-border/40 bg-muted/30 min-h-[56px]">
    <div className="flex items-center gap-3">
      <div className="p-1.5 bg-primary/10 rounded-md text-primary">
        <Icon size={16} />
      </div>
      <span className="text-sm font-semibold text-muted-foreground">
        {title}
      </span>
    </div>
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="text-xs h-8 text-muted-foreground hover:text-foreground hidden sm:flex"
        onClick={onPaste}
      >
        <ClipboardPaste className="mr-2 h-3.5 w-3.5" />
        Paste
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-xs h-8 text-muted-foreground hover:text-destructive"
        onClick={onClear}
        disabled={!hasContent}
      >
        <Trash2 className="mr-2 h-3.5 w-3.5" />
        Clear
      </Button>
    </div>
  </div>
);
