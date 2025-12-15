"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRightLeft,
  Trash2,
  Lock,
  Code2,
  AlertCircle,
  ClipboardPaste,
} from "lucide-react";
import { CopyButton } from "@/components/shared/copy-button";
import { DownloadButton } from "@/components/shared/download-button";
import { convertData, DataFormat } from "@/lib/converters";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const formats: DataFormat[] = ["json", "yaml", "xml", "csv"];

interface FormatConverterProps {
  defaultInput: DataFormat;
  defaultOutput: DataFormat;
  fixedInput?: boolean;
}

export function FormatConverter({
  defaultInput,
  defaultOutput,
  fixedInput = false,
}: FormatConverterProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [inputFormat, setInputFormat] = useState<DataFormat>(defaultInput);
  const [outputFormat, setOutputFormat] = useState<DataFormat>(defaultOutput);

  // ❌ ลบ useEffect ก้อนที่มีปัญหาออกไปเลย ไม่ต้องใช้แล้ว
  /* useEffect(() => {
    if (inputFormat === outputFormat) { ... }
  }, [inputFormat, outputFormat]); 
  */

  // ✅ เพิ่ม Function สำหรับจัดการการเปลี่ยน Input Format โดยเฉพาะ
  const handleInputFormatChange = (newFormat: DataFormat) => {
    setInputFormat(newFormat);

    // เช็คทันทีตอนกดเปลี่ยน: ถ้าค่าใหม่ดันไปตรงกับ Output ฝั่งขวา
    if (newFormat === outputFormat) {
      // หาตัวใหม่ให้ทันที
      const nextAvailableFormat = formats.find((f) => f !== newFormat);
      if (nextAvailableFormat) {
        setOutputFormat(nextAvailableFormat);
      }
    }
  };

  // Logic: Auto Conversion (ส่วนนี้เก็บไว้เหมือนเดิมได้ เพราะเป็นการคำนวณผลลัพธ์)
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
      } catch {
        setError("Conversion failed. Check your input syntax.");
        setOutput("");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [input, inputFormat, outputFormat]);

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
    <div className="grid gap-6 lg:grid-cols-2 h-[400px] lg:h-[750px] transition-all">
      {/* ================= LEFT PANEL: INPUT ================= */}
      <Card className="flex flex-col h-full overflow-hidden bg-card p-0 border-border/60 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/30 gap-3 min-h-[60px] shrink-0">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "p-1.5 rounded-md",
                fixedInput
                  ? "bg-muted text-muted-foreground"
                  : "bg-primary/10 text-primary"
              )}
            >
              {fixedInput ? <Lock size={16} /> : <Code2 size={16} />}
            </div>

            <Select
              value={inputFormat}
              // ✅ แก้ตรงนี้: เรียกใช้ Function handleInputFormatChange แทนการ setInputFormat ตรงๆ
              onValueChange={(v) => handleInputFormatChange(v as DataFormat)}
              disabled={fixedInput}
            >
              <SelectTrigger
                className={cn(
                  "h-8 w-[100px] text-xs font-medium",
                  fixedInput
                    ? "opacity-100 cursor-not-allowed bg-muted text-foreground font-bold border-transparent"
                    : "bg-background"
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {formats.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 px-0 text-muted-foreground hover:text-foreground"
              onClick={handlePaste}
              title="Paste"
            >
              <ClipboardPaste className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setInput("")}
              disabled={!input}
              className="h-8 w-8 px-0 text-muted-foreground hover:text-destructive"
              title="Clear"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <CardContent className="p-0 flex-1 relative min-h-0">
          <Textarea
            className={cn(
              "w-full h-full resize-none border-0 focus-visible:ring-0 p-4 text-sm font-mono leading-relaxed bg-transparent rounded-none shadow-none",
              "scrollbar-thin scrollbar-thumb-muted-foreground/20"
            )}
            placeholder={`Paste your ${inputFormat.toUpperCase()} here...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
          />
        </CardContent>
      </Card>

      {/* ================= RIGHT PANEL: OUTPUT ================= */}
      <Card className="flex flex-col h-full overflow-hidden bg-card p-0 border-border/60 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/30 gap-3 min-h-[60px] shrink-0">
          <div className="flex items-center gap-2">
            <ArrowRightLeft size={16} className="text-muted-foreground mx-1" />
            <span className="text-xs font-medium text-muted-foreground mr-1">
              To
            </span>
            <Select
              value={outputFormat}
              onValueChange={(v) => setOutputFormat(v as DataFormat)}
            >
              <SelectTrigger className="h-8 w-[100px] bg-background text-xs font-medium border-primary/30 focus:ring-primary/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {/* ยังคงใช้ logic การ Filter เหมือนเดิม เพื่อซ่อนตัวเลือก */}
                {formats
                  .filter((f) => f !== inputFormat)
                  .map((f) => (
                    <SelectItem key={f} value={f}>
                      {f.toUpperCase()}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

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

        <CardContent className="p-0 flex-1 relative bg-muted/10 min-h-0 flex flex-col">
          {error ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-destructive/80 gap-3 animate-in fade-in">
              <AlertCircle size={48} strokeWidth={1} />
              <div className="text-center space-y-1">
                <p className="font-semibold">Conversion Error</p>
                <p className="text-sm opacity-80 font-mono">{error}</p>
              </div>
            </div>
          ) : (
            <Textarea
              className={cn(
                "w-full h-full resize-none border-0 focus-visible:ring-0 p-4 text-sm font-mono leading-relaxed bg-transparent rounded-none shadow-none text-muted-foreground",
                "scrollbar-thin scrollbar-thumb-muted-foreground/20"
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
