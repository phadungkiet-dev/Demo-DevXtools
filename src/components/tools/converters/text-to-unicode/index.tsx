"use client";

// =============================================================================
// Imports
// =============================================================================
import { useState, useEffect } from "react";

// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Icons
import {
  Languages,
  Code2,
  ArrowRightLeft,
  AlertCircle,
} from "lucide-react";

// Shared Components
import {
  CopyButton,
  DownloadButton,
  PasteButton,
  ClearButton,
  SwapButton,
} from "@/components/shared/buttons";

// Utils & Libs
import { cn } from "@/lib/utils";

// =============================================================================
// Types
// =============================================================================
type ConversionMode = "text-to-unicode" | "unicode-to-text";

// =============================================================================
// Main Component
// =============================================================================
export function TextToUnicodeConverter() {
  // --- State Management ---
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<ConversionMode>("text-to-unicode");
  const [error, setError] = useState<string | null>(null);

  // --- Logic & Effects ---

  /**
   * 🔀 Swap Logic
   */
  const handleSwap = () => {
    setInput(output);
    setMode((prev) => 
      prev === "text-to-unicode" ? "unicode-to-text" : "text-to-unicode"
    );
  };

  /**
   * ⚡ Effect: Auto Conversion
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      // 1. Empty Check
      if (!input) {
        setOutput("");
        setError(null);
        return;
      }

      try {
        let result = "";

        if (mode === "text-to-unicode") {
          // Text -> Unicode (\uXXXX)
          result = input
            .split("")
            .map((char) => {
              const code = char.charCodeAt(0).toString(16).toUpperCase();
              return "\\u" + code.padStart(4, "0");
            })
            .join("");
        } else {
          // Unicode -> Text
          // Basic Regex check for \uXXXX pattern
          if (!/(\\u[\dA-F]{4})/gi.test(input)) {
             // ถ้าไม่มี pattern unicode เลย ให้เตือน (แต่พยายามแปลงส่วนที่ได้)
             // หรือจะ throw error เลยก็ได้ตามต้องการ
          }

          result = input.replace(/\\u[\dA-F]{4}/gi, (match) => {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16));
          });
        }

        setOutput(result);
        setError(null);
      } catch {
        setOutput("");
        setError("Invalid format");
      }
    }, 300); // Debounce

    return () => clearTimeout(timer);
  }, [input, mode]);

  return (
    // ✅ Layout: Flex Column (Mobile) -> Flex Row (Desktop)
    <div className="flex flex-col lg:flex-row items-stretch lg:h-[600px] gap-4 transition-all animate-in fade-in duration-500">
      
      {/* ================= LEFT PANEL: INPUT ================= */}
      <Card className="flex-1 flex flex-col overflow-hidden bg-card p-0 border-border/60 shadow-md hover:shadow-lg transition-shadow">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/30 min-h-[60px] gap-3 shrink-0">
          
          {/* Mode Selector */}
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "p-1.5 rounded-md transition-colors",
                mode === "text-to-unicode"
                  ? "bg-blue-500/10 text-blue-500"
                  : "bg-purple-500/10 text-purple-500"
              )}
            >
              {mode === "text-to-unicode" ? (
                <Languages size={16} />
              ) : (
                <Code2 size={16} />
              )}
            </div>

            <Select
              value={mode}
              onValueChange={(v) => setMode(v as ConversionMode)}
            >
              <SelectTrigger className="h-8 min-w-[150px] bg-background text-xs font-medium border-border/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text-to-unicode">Text → Unicode</SelectItem>
                <SelectItem value="unicode-to-text">Unicode → Text</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 self-end sm:self-auto">
            <PasteButton onPaste={setInput} />
            <ClearButton onClear={() => setInput("")} disabled={!input} />
          </div>
        </div>

        {/* Input Area */}
        <CardContent className="p-0 flex-1 relative min-h-0">
          <Textarea
            className={cn(
              "w-full h-full resize-none border-0 focus-visible:ring-0 p-6 text-sm md:text-base leading-relaxed font-mono bg-transparent rounded-none shadow-none text-foreground/90",
              "scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent",
              "placeholder:text-muted-foreground/40",
              error && "text-destructive"
            )}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "text-to-unicode"
                ? "Type text here (e.g., Hello ภาษาไทย)..."
                : "Paste Unicode here (e.g., \\u0048\\u0065\\u006C\\u006C\\u006F)..."
            }
            spellCheck={false}
          />

          {/* Error Badge */}
          {error && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs text-destructive font-medium bg-destructive/10 px-3 py-1.5 rounded-md border border-destructive/20 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2">
              <AlertCircle size={14} />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ================= MIDDLE: SWAP BUTTON ================= */}
      <div className="flex items-center justify-center shrink-0 -my-2 lg:my-0">
        <SwapButton 
          onSwap={handleSwap} 
          className="h-10 w-10 border shadow-md bg-background hover:bg-muted text-primary"
        />
      </div>

      {/* ================= RIGHT PANEL: OUTPUT ================= */}
      <Card className="flex-1 flex flex-col overflow-hidden bg-card p-0 border-border/60 shadow-md hover:shadow-lg transition-shadow">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/30 min-h-[60px] shrink-0">
          <div className="flex items-center gap-2">
            <ArrowRightLeft size={16} className="text-muted-foreground mx-1" />
            <div
              className={cn(
                "p-1.5 rounded-md transition-colors",
                mode === "unicode-to-text" // Output mode is opposite of Input
                  ? "bg-blue-500/10 text-blue-500"
                  : "bg-purple-500/10 text-purple-500"
              )}
            >
               {mode === "unicode-to-text" ? (
                <Languages size={16} />
              ) : (
                <Code2 size={16} />
              )}
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              {mode === "text-to-unicode" ? "Unicode Result" : "Decoded Text"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <DownloadButton
              text={output}
              filename={mode === "text-to-unicode" ? "unicode.txt" : "text.txt"}
              className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
            />
            <CopyButton
              text={output}
              className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
            />
          </div>
        </div>

        {/* Output Area */}
        <CardContent className="p-0 flex-1 relative bg-muted/10 min-h-0">
          <Textarea
            className={cn(
              "w-full h-full resize-none border-0 focus-visible:ring-0 p-6 text-sm md:text-base leading-relaxed font-mono bg-transparent rounded-none shadow-none",
              "text-muted-foreground focus:text-foreground transition-colors",
              "scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent"
            )}
            value={output}
            readOnly
            placeholder="Result will appear here..."
          />
        </CardContent>
      </Card>
    </div>
  );
}