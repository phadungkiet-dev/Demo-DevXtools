"use client";

// Imports ================
import { useState, useEffect } from "react";

// UI Components
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Icons
import { ArrowRight, Lock, Code2, AlertCircle, FileJson } from "lucide-react";

// Shared Components
import {
  CopyButton,
  DownloadButton,
  PasteButton,
  ClearButton,
  SwapButton,
} from "@/components/shared/buttons";

// Logic & Utils
// Import DataFormat
import { convertData, type DataFormat } from "@/lib/converters";
import { cn } from "@/lib/utils";

// Constants & Types ===============
const SUPPORTED_FORMATS: DataFormat[] = ["json", "yaml", "xml", "csv"];

interface FormatConverterProps {
  defaultInput: DataFormat;
  defaultOutput: DataFormat;
  fixedInput?: boolean;
}

// Main Component ================
export function FormatConverter({
  defaultInput,
  defaultOutput,
  fixedInput = false,
}: FormatConverterProps) {
  // --- State ---
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Generic Type Enforcement
  const [inputFormat, setInputFormat] = useState<DataFormat>(defaultInput);
  const [outputFormat, setOutputFormat] = useState<DataFormat>(defaultOutput);

  // --- Handlers ---
  const handleInputFormatChange = (newFormat: DataFormat) => {
    setInputFormat(newFormat);
    if (newFormat === outputFormat) {
      const nextAvailable = SUPPORTED_FORMATS.find((f) => f !== newFormat);
      if (nextAvailable) setOutputFormat(nextAvailable);
    }
  };

  const handleSwap = () => {
    if (fixedInput) return;
    setInputFormat(outputFormat);
    setOutputFormat(inputFormat);
    setInput(output);
  };

  // --- Effect: Auto Convert ---
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!input.trim()) {
        setOutput("");
        setError(null);
        return;
      }

      try {
        const result = convertData(input, inputFormat, outputFormat);

        if (result.startsWith("Error")) {
          setError(result);
          setOutput("");
        } else {
          setOutput(result);
          setError(null);
        }
      } catch (err) {
        console.error(err);
        setError("Conversion failed.");
        setOutput("");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [input, inputFormat, outputFormat]);

  // Render
  return (
    <div
      className={cn(
        // Layout
        "flex flex-col lg:flex-row items-stretch lg:h-[550px] gap-6",
        // // Animation Core
        "animate-in fade-in slide-in-from-bottom-4",
        // Animation Timing
        "duration-600 ease-out",
        // Animation Staging
        "delay-200 fill-mode-backwards"
      )}
    >
      {/* LEFT CARD (INPUT) */}
      <Card
        className={cn(
          // Flex Layout
          "flex-1 flex flex-col overflow-hidden",
          // Visuals
          "bg-card border-border/60 shadow-md",
          // Spacing
          "p-0 gap-2 sm:gap-4",
          // Animation & Interaction
          "transition-all hover:shadow-lg"
        )}
      >
        <div
          className={cn(
            // Layout & Direction
            "flex flex-col sm:flex-row justify-between items-center",
            // Sizing & Spacing
            "min-h-[60px] px-6 py-4 md:py-2 gap-4",
            // Visuals
            "bg-muted/40 border-b border-border/60"
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "p-2 rounded-md shadow-sm transition-colors",
                fixedInput
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {fixedInput ? <Lock size={16} /> : <Code2 size={16} />}
            </div>

            <Select
              value={inputFormat}
              onValueChange={(v) => handleInputFormatChange(v as DataFormat)}
              disabled={fixedInput}
            >
              <SelectTrigger
                className={cn(
                  "w-full h-10 border-border/60 focus:ring-primary/20",
                  fixedInput ? "cursor-not-allowed bg-muted" : "bg-background"
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_FORMATS.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <PasteButton onPaste={setInput} />
            <ClearButton onClear={() => setInput("")} disabled={!input} />
          </div>
        </div>

        {/* px-1 py-1 relative min-h-[300px] lg:min-h-0 flex-1 */}
        {/* p-0 flex-1 relative min-h-[200px] group */}
        <CardContent className="p-1 relative min-h-[200px] group">
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
            placeholder={`Paste your ${inputFormat.toUpperCase()} here...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
          />
        </CardContent>
      </Card>

      {/* MIDDLE (SWAP) */}
      {/* flex items-center justify-center shrink-0 -my-2 lg:my-0 relative z-10 */}
      <div className="flex items-center justify-center shrink-0">
        {fixedInput ? (
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center ",
              "border border-border/50 shadow-sm",
              "bg-muted rounded-full text-muted-foreground",
              "rotate-90 lg:rotate-0"
            )}
          >
            <ArrowRight size={14} />
          </div>
        ) : (
          <SwapButton
            onSwap={handleSwap}
            className="h-10 w-10 border shadow-md bg-background hover:bg-muted text-primary"
          />
        )}
      </div>

      {/* RIGHT CARD (OUTPUT) */}
      <Card
        className={cn(
          // Flex Layout
          "flex-1 flex flex-col overflow-hidden",
          // Visuals
          "bg-card border-border/60 shadow-md",
          // Spacing
          "p-0 gap-2 sm:gap-4",
          // Animation & Interaction
          "transition-all hover:shadow-lg"
        )}
      >
        <div
          className={cn(
            // Layout & Direction
            "flex flex-col sm:flex-row justify-between items-center",
            // Sizing & Spacing
            "min-h-[60px] px-6 py-4 md:py-2 gap-4",
            // Visuals
            "bg-muted/40 border-b border-border/60"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-14 flex items-center justify-center bg-primary/10 rounded-md text-primary shadow-sm">
              <span className="text-[10px] font-bold uppercase">To</span>
            </div>

            <Select
              value={outputFormat}
              onValueChange={(v) => setOutputFormat(v as DataFormat)}
            >
              <SelectTrigger className="w-full h-10 bg-background/50 border-primary/10 focus:ring-primary/20 ">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_FORMATS.filter((f) => f !== inputFormat).map((f) => (
                  <SelectItem key={f} value={f}>
                    {f.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <DownloadButton
              text={output}
              filename={`converted.${outputFormat}`}
              extension={outputFormat}
              disabled={!output || !!error}
              className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10"
            />
            <CopyButton
              text={output}
              disabled={!output || !!error}
              className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10"
            />
          </div>
        </div>

        <CardContent className="p-1 flex-1 flex flex-col relative min-h-[200px]">
          {error ? (
            <div
              className={cn(
                // Layout & Positioning
                "flex flex-1 flex-col items-center justify-center",
                // Spacing
                "p-6 gap-3",
                // Typography & Color
                "text-destructive/80",
                // Animation
                "animate-in fade-in zoom-in-95 duration-300"
              )}
            >
              <div className="p-3 bg-destructive/10 rounded-full ring-1 ring-destructive/20">
                <AlertCircle size={32} strokeWidth={2} />
              </div>
              <div className="text-center space-y-1">
                <p className="font-semibold text-sm">Conversion Failed</p>
                <p
                  className={cn(
                    // Layout & Sizing
                    "max-w-[280px]",
                    // Spacing
                    "px-3 py-2",
                    // Typography
                    "font-mono text-xs break-words opacity-80",
                    // Visuals
                    "bg-background/50 rounded border border-destructive/20"
                  )}
                >
                  {error}
                </p>
              </div>
            </div>
          ) : !output ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground/60 gap-3">
              <FileJson size={48} strokeWidth={1} className="opacity-40" />
              <p className="text-sm font-medium">Result will appear here...</p>
            </div>
          ) : (
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
              value={output}
              readOnly
              placeholder="Result will appear here..."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
