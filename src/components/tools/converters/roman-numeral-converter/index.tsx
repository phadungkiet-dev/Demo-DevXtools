"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Trash2,
  ClipboardPaste,
  Type,
  ArrowRightLeft,
  Hash,
  Info,
} from "lucide-react";
import { CopyButton } from "@/components/shared/copy-button";
import { DownloadButton } from "@/components/shared/download-button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
// ✅ 1. Import library romans
import romans from "romans";

export function RomanNumeralConverter() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState<string>("Waiting...");

  // Logic: Auto Convert using 'romans' library
  useEffect(() => {
    const timer = setTimeout(() => {
      const cleanInput = input.trim();

      if (!cleanInput) {
        setResult("");
        setMode("Waiting...");
        return;
      }

      try {
        // Case 1: Input is Number -> Convert to Roman
        if (/^\d+$/.test(cleanInput)) {
          const num = parseInt(cleanInput, 10);
          // Library 'romans' might throw error for 0 or negative
          if (num <= 0 || num >= 4000) {
            setResult("Standard Roman numerals are 1-3999");
            setMode("Invalid");
          } else {
            const roman = romans.romanize(num);
            setResult(roman);
            setMode("Number → Roman");
          }
        }
        // Case 2: Input is Roman -> Convert to Number
        else if (/^[a-zA-Z]+$/.test(cleanInput)) {
          const num = romans.deromanize(cleanInput.toUpperCase());
          setResult(num.toString());
          setMode("Roman → Number");
        }
        // Invalid Format
        else {
          setResult("Invalid format");
          setMode("Invalid");
        }
      } catch (error) {
        // romans library throws error on invalid sequence
        setResult("Invalid Roman Numeral");
        setMode("Invalid");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [input]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      toast.success("Pasted from clipboard");
    } catch {
      toast.error("Failed to read clipboard");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:h-[550px] transition-all">
      {/* ================= LEFT: INPUT ================= */}
      <Card className="flex flex-col h-full overflow-hidden bg-card p-0 border-border/60 shadow-md">
        {/* Input Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-muted/30 min-h-[60px]">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-primary/10 rounded-md text-primary">
              <Type size={16} />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              Input Value
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
              onClick={() => setInput("")}
              disabled={!input}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Clear
            </Button>
          </div>
        </div>

        {/* Input Area */}
        <CardContent className="p-0 flex-1 relative">
          <Textarea
            className={cn(
              "w-full h-full resize-none border-0 focus-visible:ring-0 p-6 text-base leading-relaxed font-mono bg-transparent rounded-none shadow-none",
              "scrollbar-thin scrollbar-thumb-muted-foreground/20"
            )}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a number (e.g., 2024) or Roman numeral (e.g., MMXXIV)..."
            spellCheck={false}
          />
          {/* Hint Overlay */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 text-[10px] text-muted-foreground/60 bg-background/50 px-2 py-1 rounded border border-border/20 backdrop-blur-sm pointer-events-none">
            <Info size={12} />
            <span>Auto-detects format</span>
          </div>
        </CardContent>
      </Card>

      {/* ================= RIGHT: OUTPUT ================= */}
      <Card className="flex flex-col h-full overflow-hidden bg-card p-0 border-border/60 shadow-md">
        {/* Output Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-muted/30 min-h-[60px]">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-primary/10 rounded-md text-primary">
              <ArrowRightLeft size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-muted-foreground">
                Result
              </span>
              {mode !== "Waiting..." && mode !== "Invalid" && (
                <span className="text-[10px] text-primary font-medium">
                  {mode}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DownloadButton
              text={result}
              filename="roman-conversion"
              className="h-9 w-9 hover:bg-background hover:text-primary transition-colors"
            />
            <CopyButton
              text={result}
              className="h-9 w-9 hover:bg-background hover:text-primary transition-colors"
            />
          </div>
        </div>

        {/* Output Area */}
        <CardContent className="p-0 flex-1 relative bg-muted/10">
          <div className="w-full h-full p-6 flex flex-col items-center justify-center text-center">
            {result ? (
              <div className="space-y-4 max-w-full overflow-hidden">
                <span
                  className={cn(
                    "block text-4xl md:text-6xl font-bold tracking-tight break-all",
                    mode === "Invalid" ||
                      result.startsWith("Invalid") ||
                      result.startsWith("Standard")
                      ? "text-destructive text-2xl md:text-3xl"
                      : "text-foreground"
                  )}
                >
                  {result}
                </span>
                {mode !== "Invalid" &&
                  !result.startsWith("Invalid") &&
                  !result.startsWith("Standard") && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      <Hash size={12} />
                      {mode === "Number → Roman"
                        ? "Roman Numeral"
                        : "Decimal Number"}
                    </div>
                  )}
              </div>
            ) : (
              <div className="text-muted-foreground/40 flex flex-col items-center gap-3">
                <Hash size={48} strokeWidth={1} />
                <p>Enter a value to convert...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
