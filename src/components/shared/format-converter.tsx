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
import { ArrowRightLeft, Lock, Code2, AlertCircle } from "lucide-react";

// Shared Components (ใช้ของที่เราทำไว้แล้วเพื่อความ Clean)
import { CopyButton } from "@/components/shared/buttons/copy-button";
import { DownloadButton } from "@/components/shared/buttons/download-button";
import { PasteButton } from "@/components/shared/buttons/paste-button"; // ✅ New
import { ClearButton } from "@/components/shared/buttons/clear-button"; // ✅ New

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
  /** ล็อคไม่ให้เปลี่ยน Format Input หรือไม่ */
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

  /**
   * 🔄 จัดการการเปลี่ยน Input Format
   * Logic: ถ้าเลือก Input Format ตรงกับ Output ให้สลับ Output หนีทันที
   */
  const handleInputFormatChange = (newFormat: DataFormat) => {
    setInputFormat(newFormat);

    if (newFormat === outputFormat) {
      // ค้นหา Format ตัวถัดไปที่ไม่ใช่ตัวเดิม
      const nextAvailableFormat = SUPPORTED_FORMATS.find(
        (f) => f !== newFormat
      );
      if (nextAvailableFormat) {
        setOutputFormat(nextAvailableFormat);
      }
    }
  };

  /**
   * ⚡ Effect: Auto Conversion
   * ทำงานเมื่อ input หรือ format เปลี่ยนแปลง (มี Delay 500ms เพื่อ Performance)
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      // 1. ถ้าไม่มี Input ให้เคลียร์ค่า
      if (!input.trim()) {
        setOutput("");
        setError(null);
        return;
      }

      // 2. พยายามแปลงข้อมูล
      try {
        const result = convertData(input, inputFormat, outputFormat);

        // ตรวจสอบว่า Function convertData ส่ง Error String กลับมาหรือไม่
        if (result.startsWith("Error")) {
          setError(result);
          setOutput("");
        } else {
          setOutput(result);
          setError(null);
        }
      } catch (err) {
        // Fallback Error Handling
        console.error("Conversion Logic Error:", err);
        setError("Conversion failed. Check your input syntax.");
        setOutput("");
      }
    }, 500); // Debounce delay

    return () => clearTimeout(timer); // Cleanup timer เดิมถ้ามีการพิมพ์ใหม่ก่อนครบเวลา
  }, [input, inputFormat, outputFormat]);

  // --- Render ---
  return (
    <div className="grid gap-6 lg:grid-cols-2 h-[500px] lg:h-[750px] transition-all duration-300">
      {/* ================= LEFT PANEL: INPUT ================= */}
      <Card className="flex flex-col h-full overflow-hidden bg-card p-0 border-border/60 shadow-md hover:shadow-lg transition-shadow">
        {/* Toolbar Header */}
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

          {/* Actions: Paste & Clear */}
          <div className="flex items-center gap-1">
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

      {/* ================= RIGHT PANEL: OUTPUT ================= */}
      <Card className="flex flex-col h-full overflow-hidden bg-card p-0 border-border/60 shadow-md hover:shadow-lg transition-shadow">
        {/* Toolbar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/30 gap-3 min-h-[60px] shrink-0">
          {/* Format Selector */}
          <div className="flex items-center gap-2">
            <ArrowRightLeft size={16} className="text-muted-foreground mx-1" />
            <span className="text-xs font-medium text-muted-foreground mr-1">
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
                {/* Filter out current input format */}
                {SUPPORTED_FORMATS.filter((f) => f !== inputFormat).map((f) => (
                  <SelectItem key={f} value={f}>
                    {f.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actions: Download & Copy */}
          <div className="flex items-center gap-1">
            <DownloadButton
              text={output}
              filename={`converted.${outputFormat}`}
              extension={outputFormat}
              className="h-8 w-8 hover:bg-background hover:text-primary transition-colors"
            />
            <CopyButton
              text={output}
              className="h-8 w-8 hover:bg-background hover:text-primary transition-colors"
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
