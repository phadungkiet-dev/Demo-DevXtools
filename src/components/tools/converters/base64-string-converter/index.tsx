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
  Lock,
  Unlock,
  AlertCircle,
  ArrowRightLeft,
  Binary,
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
import { Base64 } from "js-base64";

// =============================================================================
// Types
// =============================================================================
type ConversionMode = "encode" | "decode";

// =============================================================================
// Main Component
// =============================================================================
export function Base64StringConverter() {
  // --- State Management ---
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<ConversionMode>("encode");
  const [error, setError] = useState<string | null>(null);

  // --- Logic & Effects ---

  /**
   * 🔀 Swap Logic
   * สลับ Mode และนำ Output กลับมาเป็น Input
   */
  const handleSwap = () => {
    setInput(output); // เอาผลลัพธ์มาเป็น Input
    setMode((prev) => (prev === "encode" ? "decode" : "encode")); // สลับโหมด
  };

  /**
   * ⚡ Effect: Auto Conversion
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!input.trim()) {
        setOutput("");
        setError(null);
        return;
      }

      try {
        let result = "";
        if (mode === "encode") {
          result = Base64.encode(input);
        } else {
          if (!Base64.isValid(input.trim())) {
            throw new Error("Invalid Base64 string format");
          }
          result = Base64.decode(input);
        }

        setOutput(result);
        setError(null);
      } catch {
        setOutput("");
        setError(
          mode === "decode" ? "Invalid Base64 string" : "Conversion failed"
        );
      }
    }, 300);

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
                mode === "encode"
                  ? "bg-primary/10 text-primary"
                  : "bg-orange-500/10 text-orange-500"
              )}
            >
              {mode === "encode" ? <Lock size={16} /> : <Unlock size={16} />}
            </div>

            <Select
              value={mode}
              onValueChange={(v) => setMode(v as ConversionMode)}
            >
              <SelectTrigger className="h-8 min-w-[130px] bg-background text-xs font-medium border-border/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="encode">Encode (Text → Base64)</SelectItem>
                <SelectItem value="decode">Decode (Base64 → Text)</SelectItem>
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
              mode === "encode"
                ? "Type text to encode (e.g. Hello World)..."
                : "Paste Base64 string to decode (e.g. SGVsbG8=)..."
            }
            spellCheck={false}
          />

          {/* Error Badge */}
          {error && mode === "decode" && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs text-destructive font-medium bg-destructive/10 px-3 py-1.5 rounded-md border border-destructive/20 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2">
              <AlertCircle size={14} />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ================= MIDDLE: SWAP BUTTON ================= */}
      {/* ✅ ปุ่ม Swap ตรงกลาง */}
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
            <div className="p-1.5 bg-primary/10 rounded-md text-primary">
              <Binary size={16} />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              {mode === "encode" ? "Base64 Result" : "Decoded Text"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <DownloadButton
              text={output}
              filename={mode === "encode" ? "encoded.txt" : "decoded.txt"}
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
