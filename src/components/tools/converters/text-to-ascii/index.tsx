"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Trash2,
  ClipboardPaste,
  Binary,
  ArrowRightLeft,
  FileText,
} from "lucide-react";
import { CopyButton } from "@/components/shared/copy-button";
import { DownloadButton } from "@/components/shared/download-button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

type Mode = "toBinary" | "toText";

export function TextToAsciiConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<Mode>("toBinary");
  const [error, setError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!input.trim()) {
        setOutput("");
        setError(false);
        return;
      }

      try {
        let result = "";

        if (mode === "toBinary") {
          // Text -> Binary
          // แปลงทีละตัวอักษร -> ASCII Code -> ฐาน 2 -> เติม 0 ให้ครบ 8 หลัก
          result = input
            .split("")
            .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
            .join(" "); // คั่นด้วยช่องว่างให้อ่านง่าย
        } else {
          // Binary -> Text
          // ลบช่องว่างออกก่อน (หรือรองรับแบบมีช่องว่าง)
          const binaries = input.trim().split(/\s+/);

          result = binaries
            .map((bin) => {
              // Validate: ต้องเป็น 0 หรือ 1 เท่านั้น
              if (!/^[01]+$/.test(bin)) throw new Error("Invalid Binary");
              return String.fromCharCode(parseInt(bin, 2));
            })
            .join("");
        }

        setOutput(result);
        setError(false);
      } catch (err) {
        setOutput("");
        setError(true);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [input, mode]);

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
    <div className="grid gap-6 lg:grid-cols-2 lg:h-[550px] transition-all">
      {/* ================= LEFT: INPUT ================= */}
      <Card className="flex flex-col h-full overflow-hidden bg-card p-0 border-border/60 shadow-md">
        {/* Toolbar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-border/40 bg-muted/30 min-h-[60px] gap-4 sm:gap-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-primary/10 rounded-md text-primary">
              {mode === "toBinary" ? (
                <FileText size={16} />
              ) : (
                <Binary size={16} />
              )}
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-xs font-medium transition-colors",
                  mode === "toBinary" ? "text-primary" : "text-muted-foreground"
                )}
              >
                Text Input
              </span>
              <Switch
                checked={mode === "toText"}
                onCheckedChange={(checked) =>
                  setMode(checked ? "toText" : "toBinary")
                }
                className="data-[state=checked]:bg-primary"
              />
              <span
                className={cn(
                  "text-xs font-medium transition-colors",
                  mode === "toText" ? "text-primary" : "text-muted-foreground"
                )}
              >
                Binary Input
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8 text-muted-foreground hover:text-foreground hidden sm:flex"
              onClick={handlePaste}
            >
              <ClipboardPaste className="mr-2 h-3.5 w-3.5" />
              Paste
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8 text-muted-foreground hover:text-destructive"
              onClick={() => setInput("")}
              disabled={!input}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Clear
            </Button>
          </div>
        </div>

        {/* Input Textarea */}
        <CardContent className="p-0 flex-1 relative">
          <Textarea
            className={cn(
              "w-full h-full resize-none border-0 focus-visible:ring-0 p-6 text-base leading-relaxed font-mono bg-transparent rounded-none shadow-none",
              "scrollbar-thin scrollbar-thumb-muted-foreground/20",
              error && "text-destructive/80"
            )}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "toBinary"
                ? "Type text to convert..."
                : "Paste binary code (e.g. 01001000 01101001)..."
            }
            spellCheck={false}
          />
          {error && mode === "toText" && (
            <div className="absolute bottom-4 right-4 text-xs text-destructive font-medium bg-destructive/10 px-2 py-1 rounded border border-destructive/20 animate-in fade-in slide-in-from-bottom-2">
              Invalid Binary format (0 or 1 only)
            </div>
          )}
        </CardContent>
      </Card>

      {/* ================= RIGHT: OUTPUT ================= */}
      <Card className="flex flex-col h-full overflow-hidden bg-card p-0 border-border/60 shadow-md">
        {/* Output Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-muted/30 min-h-[60px]">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-primary/10 rounded-md text-primary">
              {mode === "toBinary" ? (
                <Binary size={16} />
              ) : (
                <FileText size={16} />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-muted-foreground">
                {mode === "toBinary" ? "Binary Output" : "Text Output"}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {mode === "toBinary" ? "8-bit ASCII" : "Decoded String"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DownloadButton
              text={output}
              filename={
                mode === "toBinary" ? "binary-output.txt" : "text-output.txt"
              }
              className="h-9 w-9 hover:bg-background hover:text-primary transition-colors"
            />
            <CopyButton
              text={output}
              className="h-9 w-9 hover:bg-background hover:text-primary transition-colors"
            />
          </div>
        </div>

        {/* Output Textarea */}
        <CardContent className="p-0 flex-1 relative bg-muted/10">
          <Textarea
            className={cn(
              "w-full h-full resize-none border-0 focus-visible:ring-0 p-6 text-base leading-relaxed font-mono bg-transparent rounded-none shadow-none text-muted-foreground",
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
