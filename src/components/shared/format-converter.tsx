"use client";

// =============================================================================
// Imports
// =============================================================================
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
// ✅ Import DataFormat มาใช้เพื่อ Type Safety
import { convertData, type DataFormat } from "@/lib/converters";
import { cn } from "@/lib/utils";

// =============================================================================
// Constants & Types
// =============================================================================
// ✅ ตัด typescript ออก เหลือแค่ 4 format
const SUPPORTED_FORMATS: DataFormat[] = ["json", "yaml", "xml", "csv"];

interface FormatConverterProps {
  defaultInput: DataFormat;
  defaultOutput: DataFormat;
  fixedInput?: boolean;
}

// =============================================================================
// Main Component
// =============================================================================
export function FormatConverter({
  defaultInput,
  defaultOutput,
  fixedInput = false,
}: FormatConverterProps) {
  // --- State ---
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // ✅ Generic Type Enforcement
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

  // --- Render ---
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:h-[600px] gap-4 transition-all duration-300">
      {/* LEFT CARD (INPUT) */}
      <Card className="flex-1 flex flex-col overflow-hidden bg-card p-0 border-border/60 shadow-md hover:shadow-lg transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/30 gap-3 min-h-[60px] shrink-0">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "p-1.5 rounded-md shadow-sm transition-colors",
                fixedInput
                  ? "bg-muted text-muted-foreground"
                  : "bg-primary/10 text-primary"
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
                  "h-8 w-[100px] text-xs font-medium border-border/60 shadow-sm",
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

          <div className="flex items-center gap-1 self-end sm:self-auto">
            <PasteButton onPaste={setInput} />
            <ClearButton onClear={() => setInput("")} disabled={!input} />
          </div>
        </div>

        <CardContent className="p-0 flex-1 relative min-h-[200px] group">
          <Textarea
            className={cn(
              "w-full h-full resize-none border-0 focus-visible:ring-0 p-4 text-sm font-mono leading-relaxed bg-transparent rounded-none shadow-none text-foreground/90",
              "scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent",
              "placeholder:text-muted-foreground/40"
            )}
            placeholder={`Paste your ${inputFormat.toUpperCase()} here...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
          />
        </CardContent>
      </Card>

      {/* MIDDLE (SWAP) */}
      <div className="flex items-center justify-center shrink-0 -my-2 lg:my-0 relative z-10">
        {fixedInput ? (
          <div className="bg-muted text-muted-foreground p-2 rounded-full border border-border/50 shadow-sm rotate-90 lg:rotate-0">
            <ArrowRight size={16} />
          </div>
        ) : (
          <SwapButton
            onSwap={handleSwap}
            className="h-10 w-10 border shadow-md bg-background hover:bg-muted text-primary hover:text-primary transition-transform hover:scale-105 active:scale-95"
          />
        )}
      </div>

      {/* RIGHT CARD (OUTPUT) */}
      <Card className="flex-1 flex flex-col overflow-hidden bg-card p-0 border-border/60 shadow-md hover:shadow-lg transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/30 gap-3 min-h-[60px] shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold text-muted-foreground/70 uppercase tracking-widest mr-1">
              To
            </span>
            <Select
              value={outputFormat}
              onValueChange={(v) => setOutputFormat(v as DataFormat)}
            >
              <SelectTrigger className="h-8 w-[100px] bg-background text-xs font-medium border-primary/30 focus:ring-primary/20 shadow-sm">
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

          <div className="flex items-center gap-1 self-end sm:self-auto">
            <DownloadButton
              text={output}
              filename={`converted.${outputFormat}`}
              extension={outputFormat}
              disabled={!output || !!error}
              className="h-8 w-8"
            />
            <CopyButton
              text={output}
              disabled={!output || !!error}
              className="h-8 w-8"
            />
          </div>
        </div>

        <CardContent className="p-0 flex-1 relative bg-muted/10 min-h-[200px] flex flex-col">
          {error ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-destructive/80 gap-3 animate-in fade-in zoom-in-95 duration-300">
              <div className="p-3 bg-destructive/10 rounded-full ring-1 ring-destructive/20">
                <AlertCircle size={32} strokeWidth={1.5} />
              </div>
              <div className="text-center space-y-1">
                <p className="font-semibold text-sm">Conversion Failed</p>
                <p className="text-xs opacity-80 font-mono max-w-[280px] break-words bg-background/50 px-3 py-1.5 rounded border border-destructive/20">
                  {error}
                </p>
              </div>
            </div>
          ) : !output ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground/40 gap-3">
              <FileJson size={48} strokeWidth={1} className="opacity-20" />
              <p className="text-sm font-medium">Result will appear here...</p>
            </div>
          ) : (
            <Textarea
              className={cn(
                "w-full h-full resize-none border-0 focus-visible:ring-0 p-4 text-sm font-mono leading-relaxed bg-transparent rounded-none shadow-none",
                "text-muted-foreground focus:text-foreground transition-colors",
                "scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent"
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
