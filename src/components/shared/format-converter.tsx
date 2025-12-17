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
import { ArrowRight, Lock, Code2, AlertCircle } from "lucide-react";

// Shared Components
import {
  CopyButton,
  DownloadButton,
  PasteButton,
  ClearButton,
  SwapButton,
} from "@/components/shared/buttons";

// Logic & Utils
import { convertData, DataFormat } from "@/lib/converters";
import { cn } from "@/lib/utils";

// =============================================================================
// Constants & Types
// =============================================================================
const SUPPORTED_FORMATS: DataFormat[] = ["json", "yaml", "xml", "csv"];

interface FormatConverterProps {
  /** Format เริ่มต้นของ Input */
  defaultInput: DataFormat;
  /** Format เริ่มต้นของ Output */
  defaultOutput: DataFormat;
  /** ล็อคไม่ให้เปลี่ยน Format Input หรือไม่ (ถ้าล็อค จะซ่อนปุ่ม Swap) */
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
  // --- State Management ---
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [inputFormat, setInputFormat] = useState<DataFormat>(defaultInput);
  const [outputFormat, setOutputFormat] = useState<DataFormat>(defaultOutput);

  // --- Handlers ---

  const handleInputFormatChange = (newFormat: DataFormat) => {
    setInputFormat(newFormat);
    if (newFormat === outputFormat) {
      const nextAvailableFormat = SUPPORTED_FORMATS.find(
        (f) => f !== newFormat
      );
      if (nextAvailableFormat) setOutputFormat(nextAvailableFormat);
    }
  };

  /**
   * 🔀 Swap Logic
   * สลับทั้ง Format และ Content (เอา Output กลับไปเป็น Input)
   */
  const handleSwap = () => {
    if (fixedInput) return; // ป้องกันการ Swap ถ้าถูกล็อค

    setInputFormat(outputFormat);
    setOutputFormat(inputFormat);
    setInput(output); // ย้ายผลลัพธ์ไปเป็น Input
    // Output จะถูกคำนวณใหม่โดย useEffect
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
        const result = convertData(input, inputFormat, outputFormat);
        if (result.startsWith("Error")) {
          setError(result);
          setOutput("");
        } else {
          setOutput(result);
          setError(null);
        }
      } catch (err) {
        console.error("Conversion Logic Error:", err);
        setError("Conversion failed. Check your input syntax.");
        setOutput("");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [input, inputFormat, outputFormat]);

  // --- Render ---
  return (
    // ✅ Layout: Flex Column (Mobile) -> Flex Row (Desktop)
    <div className="flex flex-col lg:flex-row items-stretch lg:h-[750px] gap-4 transition-all duration-300">
      {/* ================= 1. LEFT CARD (INPUT) ================= */}
      <Card className="flex-1 flex flex-col overflow-hidden bg-card p-0 border-border/60 shadow-md hover:shadow-lg transition-shadow">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/30 gap-3 min-h-[60px] shrink-0">
          {/* Format Selector */}
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
                  "h-8 w-[100px] text-xs font-medium border-border/60",
                  fixedInput
                    ? "opacity-100 cursor-not-allowed bg-muted text-foreground font-bold border-transparent shadow-none"
                    : "bg-background"
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

          {/* Actions */}
          <div className="flex items-center gap-1 self-end sm:self-auto">
            <PasteButton onPaste={setInput} />
            <ClearButton onClear={() => setInput("")} disabled={!input} />
          </div>
        </div>

        {/* Editor Area */}
        <CardContent className="p-0 flex-1 relative min-h-0 group">
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

      {/* ================= 2. MIDDLE (SWAP BUTTON / ARROW) ================= */}
      <div className="flex items-center justify-center shrink-0 -my-2 lg:my-0">
        {fixedInput ? (
          // ถ้า Fixed Input: แสดงแค่ลูกศรธรรมดา
          <div className="bg-muted text-muted-foreground p-2 rounded-full border border-border/50 rotate-90 lg:rotate-0">
            <ArrowRight size={16} />
          </div>
        ) : (
          // ถ้าไม่ Fixed: แสดงปุ่ม Swap
          <SwapButton
            onSwap={handleSwap}
            className="h-10 w-10 border shadow-md bg-background hover:bg-muted text-primary"
          />
        )}
      </div>

      {/* ================= 3. RIGHT CARD (OUTPUT) ================= */}
      <Card className="flex-1 flex flex-col overflow-hidden bg-card p-0 border-border/60 shadow-md hover:shadow-lg transition-shadow">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/30 gap-3 min-h-[60px] shrink-0">
          {/* Format Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground uppercase mr-1">
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

          {/* Actions */}
          <div className="flex items-center gap-1 self-end sm:self-auto">
            <DownloadButton
              text={output}
              filename={`converted.${outputFormat}`}
              extension={outputFormat}
              className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
            />
            <CopyButton
              text={output}
              className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
            />
          </div>
        </div>

        {/* Result Area */}
        <CardContent className="p-0 flex-1 relative bg-muted/10 min-h-0 flex flex-col">
          {error ? (
            // Error State
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-destructive/80 gap-3 animate-in fade-in zoom-in-95 duration-300">
              <div className="p-3 bg-destructive/10 rounded-full">
                <AlertCircle size={32} strokeWidth={1.5} />
              </div>
              <div className="text-center space-y-1">
                <p className="font-semibold">Conversion Error</p>
                <p className="text-xs opacity-80 font-mono max-w-[250px] break-words bg-background/50 px-2 py-1 rounded border border-destructive/20">
                  {error}
                </p>
              </div>
            </div>
          ) : (
            // Success State
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
