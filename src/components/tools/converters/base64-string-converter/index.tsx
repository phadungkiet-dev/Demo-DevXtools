"use client";

import { useState } from "react";
// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
// Icons
import {
  Trash2,
  ClipboardPaste,
  Hash,
  Lock,
  Unlock,
  AlertCircle,
} from "lucide-react";
// Shared Components
import { CopyButton } from "@/components/shared/copy-button";
import { DownloadButton } from "@/components/shared/download-button";
// Utils & Libs
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Base64 } from "js-base64";

/**
 * Type Definition for Converter Mode
 */
type ConversionMode = "encode" | "decode";

export function Base64StringConverter() {
  // --- State Management ---
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<ConversionMode>("encode");
  const [error, setError] = useState<string | null>(null);

  /**
   * Core Logic: Process conversion based on current text and mode.
   * This function is pure logic, separated from state setters for reusability.
   */
  const convertData = (text: string, currentMode: ConversionMode) => {
    // 1. Empty check
    if (!text.trim()) {
      return { result: "", err: null };
    }

    try {
      let result = "";
      if (currentMode === "encode") {
        // Encode: Always succeeds for string inputs
        // Base64.encode handles UTF-8 (emojis/thai) correctly
        result = Base64.encode(text);
      } else {
        // Decode: Must validate format first
        if (!Base64.isValid(text.trim())) {
          return { result: "", err: "Invalid Base64 string" };
        }
        result = Base64.decode(text);
      }
      return { result, err: null };
    } catch {
      return { result: "", err: "Conversion failed" };
    }
  };

  /**
   * Event Handler: When User Types
   * Trigger conversion immediately (Event-Driven)
   */
  const handleInputChange = (value: string) => {
    setInput(value);
    const { result, err } = convertData(value, mode);
    setOutput(result);
    setError(err);
  };

  /**
   * Event Handler: When User Switches Mode
   * Re-calculate output based on existing input and NEW mode
   */
  const handleModeToggle = (checked: boolean) => {
    const newMode = checked ? "decode" : "encode";
    setMode(newMode);

    // Re-run conversion immediately with the new mode
    const { result, err } = convertData(input, newMode);
    setOutput(result);
    setError(err);
  };

  /**
   * Helper: Paste from Clipboard
   */
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      handleInputChange(text); // Process immediately
      toast.success("Pasted from clipboard");
    } catch {
      toast.error("Failed to read clipboard");
    }
  };

  return (
    // Grid Layout: Mobile = Stacked, Desktop = 2 Columns Fixed Height
    <div className="grid gap-6 lg:grid-cols-2 lg:h-[600px] transition-all">
      {/* ================= LEFT PANEL: INPUT ================= */}
      <Card className="flex flex-col h-[350px] lg:h-full overflow-hidden bg-card p-0 border-border/60 shadow-md">
        {/* --- Toolbar --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/30 min-h-[60px] gap-3 shrink-0">
          <div className="flex items-center gap-3">
            {/* Icon indicating Mode */}
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

            {/* Mode Switcher */}
            <div className="flex items-center gap-2 bg-background/50 p-1 rounded-lg border border-border/20">
              <span
                className={cn(
                  "text-[10px] font-bold uppercase px-2 py-0.5 rounded transition-all cursor-pointer select-none",
                  mode === "encode"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => handleModeToggle(false)}
              >
                Encode
              </span>
              <Switch
                checked={mode === "decode"}
                onCheckedChange={handleModeToggle}
                className={cn(
                  "scale-75 data-[state=checked]:bg-orange-500", // Custom color for decode
                  "data-[state=unchecked]:bg-primary"
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-bold uppercase px-2 py-0.5 rounded transition-all cursor-pointer select-none",
                  mode === "decode"
                    ? "bg-orange-500/10 text-orange-500"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => handleModeToggle(true)}
              >
                Decode
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-muted-foreground hover:text-foreground hidden sm:flex"
              onClick={handlePaste}
            >
              <ClipboardPaste className="mr-2 h-3.5 w-3.5" />
              Paste
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 px-0 text-muted-foreground hover:text-destructive"
              onClick={() => handleInputChange("")}
              disabled={!input}
              title="Clear"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* --- Input Area --- */}
        <CardContent className="p-0 flex-1 relative min-h-0">
          <Textarea
            className={cn(
              "w-full h-full resize-none border-0 focus-visible:ring-0 p-6 text-sm md:text-base leading-relaxed font-mono bg-transparent rounded-none shadow-none",
              "scrollbar-thin scrollbar-thumb-muted-foreground/20",
              error ? "text-destructive" : "text-foreground"
            )}
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={
              mode === "encode"
                ? "Type text to encode (e.g. Hello World)..."
                : "Paste Base64 string to decode (e.g. SGVsbG8=)..."
            }
            spellCheck={false}
          />

          {/* Error Badge Overlay */}
          {error && mode === "decode" && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs text-destructive font-medium bg-destructive/10 px-3 py-1.5 rounded-md border border-destructive/20 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2">
              <AlertCircle size={14} />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ================= RIGHT PANEL: OUTPUT ================= */}
      <Card className="flex flex-col h-[350px] lg:h-full overflow-hidden bg-card p-0 border-border/60 shadow-md">
        {/* --- Toolbar --- */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/30 min-h-[60px] shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-md text-primary">
              <Hash size={16} />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              {mode === "encode" ? "Base64 Output" : "Decoded Text"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <DownloadButton
              text={output}
              filename={mode === "encode" ? "encoded.txt" : "decoded.txt"}
              className="h-8 w-8 hover:bg-background hover:text-primary transition-colors"
            />
            <CopyButton
              text={output}
              className="h-8 w-8 hover:bg-background hover:text-primary transition-colors"
            />
          </div>
        </div>

        {/* --- Output Area --- */}
        <CardContent className="p-0 flex-1 relative bg-muted/10 min-h-0">
          <Textarea
            className={cn(
              "w-full h-full resize-none border-0 focus-visible:ring-0 p-6 text-sm md:text-base leading-relaxed font-mono bg-transparent rounded-none shadow-none text-muted-foreground",
              "scrollbar-thin scrollbar-thumb-muted-foreground/20"
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
