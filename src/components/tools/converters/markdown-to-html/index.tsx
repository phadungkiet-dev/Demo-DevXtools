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
  FileType,
  Code2,
  Eye,
  FileCode,
  Sparkles, // Icon for Demo
} from "lucide-react";
// Shared Components
import { CopyButton } from "@/components/shared/copy-button";
import { DownloadButton } from "@/components/shared/download-button";
// Utils & Libs
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

// =============================================================================
// Configuration
// =============================================================================
// ตั้งค่า marked ให้รองรับการขึ้นบรรทัดใหม่แบบ GitHub (gfm)
marked.use({
  breaks: true, // Enter = <br>
  gfm: true, // GitHub Flavored Markdown
});

type ViewMode = "code" | "preview";

export function MarkdownToHtmlConverter() {
  // --- State Management ---
  const [input, setInput] = useState("");
  const [htmlOutput, setHtmlOutput] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("code");
  const [isConverting, setIsConverting] = useState(false);

  /**
   * 🟢 Core Logic: Conversion Function
   * ฟังก์ชันแปลง Markdown -> HTML โดยแยกออกมาเพื่อเรียกใช้ซ้ำได้
   */
  const processConversion = async (markdown: string) => {
    if (!markdown.trim()) {
      setHtmlOutput("");
      return;
    }

    setIsConverting(true);
    try {
      // 1. Parse Markdown to HTML
      // marked.parse อาจคืนค่าเป็น Promise ในบาง version/config
      const rawHtml = await marked.parse(markdown);

      // 2. Sanitize HTML (Critical for Security)
      // ป้องกันการฝัง Script อันตราย (XSS)
      const cleanHtml = DOMPurify.sanitize(rawHtml);

      setHtmlOutput(cleanHtml);
    } catch (error) {
      console.error("Conversion failed:", error);
      toast.error("Error converting markdown");
    } finally {
      setIsConverting(false);
    }
  };

  /**
   * 🎯 Event Handler: User Typing
   * เรียกใช้ Logic การแปลงทันที (Event-Driven)
   */
  const handleInputChange = (value: string) => {
    setInput(value);
    processConversion(value);
  };

  /**
   * 📋 Helper: Paste from Clipboard
   */
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      handleInputChange(text); // Update & Convert immediately
      toast.success("Pasted from clipboard");
    } catch {
      toast.error("Failed to read clipboard");
    }
  };

  /**
   * 🚀 Helper: Load Demo Content
   */
  const handleDemo = () => {
    const demo = `# Hello World 👋
This is a **markdown** demo using *Next.js 16*.

## Features
- ✅ **Instant Conversion**
- 🛡️ **Secure** (DOMPurify)
- 🎨 **Beautiful Preview**

> "Code is poetry, written for machines to execute and humans to understand."

\`\`\`javascript
console.log("Hello Developer!");
\`\`\`
`;
    handleInputChange(demo);
  };

  return (
    // Grid Layout: Mobile Stacked, Desktop Split 50/50 Fixed Height
    <div className="grid gap-6 lg:grid-cols-2 lg:h-[600px] transition-all">
      {/* ================= LEFT PANEL: MARKDOWN INPUT ================= */}
      <Card className="flex flex-col h-[350px] lg:h-full overflow-hidden bg-card p-0 border-border/60 shadow-md">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/30 min-h-[60px] gap-3 shrink-0">
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
              title="Load Demo Text"
            >
              <Sparkles className="mr-2 h-3.5 w-3.5" />
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
              onClick={() => handleInputChange("")}
              disabled={!input}
              title="Clear"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Input Textarea */}
        <CardContent className="p-0 flex-1 relative min-h-0">
          <Textarea
            className={cn(
              "w-full h-full resize-none border-0 focus-visible:ring-0 p-6 text-sm md:text-base leading-relaxed font-mono bg-transparent rounded-none shadow-none",
              "scrollbar-thin scrollbar-thumb-muted-foreground/20 placeholder:text-muted-foreground/30"
            )}
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="# Type markdown here..."
            spellCheck={false}
          />
        </CardContent>
      </Card>

      {/* ================= RIGHT PANEL: HTML OUTPUT ================= */}
      <Card className="flex flex-col h-[350px] lg:h-full overflow-hidden bg-card p-0 border-border/60 shadow-md">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/30 min-h-[60px] gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "p-1.5 rounded-md transition-colors",
                viewMode === "code"
                  ? "bg-primary/10 text-primary"
                  : "bg-purple-500/10 text-purple-500"
              )}
            >
              {viewMode === "code" ? <Code2 size={16} /> : <Eye size={16} />}
            </div>

            {/* View Switcher */}
            <div className="flex items-center gap-2 bg-background/50 p-1 rounded-lg border border-border/20">
              <span
                className={cn(
                  "text-[10px] font-bold uppercase px-2 py-0.5 rounded transition-all cursor-pointer select-none",
                  viewMode === "code"
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setViewMode("code")}
              >
                Code
              </span>
              <Switch
                checked={viewMode === "preview"}
                onCheckedChange={(checked) =>
                  setViewMode(checked ? "preview" : "code")
                }
                className={cn(
                  "scale-75",
                  "data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-primary"
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-bold uppercase px-2 py-0.5 rounded transition-all cursor-pointer select-none",
                  viewMode === "preview"
                    ? "bg-purple-500/10 text-purple-500 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setViewMode("preview")}
              >
                Preview
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <DownloadButton
              text={htmlOutput}
              filename="converted.html"
              extension="html"
              className="h-8 w-8 hover:bg-background hover:text-primary transition-colors"
            />
            <CopyButton
              text={htmlOutput}
              className="h-8 w-8 hover:bg-background hover:text-primary transition-colors"
            />
          </div>
        </div>

        {/* Output Content */}
        <CardContent className="p-0 flex-1 relative bg-muted/10 overflow-hidden min-h-0">
          {viewMode === "code" ? (
            // --- VIEW: RAW CODE ---
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
            // --- VIEW: PREVIEW (Rendered HTML) ---
            <div className="w-full h-full overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-muted-foreground/20 bg-background/50">
              {htmlOutput ? (
                // ใช้ tailwind typography plugin (prose) เพื่อจัด Styles ให้ HTML อัตโนมัติ
                <article
                  className="prose prose-sm dark:prose-invert max-w-none break-words"
                  dangerouslySetInnerHTML={{ __html: htmlOutput }}
                />
              ) : (
                // Empty State
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground/40 gap-3 select-none">
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
