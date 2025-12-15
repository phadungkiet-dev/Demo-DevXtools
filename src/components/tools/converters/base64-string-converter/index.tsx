"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // ใช้ Component กลาง
import {
  Trash2,
  ClipboardPaste,
  Hash,
  ArrowRightLeft,
  FileText,
  Lock,
  Unlock,
} from "lucide-react";
import { CopyButton } from "@/components/shared/copy-button";
import { DownloadButton } from "@/components/shared/download-button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
// Import Library
import { Base64 } from "js-base64";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type Mode = "encode" | "decode";

export function Base64StringConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<Mode>("encode");
  const [error, setError] = useState(false);

  // Logic: Encode/Decode with Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!input.trim()) {
        setOutput("");
        setError(false);
        return;
      }

      try {
        let result = "";
        if (mode === "encode") {
          // Encode: รองรับ Unicode/Emoji สมบูรณ์
          result = Base64.encode(input);
        } else {
          // Decode: เช็ค Format ก่อน
          if (!Base64.isValid(input.trim())) {
            throw new Error("Invalid Base64 string");
          }
          result = Base64.decode(input);
        }
        setOutput(result);
        setError(false);
      } catch (err) {
        setOutput(""); // ล้าง Output เมื่อ Error
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
              {mode === "encode" ? <Lock size={16} /> : <Unlock size={16} />}
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-xs font-medium transition-colors",
                  mode === "encode" ? "text-primary" : "text-muted-foreground"
                )}
              >
                Encode
              </span>
              <Switch
                checked={mode === "decode"}
                onCheckedChange={(checked) =>
                  setMode(checked ? "decode" : "encode")
                }
                className="data-[state=checked]:bg-primary"
              />
              <span
                className={cn(
                  "text-xs font-medium transition-colors",
                  mode === "decode" ? "text-primary" : "text-muted-foreground"
                )}
              >
                Decode
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
              "scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent selection:bg-primary/20",
              error && "text-destructive/80"
            )}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "encode"
                ? "Type text to encode..."
                : "Paste Base64 string to decode..."
            }
            spellCheck={false}
          />
          {error && mode === "decode" && (
            <div className="absolute bottom-4 right-4 text-xs text-destructive font-medium bg-destructive/10 px-2 py-1 rounded border border-destructive/20 animate-in fade-in slide-in-from-bottom-2">
              Invalid Base64 format
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
              <Hash size={16} />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              {mode === "encode" ? "Base64 Output" : "Decoded Text"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <DownloadButton
              text={output}
              filename={mode === "encode" ? "encoded.txt" : "decoded.txt"}
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
              "scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent"
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
