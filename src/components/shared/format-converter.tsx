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
import { ArrowRightLeft, Copy, Trash2, FileText } from "lucide-react";
import { CopyButton } from "@/components/shared/copy-button";
import { DownloadButton } from "@/components/shared/download-button";
import { convertData, DataFormat } from "@/lib/converters";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FormatConverterProps {
  defaultInput: DataFormat;
  defaultOutput: DataFormat;
}

export function FormatConverter({
  defaultInput,
  defaultOutput,
}: FormatConverterProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const [inputFormat, setInputFormat] = useState<DataFormat>(defaultInput);
  const [outputFormat, setOutputFormat] = useState<DataFormat>(defaultOutput);

  // Auto Convert when input or formats change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!input.trim()) {
        setOutput("");
      } else {
        const result = convertData(input, inputFormat, outputFormat);
        setOutput(result);
      }
    }, 500); // Debounce 500ms

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
    <div className="grid gap-6 lg:grid-cols-2 lg:h-[600px] transition-all">
      {/* === LEFT: INPUT === */}
      <Card className="flex flex-col h-full overflow-hidden bg-card p-0 border-border/60 shadow-md">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/30 gap-3 min-h-[60px]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-md text-primary">
              <FileText size={16} />
            </div>
            <Select
              value={inputFormat}
              onValueChange={(v) => setInputFormat(v as DataFormat)}
            >
              <SelectTrigger className="h-8 w-[100px] bg-background text-xs font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="yaml">YAML</SelectItem>
                <SelectItem value="xml">XML</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePaste}
              className="text-xs h-8"
            >
              Paste
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setInput("")}
              disabled={!input}
              className="text-xs h-8 hover:text-destructive"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Input Area */}
        <CardContent className="p-0 flex-1 relative">
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

      {/* === RIGHT: OUTPUT === */}
      <Card className="flex flex-col h-full overflow-hidden bg-card p-0 border-border/60 shadow-md">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/30 gap-3 min-h-[60px]">
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
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="yaml">YAML</SelectItem>
                <SelectItem value="xml">XML</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1">
            <DownloadButton
              text={output}
              filename={`converted.${outputFormat}`}
              extension={outputFormat}
              className="h-8 w-8"
            />
            <CopyButton text={output} className="h-8 w-8" />
          </div>
        </div>

        {/* Output Area */}
        <CardContent className="p-0 flex-1 relative bg-muted/10">
          <Textarea
            className={cn(
              "w-full h-full resize-none border-0 focus-visible:ring-0 p-4 text-sm font-mono leading-relaxed bg-transparent rounded-none shadow-none text-muted-foreground",
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
