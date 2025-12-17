"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, FileText, Eye } from "lucide-react";
import { CopyButton } from "@/components/shared/buttons/copy-button";

// --- Basic Markdown Parser (Regex Based) ---
// หมายเหตุ: สำหรับการใช้งานจริงที่ซับซ้อน แนะนำให้ใช้ library เช่น 'react-markdown'
const parseMarkdown = (text: string) => {
  const html = text
    // Sanitization (Basic)
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

    // Headers
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4 mt-6">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-3 mt-5">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-2 mt-4">$1</h3>')

    // Bold & Italic
    .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*)\*/gim, "<em>$1</em>")

    // Blockquote
    .replace(
      /^\> (.*$)/gim,
      '<blockquote class="border-l-4 border-primary/50 pl-4 italic my-4 text-muted-foreground">$1</blockquote>'
    )

    // Code Block (```)
    .replace(
      /```([\s\S]*?)```/gim,
      '<pre class="bg-muted p-4 rounded-md my-4 overflow-x-auto font-mono text-sm"><code>$1</code></pre>'
    )

    // Inline Code (`)
    .replace(
      /`([^`]+)`/gim,
      '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>'
    )

    // Horizontal Rule
    .replace(/^---$/gim, '<hr class="my-6 border-border" />')

    // Links
    .replace(
      /\[(.*?)\]\((.*?)\)/gim,
      '<a href="$2" target="_blank" class="text-primary hover:underline">$1</a>'
    )

    // Lists (Basic - Bullet points)
    .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')

    // Paragraphs (Double newline)
    .replace(/\n\n/gim, '</p><p class="mb-4">')
    .replace(/\n/gim, "<br />");

  return `<div class="prose dark:prose-invert max-w-none text-foreground">${html}</div>`;
};

export function MarkdownPreviewer() {
  const [input, setInput] = useState(
    "# Hello World\n\nThis is a **bold** text and *italic* text.\n\n> This is a blockquote.\n\n- List item 1\n- List item 2\n\n```\nconsole.log('Code block');\n```"
  );
  const [html, setHtml] = useState("");

  // Update preview when input changes
  useEffect(() => {
    setHtml(parseMarkdown(input));
  }, [input]);

  return (
    <div className="grid gap-6 lg:grid-cols-2 h-[calc(100vh-200px)] min-h-[600px]">
      {/* Editor Section */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <Label className="flex items-center gap-2">
            <FileText className="w-4 h-4" /> Markdown Input
          </Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setInput("")}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Clear
          </Button>
        </div>
        <Card className="flex-1 overflow-hidden">
          <CardContent className="p-0 h-full">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type markdown here..."
              className="w-full h-full resize-none border-0 focus-visible:ring-0 p-4 font-mono text-sm leading-relaxed"
            />
          </CardContent>
        </Card>
      </div>

      {/* Preview Section */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <Label className="flex items-center gap-2">
            <Eye className="w-4 h-4" /> Preview
          </Label>
          <CopyButton text={html} />
        </div>
        <Card className="flex-1 overflow-hidden bg-muted/20 border-dashed">
          <CardContent className="p-6 h-full overflow-auto">
            {/* Render HTML Safely (ในระดับหนึ่ง) */}
            <div
              className="markdown-preview"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
