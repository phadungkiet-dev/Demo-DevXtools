"use client";

// =============================================================================
// Imports
// =============================================================================
import { useState, useEffect } from "react";

// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Icons
import {
  FileType,
  Code2,
  Eye,
  FileCode,
  Sparkles,
  HelpCircle, // Icon for Help/Cheatsheet
} from "lucide-react";

// Shared Components
import {
  CopyButton,
  DownloadButton,
  PasteButton,
  ClearButton,
} from "@/components/shared/buttons";

// Utils & Libs
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

// =============================================================================
// Configuration
// =============================================================================
marked.use({
  breaks: true,
  gfm: true,
});

type ViewMode = "code" | "preview";

// =============================================================================
// Main Component
// =============================================================================
export function MarkdownToHtmlConverter() {
  // --- State Management ---
  const [input, setInput] = useState("");
  const [htmlOutput, setHtmlOutput] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("code");

  // --- Logic & Effects ---

  /**
   * ⚡ Effect: Auto Conversion
   */
  useEffect(() => {
    const convert = async () => {
      if (!input.trim()) {
        setHtmlOutput("");
        return;
      }

      try {
        const rawHtml = await marked.parse(input);
        const cleanHtml = DOMPurify.sanitize(rawHtml);
        setHtmlOutput(cleanHtml);
      } catch (error) {
        console.error("Conversion failed:", error);
        toast.error("Error converting markdown");
      }
    };

    const timer = setTimeout(convert, 300); // Debounce
    return () => clearTimeout(timer);
  }, [input]);

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
    setInput(demo);
  };

  return (
    // Grid Layout
    <div className="grid gap-6 lg:grid-cols-2 lg:h-[600px] transition-all animate-in fade-in duration-500">
      {/* ================= LEFT PANEL: MARKDOWN INPUT ================= */}
      <Card className="flex flex-col h-full overflow-hidden bg-card p-0 border-border/60 shadow-md hover:shadow-lg transition-shadow">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/30 min-h-[60px] gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-primary/10 rounded-md text-primary">
              <FileType size={16} />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              Markdown Input
            </span>

            {/* ℹ️ Cheatsheet Button (เพิ่มตามคำขอ) */}
            <MarkdownCheatsheet />
          </div>

          <div className="flex items-center gap-1 self-end sm:self-auto">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8 text-primary hover:text-primary hover:bg-primary/10 mr-1"
              onClick={handleDemo}
            >
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Demo
            </Button>
            <PasteButton onPaste={setInput} />
            <ClearButton onClear={() => setInput("")} disabled={!input} />
          </div>
        </div>

        {/* Input Textarea */}
        <CardContent className="p-0 flex-1 relative min-h-0">
          <Textarea
            className={cn(
              "w-full h-full resize-none border-0 focus-visible:ring-0 p-6 text-sm md:text-base leading-relaxed font-mono bg-transparent rounded-none shadow-none text-foreground/90",
              "scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent placeholder:text-muted-foreground/30"
            )}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="# Type markdown here..."
            spellCheck={false}
          />
        </CardContent>
      </Card>

      {/* ================= RIGHT PANEL: HTML OUTPUT ================= */}
      <Card className="flex flex-col h-full overflow-hidden bg-card p-0 border-border/60 shadow-md hover:shadow-lg transition-shadow">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/30 min-h-[60px] gap-3 shrink-0">
          {/* View Mode Selector */}
          <div className="flex items-center gap-2">
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

            <Select
              value={viewMode}
              onValueChange={(v) => setViewMode(v as ViewMode)}
            >
              <SelectTrigger className="h-8 min-w-[120px] bg-background text-xs font-medium border-border/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="code">HTML Code</SelectItem>
                <SelectItem value="preview">Live Preview</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 self-end sm:self-auto">
            <DownloadButton
              text={htmlOutput}
              filename="converted.html"
              extension="html"
              className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
            />
            <CopyButton
              text={htmlOutput}
              className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
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
                "scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent"
              )}
              value={htmlOutput}
              readOnly
              placeholder="HTML output will appear here..."
            />
          ) : (
            // --- VIEW: PREVIEW (Rendered HTML) ---
            <div className="w-full h-full overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-muted-foreground/20 bg-background/50">
              {htmlOutput ? (
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

// =============================================================================
// Helper Component: Markdown Cheatsheet
// =============================================================================
function MarkdownCheatsheet() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full text-muted-foreground hover:text-foreground"
          title="Markdown Cheatsheet"
        >
          <HelpCircle size={14} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4 border-b border-border/50 bg-muted/30">
          <h4 className="font-semibold text-sm">Markdown Guide</h4>
          <p className="text-xs text-muted-foreground">
            Common syntax examples
          </p>
        </div>
        <div className="p-2 max-h-[300px] overflow-y-auto text-xs grid gap-1">
          <CheatsheetItem symbol="# H1" desc="Heading 1" />
          <CheatsheetItem symbol="## H2" desc="Heading 2" />
          <CheatsheetItem symbol="**Bold**" desc="Bold Text" />
          <CheatsheetItem symbol="*Italic*" desc="Italic Text" />
          <CheatsheetItem symbol="- List" desc="Bullet List" />
          <CheatsheetItem symbol="1. List" desc="Numbered List" />
          <CheatsheetItem symbol="> Quote" desc="Blockquote" />
          <CheatsheetItem symbol="`Code`" desc="Inline Code" />
          <CheatsheetItem symbol="```js" desc="Code Block" />
          <CheatsheetItem symbol="[Link](url)" desc="Hyperlink" />
          <CheatsheetItem symbol="![Alt](img)" desc="Image" />
        </div>
      </PopoverContent>
    </Popover>
  );
}

function CheatsheetItem({ symbol, desc }: { symbol: string; desc: string }) {
  return (
    <div className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
      <code className="font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[10px]">
        {symbol}
      </code>
      <span className="text-muted-foreground">{desc}</span>
    </div>
  );
}
