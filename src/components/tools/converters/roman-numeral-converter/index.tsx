"use client";

// Imports ==================
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

// Types =================
type ConversionMode =
  | "Waiting..."
  | "Number → Roman"
  | "Roman → Number"
  | "Invalid"
  | "Out of Range";

// Main Component ===============
export function RomanNumeralConverter() {
  // --- State Management ---
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState<ConversionMode>("Waiting...");

  // --- Logic ---

  // Core Logic: Handles input changes and triggers conversion immediately.

  const handleInputChange = (value: string) => {
    setInput(value);
    const cleanInput = value.trim();

    // Empty Case: Reset everything
    if (!cleanInput) {
      setResult("");
      setMode("Waiting...");
      return;
    }

    try {
      // Case: Input is Number (Decimal)
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
      // Case: Input is Roman Letters (Checking valid chars)
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
      // Case: Invalid characters
      else {
        setResult("Invalid format (Use 0-9 or I, V, X, L, C, D, M)");
        setMode("Invalid");
      }
    } catch {
      setResult("Conversion Error");
      setMode("Invalid");
    }
  };

  // Render
  return (
    // Grid Layout: Mobile Stack, Desktop 2 Columns Fixed Height
    <div
      className={cn(
        // Grid Layout
        "grid gap-6 lg:grid-cols-2 lg:h-[550px]",
        // Animation Core
        "animate-in fade-in slide-in-from-bottom-4",
        // Animation Timing
        "duration-600 ease-out",
        // Animation Staging
        "delay-200 fill-mode-backwards"
      )}
    >
      {/* ================= LEFT PANEL: INPUT ================= */}
      <Card
        className={cn(
          // Grid & Flex Layout
          "h-[350px] flex flex-col overflow-hidden",
          // Visuals
          "bg-card border-border/60 shadow-md",
          // Spacing
          "p-0 gap-2 sm:gap-4",
          // Animation & Interaction
          "transition-all hover:shadow-lg"
        )}
      >
        {/* Toolbar */}
        <div
          className={cn(
            // Layout & Direction
            "flex flex-col sm:flex-row justify-between",
            // Sizing & Spacing
            "min-h-[60px] px-6 py-4 md:py-2 gap-4",
            // Visuals
            "bg-muted/40 border-b border-border/60"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-md text-primary shadow-sm">
              <Type size={16} />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              Input Value
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
            {/* ใช้ Shared Buttons แทนการเขียนปุ่มเอง */}
            <PasteButton onPaste={handleInputChange} />
            <ClearButton
              onClear={() => handleInputChange("")}
              disabled={!input}
            />
          </div>
        </div>

        {/* Input Area */}
        <CardContent className="px-1 py-1 relative min-h-[300px] lg:min-h-0 flex-1">
          <Textarea
            className={cn(
              // Layout & Sizing
              "w-full h-full resize-none",
              // Spacing
              "p-4 pb-12",
              // Typography
              "font-mono text-base md:text-lg leading-relaxed text-foreground/90",
              // Appearance Reset
              "border-0 focus-visible:ring-0 bg-transparent rounded-none shadow-none",
              // Scrollbar & Selection
              "scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent",
              "selection:bg-primary/20",
              // Placeholder
              "placeholder:text-muted-foreground/30"
            )}
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Type number (1234) or Roman (MCCXXXIV)..."
            spellCheck={false}
          />
          {/* Hint Overlay */}
          <div
            className={cn(
              // Positioning
              "absolute bottom-2 right-2",
              // Layout & Spacing
              "flex items-center gap-1 px-1 py-1",
              // Visuals
              "border border-border/20 rounded-xl bg-background/80 backdrop-blur-sm",
              // Typography
              "text-[10px] text-muted-foreground/80",
              // Interaction
              "pointer-events-none select-none"
            )}
          >
            <Info size={12} />
            <span>Auto-detects format</span>
          </div>
        </CardContent>
      </Card>

      {/* ================= RIGHT PANEL: OUTPUT ================= */}
      <Card
        className={cn(
          // Grid & Flex Layout
          "h-[350px] flex flex-col overflow-hidden",
          // Visuals
          "bg-card border-border/60 shadow-md",
          // Spacing
          "p-0 gap-2 sm:gap-4",
          // Animation & Interaction
          "transition-all hover:shadow-lg"
        )}
      >
        {/* Toolbar */}
        <div
          className={cn(
            // Layout & Direction
            "flex flex-col sm:flex-row justify-between",
            // Sizing & Spacing
            "min-h-[60px] px-6 py-4 md:py-2 gap-4",
            // Visuals
            "bg-muted/40 border-b border-border/60"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-md text-primary shadow-sm">
              <ArrowRightLeft size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-muted-foreground">
                Result
              </span>
              {mode !== "Waiting..." && mode !== "Invalid" && (
                <span className="text-[10px] text-muted-foreground/90 font-medium animate-in fade-in slide-in-from-left-1 duration-500">
                  {mode}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <DownloadButton
              text={result}
              filename="roman-conversion"
              extension="txt"
              className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10"
            />
            <CopyButton
              text={result}
              className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10"
            />
          </div>
        </div>

        {/* Result Display */}
        <CardContent
          className={cn(
            // Layout & Positioning (Flexbox และตำแหน่ง)
            "relative flex flex-col items-center flex-1 justify-center text-center",
            // Sizing
            "min-h-[300px] lg:min-h-0",
            // Spacing (ใช้ p-0 เพื่อให้เนื้อหาชนขอบสวยงาม)
            "px-1 py-1",
            // Visuals (สีพื้นหลังจางๆ)
            "bg-muted/10"
          )}
        >
          {result ? (
            <div className="w-full px-8 space-y-4 animate-in zoom-in-95 duration-200">
              <span
                className={cn(
                  // Layout
                  "block",
                  // Typography
                  "font-bold tracking-tight leading-tight break-all",
                  // Animation
                  "transition-colors duration-300",
                  // Conditional Styling based on Error/Success
                  mode === "Invalid" || mode === "Out of Range"
                    ? "text-destructive text-xl md:text-2xl"
                    : "text-foreground text-4xl md:text-7xl"
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
                <div
                  className={cn(
                    // Layout & Alignment
                    "inline-flex items-center gap-2",
                    // Spacing
                    "px-2.5 py-1",
                    // Shape & Background
                    "rounded-full bg-primary/10",
                    // Typography
                    "text-xs font-medium text-primary"
                  )}
                >
                  <Hash size={12} />
                  {mode === "Number → Roman"
                    ? "Roman Numeral"
                    : "Decimal Value"}
                </div>
              )}
            </div>
          ) : (
            // Empty State
            <div
              className={cn(
                // Layout
                "flex flex-col items-center gap-4",
                // Visuals
                "text-muted-foreground/30",
                // UX
                "select-none",
                // Animation
                "animate-in fade-in duration-500"
              )}
            >
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
