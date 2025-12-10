"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRightLeft, Copy, Trash2, FileCode } from "lucide-react";
import { CopyButton } from "@/components/shared/copy-button";
import { toast } from "sonner";

export function HtmlEntityConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  // Logic: Encode
  const handleEncode = () => {
    if (!input) return;
    const encoded = input.replace(/[\u00A0-\u9999<>&"']/g, (i) => {
      return `&#${i.charCodeAt(0)};`;
    });
    setOutput(encoded);
    toast.success("Encoded to HTML Entities");
  };

  // Logic: Decode
  const handleDecode = () => {
    if (!input) return;
    const txt = document.createElement("textarea");
    txt.innerHTML = input;
    setOutput(txt.value);
    toast.success("Decoded HTML Entities");
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  const handleSwap = () => {
    setInput(output);
    setOutput(input);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2 h-[calc(100vh-200px)] min-h-[500px]">
      {/* Input Section */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <Label className="flex items-center gap-2">
            <FileCode className="w-4 h-4" /> Input Text
          </Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
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
              placeholder="Type or paste content here... (e.g. <div>Hello</div>)"
              className="w-full h-full resize-none border-0 focus-visible:ring-0 p-4 font-mono text-sm leading-relaxed"
            />
          </CardContent>
        </Card>
      </div>

      {/* Controls (Mobile: Horizontal, Desktop: Vertical centered actions if needed, but here using buttons in header) */}

      {/* Output Section */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <Label>Result</Label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSwap}
              title="Swap Input/Output"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="secondary" onClick={handleDecode}>
              Decode
            </Button>
            <Button size="sm" onClick={handleEncode}>
              Encode
            </Button>
          </div>
        </div>
        <Card className="flex-1 overflow-hidden bg-muted/30 relative">
          <div className="absolute top-2 right-2 z-10">
            <CopyButton text={output} />
          </div>
          <CardContent className="p-0 h-full">
            <Textarea
              value={output}
              readOnly
              placeholder="Result will appear here..."
              className="w-full h-full resize-none border-0 bg-transparent focus-visible:ring-0 p-4 font-mono text-sm leading-relaxed text-primary"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
