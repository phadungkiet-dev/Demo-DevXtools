"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, ClipboardPaste, Languages, Code2, Info } from "lucide-react";
import { CopyButton } from "@/components/shared/copy-button";
import { DownloadButton } from "@/components/shared/download-button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

type Mode = "toUnicode" | "toText";

export function TextToUnicodeConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<Mode>("toUnicode");
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

        if (mode === "toUnicode") {
          // Text -> Unicode Escape (\uXXXX)
          result = input
            .split("")
            .map((char) => {
              const code = char.charCodeAt(0).toString(16).toUpperCase();
              // Padding ให้ครบ 4 หลักเสมอ
              return "\\u" + code.padStart(4, "0");
            })
            .join("");
        } else {
          // Unicode -> Text
          // วิธีที่ปลอดภัยที่สุดคือการใช้ JSON.parse เพื่อ decode string
          // แต่ต้องระวังเรื่อง Double Quote ใน input เราเลยต้อง Escape ให้ดีก่อน
          // หรือใช้ Regex แทนเพื่อความยืดหยุ่นกว่า
          result = input.replace(/\\u[\dA-F]{4}/gi, (match) => {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16));
          });

          // ถ้า Input ไม่มี \u เลย อาจจะถือว่า User พิมพ์ Text ธรรมดา ก็คืนค่าเดิมไป
          if (result === input && input.includes("\\u")) {
            // ถ้ามี \u แต่ replace ไม่ได้ แสดงว่า format ผิด
            throw new Error("Invalid Unicode format");
          }
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-border/40 bg-muted/30 min-h-[60px] gap-4 sm:gap-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-primary/10 rounded-md text-primary">
              {mode === "toUnicode" ? (
                <Languages size={16} />
              ) : (
                <Code2 size={16} />
              )}
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-xs font-medium transition-colors",
                  mode === "toUnicode"
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                Text
              </span>
              <Switch
                checked={mode === "toText"}
                onCheckedChange={(checked) =>
                  setMode(checked ? "toText" : "toUnicode")
                }
                className="data-[state=checked]:bg-primary"
              />
              <span
                className={cn(
                  "text-xs font-medium transition-colors",
                  mode === "toText" ? "text-primary" : "text-muted-foreground"
                )}
              >
                Unicode
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
              mode === "toUnicode"
                ? "Type text to convert (e.g. Hello ภาษาไทย)..."
                : "Paste Unicode escapes (e.g. \\u0048\\u0065)..."
            }
            spellCheck={false}
          />
          {error && (
            <div className="absolute bottom-4 right-4 text-xs text-destructive font-medium bg-destructive/10 px-2 py-1 rounded border border-destructive/20 animate-in fade-in slide-in-from-bottom-2">
              Conversion Error
            </div>
          )}
        </CardContent>
      </Card>

      {/* ================= RIGHT: OUTPUT ================= */}
      <Card className="flex flex-col h-full overflow-hidden bg-card p-0 border-border/60 shadow-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-muted/30 min-h-[60px]">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-primary/10 rounded-md text-primary">
              {mode === "toUnicode" ? (
                <Code2 size={16} />
              ) : (
                <Languages size={16} />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-muted-foreground">
                {mode === "toUnicode" ? "Unicode Output" : "Text Output"}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {mode === "toUnicode" ? "Escaped Sequence" : "Decoded String"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DownloadButton
              text={output}
              filename={mode === "toUnicode" ? "unicode.txt" : "decoded.txt"}
              className="h-9 w-9 hover:bg-background hover:text-primary transition-colors"
            />
            <CopyButton
              text={output}
              className="h-9 w-9 hover:bg-background hover:text-primary transition-colors"
            />
          </div>
        </div>

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
