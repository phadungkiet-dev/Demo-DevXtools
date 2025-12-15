"use client";

// =============================================================================
// Imports
// =============================================================================
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
  Languages, // แทน Text ธรรมดา
  Code2, // แทน Code/Unicode
  AlertCircle,
} from "lucide-react";
// Shared Components
import { CopyButton } from "@/components/shared/copy-button";
import { DownloadButton } from "@/components/shared/download-button";
// Utils
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// =============================================================================
// Types & Interfaces
// =============================================================================
type ConversionMode = "text-to-unicode" | "unicode-to-text";

export function TextToUnicodeConverter() {
  // --- State Management ---
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<ConversionMode>("text-to-unicode");
  const [error, setError] = useState<string | null>(null);

  /**
   * 🟢 Core Logic: Conversion Function
   * แยก Logic การคำนวณออกมาเพื่อความสะอาดและเรียกใช้ซ้ำได้ง่าย
   */
  const convertData = (text: string, currentMode: ConversionMode) => {
    // 1. Empty Check
    if (!text) return { result: "", err: null };

    try {
      let result = "";

      if (currentMode === "text-to-unicode") {
        // Case: Text -> Unicode Escape (\uXXXX)
        // ใช้ charCodeAt(0) และแปลงเป็นฐาน 16 พร้อม padding
        result = text
          .split("")
          .map((char) => {
            const code = char.charCodeAt(0).toString(16).toUpperCase();
            return "\\u" + code.padStart(4, "0");
          })
          .join("");
      } else {
        // Case: Unicode Escape -> Text
        // ใช้ Regex จับ pattern \uXXXX แล้วแปลงกลับเป็น char
        result = text.replace(/\\u[\dA-F]{4}/gi, (match) => {
          return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16));
        });

        // Validation Check:
        // ถ้า Input มีคำว่า \u แต่ผลลัพธ์เหมือนเดิม (replace ไม่ได้) แสดงว่า Format ผิด
        // หรือถ้าอยากเข้มงวดกว่านี้อาจจะเช็ค Regex ตั้งแต่ต้น
        if (text.includes("\\u") && result === text && text.length > 0) {
          // อาจจะไม่ใช่ Error ร้ายแรง แต่แจ้งเตือนได้ถ้าต้องการ
          // ในที่นี้เราปล่อยผ่านเพื่อให้ User พิมพ์ผสม Text ธรรมดาได้
        }
      }

      return { result, err: null };
    } catch {
      return { result: "", err: "Invalid format" };
    }
  };

  /**
   * 🎯 Event Handler: User Typing
   * คำนวณผลลัพธ์ทันทีเมื่อมีการเปลี่ยนแปลง (Event-Driven)
   */
  const handleInputChange = (value: string) => {
    setInput(value);
    const { result, err } = convertData(value, mode);
    setOutput(result);
    setError(err);
  };

  /**
   * 🔄 Event Handler: Mode Switching
   * เมื่อสลับโหมด ให้นำ Input เดิมมาคำนวณใหม่ในโหมดใหม่ทันที
   */
  const handleModeToggle = (checked: boolean) => {
    const newMode = checked ? "unicode-to-text" : "text-to-unicode";
    setMode(newMode);

    // Re-calculate with existing input
    const { result, err } = convertData(input, newMode);
    setOutput(result);
    setError(err);
  };

  /**
   * 📋 Helper: Paste Clipboard
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
    // Grid Layout: Mobile Stacked, Desktop Split 50/50 with Fixed Height
    <div className="grid gap-6 lg:grid-cols-2 lg:h-[600px] transition-all">
      {/* ================= LEFT PANEL: INPUT ================= */}
      <Card className="flex flex-col h-[350px] lg:h-full overflow-hidden bg-card p-0 border-border/60 shadow-md">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/30 min-h-[60px] gap-3 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mode Icon Indicator */}
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

            {/* Smart Mode Switcher */}
            <div className="flex items-center gap-2 bg-background/50 p-1 rounded-lg border border-border/20">
              <span
                className={cn(
                  "text-[10px] font-bold uppercase px-2 py-0.5 rounded transition-all cursor-pointer select-none",
                  mode === "text-to-unicode"
                    ? "bg-blue-500/10 text-blue-500 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => handleModeToggle(false)}
              >
                Text
              </span>
              <Switch
                checked={mode === "unicode-to-text"}
                onCheckedChange={handleModeToggle}
                className={cn(
                  "scale-75 data-[state=checked]:bg-purple-500",
                  "data-[state=unchecked]:bg-blue-500"
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-bold uppercase px-2 py-0.5 rounded transition-all cursor-pointer select-none",
                  mode === "unicode-to-text"
                    ? "bg-purple-500/10 text-purple-500 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => handleModeToggle(true)}
              >
                Unicode
              </span>
            </div>
          </div>

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

        {/* Input Area */}
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
              mode === "text-to-unicode"
                ? "Type text here (e.g., Hello ภาษาไทย)..."
                : "Paste Unicode here (e.g., \\u0048\\u0065\\u006C\\u006C\\u006F)..."
            }
            spellCheck={false}
          />
          {error && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs text-destructive font-medium bg-destructive/10 px-3 py-1.5 rounded-md border border-destructive/20 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2">
              <AlertCircle size={14} />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ================= RIGHT PANEL: OUTPUT ================= */}
      <Card className="flex flex-col h-[350px] lg:h-full overflow-hidden bg-card p-0 border-border/60 shadow-md">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/30 min-h-[60px] shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "p-1.5 rounded-md transition-colors",
                mode === "unicode-to-text"
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
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-muted-foreground">
                Result
              </span>
              <span className="text-[10px] text-muted-foreground/60">
                {mode === "text-to-unicode"
                  ? "Escaped Sequence"
                  : "Decoded String"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <DownloadButton
              text={output}
              filename={mode === "text-to-unicode" ? "unicode.txt" : "text.txt"}
              className="h-8 w-8 hover:bg-background hover:text-primary transition-colors"
            />
            <CopyButton
              text={output}
              className="h-8 w-8 hover:bg-background hover:text-primary transition-colors"
            />
          </div>
        </div>

        {/* Output Area */}
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
