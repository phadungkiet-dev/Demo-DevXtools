"use client";

import { useState, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ClipboardPaste, Sparkles } from "lucide-react";
import { transformers, caseLabels, CaseType } from "@/lib/transformers";
import { CopyButton } from "@/components/shared/copy-button";
import { DownloadButton } from "@/components/shared/download-button";
import { toast } from "sonner";

export function CaseConverter() {
  const [input, setInput] = useState("");

  // Optimization: คำนวณ Stats เฉพาะเมื่อ input เปลี่ยน
  const stats = useMemo(() => {
    return {
      chars: input.length,
      words: input.trim() ? input.trim().split(/\s+/).length : 0,
      lines: input ? input.split(/\r\n|\r|\n/).length : 0,
    };
  }, [input]);

  // Logic: Paste Handler
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      toast.success("Text pasted from clipboard");
    } catch (err) {
      console.error("Clipboard paste failed:", err);
      toast.error("Failed to read clipboard");
    }
  };

  // Handler: Demo Text
  const handleDemo = () => {
    setInput("Hello World welcome to CodeXKit");
    toast.info("Demo text loaded");
  };

  return (
    <div className="space-y-6">
      {/* --- Input Section --- */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <Label htmlFor="input-text" className="text-base font-semibold">
            Input Text
          </Label>

          <div className="flex flex-wrap items-center gap-2">
            {/* ✅ Demo Button */}
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8 bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary"
              onClick={handleDemo}
            >
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Data Demo
            </Button>

            {/* Paste Button */}
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8 text-muted-foreground hover:text-foreground"
              onClick={handlePaste}
            >
              <ClipboardPaste className="mr-2 h-3.5 w-3.5" />
              Paste
            </Button>

            {/* Clear Button */}
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

        <Textarea
          id="input-text"
          placeholder="Type or paste your text here..."
          className="min-h-[150px] font-mono text-base resize-y shadow-sm focus-visible:ring-primary"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {/* Stats Bar */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground justify-end px-1 select-none">
          <span>{stats.chars} characters</span>
          <span className="w-px h-3 bg-border" />
          <span>{stats.words} words</span>
          <span className="w-px h-3 bg-border" />
          <span>{stats.lines} lines</span>
        </div>
      </div>

      {/* --- Outputs Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Object.keys(transformers) as CaseType[]).map((key) => {
          const result = input ? transformers[key](input) : "";

          return (
            <Card
              key={key}
              className="overflow-hidden group hover:border-primary/50 transition-all duration-200 hover:shadow-sm"
            >
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/50 px-2 py-0.5 rounded-full">
                    {caseLabels[key]}
                  </span>

                  <div className="flex items-center gap-1">
                    {/* ใช้ Shared Component แทน */}
                    <DownloadButton
                      text={result}
                      filename={key} // ชื่อไฟล์จะเป็น snake_case.txt, camelCase.txt ตาม key
                      className="h-7 w-7"
                    />

                    <CopyButton text={result} className="h-7 w-7" />
                  </div>
                </div>

                {/* Output Area */}
                <div className="min-h-[3rem] max-h-[150px] overflow-y-auto p-2.5 bg-muted/30 border border-border/50 rounded-md font-mono text-sm break-all relative scrollbar-thin scrollbar-thumb-muted-foreground/20">
                  {result || (
                    <span className="text-muted-foreground/30 italic select-none text-xs">
                      Waiting for input...
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
