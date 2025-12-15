"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Trash2,
  ClipboardPaste,
  FileType,
  Code2,
  Eye,
  FileCode,
} from "lucide-react";
import { CopyButton } from "@/components/shared/copy-button";
import { DownloadButton } from "@/components/shared/download-button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

// Libraries
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

type ViewMode = "code" | "preview";

export function MarkdownToHtmlConverter() {
  const [input, setInput] = useState("");
  const [htmlOutput, setHtmlOutput] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("code");

  // Logic: Markdown -> HTML
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!input.trim()) {
        setHtmlOutput("");
        return;
      }

      try {
        // 1. Convert Markdown to HTML using marked
        const rawHtml = await marked.parse(input);

        // 2. Sanitize HTML using DOMPurify (ป้องกัน Script ฝังมา)
        const cleanHtml = DOMPurify.sanitize(rawHtml);

        setHtmlOutput(cleanHtml);
      } catch (err) {
        console.error("Markdown conversion failed", err);
      }
    }, 300); // Debounce

    return () => clearTimeout(timer);
  }, [input]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      toast.success("Pasted from clipboard");
    } catch {
      toast.error("Failed to read clipboard");
    }
  };

  const handleDemo = () => {
    const demo = `# Hello World
This is a **markdown** demo.

## Features
- Convert instantly
- Clean code
- Secure preview

> "Code is poetry."
`;
    setInput(demo);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:h-[600px] transition-all">
      {/* ================= LEFT: MARKDOWN INPUT ================= */}
      <Card className="flex flex-col h-full overflow-hidden bg-card p-0 border-border/60 shadow-md">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-muted/30 min-h-[60px]">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-primary/10 rounded-md text-primary">
              <FileType size={16} />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              Markdown Input
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8 text-primary hover:text-primary hover:bg-primary/10"
              onClick={handleDemo}
            >
              Demo
            </Button>
            <div className="w-px h-4 bg-border mx-1 hidden sm:block" />
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
              "scrollbar-thin scrollbar-thumb-muted-foreground/20"
            )}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="# Type markdown here..."
            spellCheck={false}
          />
        </CardContent>
      </Card>

      {/* ================= RIGHT: HTML OUTPUT ================= */}
      <Card className="flex flex-col h-full overflow-hidden bg-card p-0 border-border/60 shadow-md">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-muted/30 min-h-[60px]">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-primary/10 rounded-md text-primary">
              {viewMode === "code" ? <Code2 size={16} /> : <Eye size={16} />}
            </div>

            {/* View Switcher */}
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-xs font-medium transition-colors",
                  viewMode === "code" ? "text-primary" : "text-muted-foreground"
                )}
              >
                Code
              </span>
              <Switch
                checked={viewMode === "preview"}
                onCheckedChange={(checked) =>
                  setViewMode(checked ? "preview" : "code")
                }
                className="data-[state=checked]:bg-primary"
              />
              <span
                className={cn(
                  "text-xs font-medium transition-colors",
                  viewMode === "preview"
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                Preview
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DownloadButton
              text={htmlOutput}
              filename="converted.html"
              extension="html"
              className="h-9 w-9 hover:bg-background hover:text-primary transition-colors"
            />
            <CopyButton
              text={htmlOutput}
              className="h-9 w-9 hover:bg-background hover:text-primary transition-colors"
            />
          </div>
        </div>

        {/* Output Area */}
        <CardContent className="p-0 flex-1 relative bg-muted/10 overflow-hidden">
          {viewMode === "code" ? (
            // --- CODE VIEW ---
            <Textarea
              className={cn(
                "w-full h-full resize-none border-0 focus-visible:ring-0 p-6 text-sm leading-relaxed font-mono bg-transparent rounded-none shadow-none text-muted-foreground",
                "scrollbar-thin scrollbar-thumb-muted-foreground/20"
              )}
              value={htmlOutput}
              readOnly
              placeholder="HTML output will appear here..."
            />
          ) : (
            // --- PREVIEW VIEW ---
            <div className="w-full h-full overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-muted-foreground/20 bg-background/50">
              {htmlOutput ? (
                <article
                  className="prose prose-sm dark:prose-invert max-w-none break-words"
                  dangerouslySetInnerHTML={{ __html: htmlOutput }}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground/40 gap-3">
                  <FileCode size={48} strokeWidth={1} />
                  <p>Preview area</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
