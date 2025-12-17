"use client";

// =============================================================================
// Imports
// =============================================================================
import { useState } from "react";
// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
// Icons
import { Type, ArrowRightLeft, Hash, Info, AlertCircle } from "lucide-react";
// Shared Components
import {
  CopyButton,
  DownloadButton,
  PasteButton,
  ClearButton,
} from "@/components/shared/buttons";
// Utils & Libs
import { cn } from "@/lib/utils";
import romans from "romans";

// =============================================================================
// Types
// =============================================================================
type ConversionMode =
  | "Waiting..."
  | "Number → Roman"
  | "Roman → Number"
  | "Invalid"
  | "Out of Range";

// =============================================================================
// Main Component
// =============================================================================
export function RomanNumeralConverter() {
  // --- State Management ---
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState<ConversionMode>("Waiting...");

  // --- Logic ---

  /**
   * 🧠 Core Logic: Handles input changes and triggers conversion immediately.
   */
  const handleInputChange = (value: string) => {
    setInput(value);
    const cleanInput = value.trim();

    // 1. Empty Case: Reset everything
    if (!cleanInput) {
      setResult("");
      setMode("Waiting...");
      return;
    }

    try {
      // 2. Case: Input is Number (Decimal)
      if (/^\d+$/.test(cleanInput)) {
        const num = parseInt(cleanInput, 10);

        // Valid Roman range for standard notation is typically 1 - 3999
        if (num <= 0 || num >= 4000) {
          setResult("Standard Roman numerals are 1-3999");
          setMode("Out of Range");
        } else {
          // ใช้ Library romans
          const roman = romans.romanize(num);
          setResult(roman);
          setMode("Number → Roman");
        }
      }
      // 3. Case: Input is Roman Letters (Checking valid chars)
      else if (/^[MDCLXVImdclxvi]+$/.test(cleanInput)) {
        try {
          // ใช้ Library romans
          const num = romans.deromanize(cleanInput.toUpperCase());
          setResult(num.toString());
          setMode("Roman → Number");
        } catch {
          // romans lib throws error if sequence is invalid (e.g., IIII)
          setResult("Invalid Roman Sequence");
          setMode("Invalid");
        }
      }
      // 4. Case: Invalid characters
      else {
        setResult("Invalid format (Use 0-9 or I, V, X, L, C, D, M)");
        setMode("Invalid");
      }
    } catch {
      setResult("Conversion Error");
      setMode("Invalid");
    }
  };

  return (
    // Grid Layout: Mobile Stack, Desktop 2 Columns Fixed Height
    <div className="grid gap-6 lg:grid-cols-2 lg:h-[550px] transition-all animate-in fade-in duration-500">
      {/* ================= LEFT PANEL: INPUT ================= */}
      <Card className="flex flex-col h-[300px] lg:h-full overflow-hidden bg-card p-0 border-border/60 shadow-md hover:shadow-lg transition-shadow">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/30 min-h-[60px] shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-md text-primary">
              <Type size={16} />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              Input Value
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* ✅ ใช้ Shared Buttons แทนการเขียนปุ่มเอง */}
            <PasteButton onPaste={handleInputChange} />
            <ClearButton
              onClear={() => handleInputChange("")}
              disabled={!input}
            />
          </div>
        </div>

        {/* Input Area */}
        <CardContent className="p-0 flex-1 relative min-h-0">
          <Textarea
            className={cn(
              "w-full h-full resize-none border-0 focus-visible:ring-0 p-6 text-base md:text-lg leading-relaxed font-mono bg-transparent rounded-none shadow-none text-foreground",
              "scrollbar-thin scrollbar-thumb-muted-foreground/20 placeholder:text-muted-foreground/30"
            )}
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Type number (2024) or Roman (MMXXIV)..."
            spellCheck={false}
          />
          {/* Hint Overlay */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 text-[10px] text-muted-foreground/60 bg-background/80 px-2 py-1 rounded-md border border-border/20 backdrop-blur-sm pointer-events-none select-none">
            <Info size={12} />
            <span>Auto-detects format</span>
          </div>
        </CardContent>
      </Card>

      {/* ================= RIGHT PANEL: OUTPUT ================= */}
      <Card className="flex flex-col h-[300px] lg:h-full overflow-hidden bg-card p-0 border-border/60 shadow-md hover:shadow-lg transition-shadow">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/30 min-h-[60px] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-primary/10 rounded-md text-primary">
              <ArrowRightLeft size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-muted-foreground">
                Result
              </span>
              {mode !== "Waiting..." && mode !== "Invalid" && (
                <span className="text-[10px] text-primary font-medium animate-in fade-in slide-in-from-left-1">
                  {mode}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <DownloadButton
              text={result}
              filename="roman-conversion"
              className="h-8 w-8 hover:bg-background hover:text-primary transition-colors"
            />
            <CopyButton
              text={result}
              className="h-8 w-8 hover:bg-background hover:text-primary transition-colors"
            />
          </div>
        </div>

        {/* Result Display */}
        <CardContent className="p-0 flex-1 relative bg-muted/10 min-h-0 flex flex-col items-center justify-center text-center">
          {result ? (
            <div className="w-full px-8 space-y-4 animate-in zoom-in-95 duration-200">
              <span
                className={cn(
                  "block font-bold tracking-tight break-all leading-tight transition-colors duration-300",
                  // Conditional Styling based on Error/Success
                  mode === "Invalid" || mode === "Out of Range"
                    ? "text-destructive text-xl md:text-2xl"
                    : "text-foreground text-5xl md:text-7xl"
                )}
              >
                {/* Show Alert Icon if Error */}
                {(mode === "Invalid" || mode === "Out of Range") && (
                  <AlertCircle className="inline-block mr-2 mb-1" size={24} />
                )}
                {result}
              </span>

              {/* Status Badge */}
              {mode !== "Invalid" && mode !== "Out of Range" && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  <Hash size={12} />
                  {mode === "Number → Roman"
                    ? "Roman Numeral"
                    : "Decimal Value"}
                </div>
              )}
            </div>
          ) : (
            // Empty State
            <div className="text-muted-foreground/30 flex flex-col items-center gap-4 select-none animate-in fade-in duration-500">
              <div className="p-4 rounded-full bg-muted/20">
                <Hash size={48} strokeWidth={1.5} />
              </div>
              <p className="text-sm">Enter a value to convert...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
