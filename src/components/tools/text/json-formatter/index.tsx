"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Copy, Minimize, Maximize } from "lucide-react";
import { toast } from "sonner";
import { CopyButton } from "@/components/shared/copy-button";

export function JsonFormatter() {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const formatJson = (space: number) => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, space));
      setError(null);
      toast.success(space === 0 ? "Minified JSON" : "Formatted JSON");
    } catch (err) {
      setError((err as Error).message);
      toast.error("Invalid JSON Syntax");
    }
  };

  return (
    <div className="space-y-4 h-[calc(100vh-200px)] min-h-[500px] flex flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-x-2">
          <Button onClick={() => formatJson(2)} variant="secondary" size="sm">
            <Maximize className="w-4 h-4 mr-2" />
            Prettify (2 spaces)
          </Button>
          <Button onClick={() => formatJson(0)} variant="outline" size="sm">
            <Minimize className="w-4 h-4 mr-2" />
            Minify
          </Button>
        </div>
        <div className="space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setInput("");
              setError(null);
            }}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
          <CopyButton text={input} />
        </div>
      </div>

      {/* Editor Area */}
      <Card
        className={`flex-1 flex flex-col overflow-hidden transition-colors ${
          error ? "border-destructive/50" : ""
        }`}
      >
        <CardContent className="p-0 h-full flex flex-col relative">
          <Textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError(null); // Clear error when typing
            }}
            placeholder="Paste your JSON here..."
            className="flex-1 resize-none border-0 focus-visible:ring-0 p-4 font-mono text-sm leading-relaxed"
            spellCheck={false}
          />

          {/* Error Message Indicator */}
          {error && (
            <div className="absolute bottom-4 left-4 right-4 bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20 animate-in slide-in-from-bottom-2">
              <strong>Error:</strong> {error}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between text-xs text-muted-foreground px-1">
        <span>Size: {new Blob([input]).size} bytes</span>
        <span>Length: {input.length} chars</span>
      </div>
    </div>
  );
}
