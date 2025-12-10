"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowDownUp, Trash2, Link as LinkIcon, Unlink } from "lucide-react";
import { toast } from "sonner";
import { CopyButton } from "@/components/shared/copy-button";

export function UrlEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleEncode = () => {
    try {
      const encoded = encodeURIComponent(input);
      setOutput(encoded);
      toast.success("Encoded successfully");
    } catch (e) {
      toast.error("Error encoding text");
    }
  };

  const handleDecode = () => {
    try {
      // decodeURIComponent อาจ Error ได้ถ้า Format ผิด (เช่น % ที่ไม่มีตัวเลขตาม)
      const decoded = decodeURIComponent(input);
      setOutput(decoded);
      toast.success("Decoded successfully");
    } catch (e) {
      toast.error("Malformed URL: Failed to decode");
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 h-[calc(100vh-200px)] min-h-[500px]">
      {/* Input Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="input">Input Text / URL</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setInput("");
              setOutput("");
            }}
            className="text-xs text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-3 h-3 mr-2" />
            Clear All
          </Button>
        </div>
        <Card className="flex-1">
          <CardContent className="p-0 h-full">
            <Textarea
              id="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to encode or decode..."
              className="w-full h-full resize-none border-0 focus-visible:ring-0 p-4 font-mono text-sm"
            />
          </CardContent>
        </Card>
      </div>

      {/* Actions (Mobile only - hidden on Desktop to separate input/output logic visually) */}
      <div className="md:hidden flex gap-2">
        <Button onClick={handleEncode} className="flex-1">
          Encode
        </Button>
        <Button onClick={handleDecode} variant="secondary" className="flex-1">
          Decode
        </Button>
      </div>

      {/* Output Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="output">Result</Label>
          <div className="flex items-center gap-2">
            {/* Desktop Actions */}
            <div className="hidden md:flex gap-2 mr-2">
              <Button onClick={handleEncode} size="sm" variant="default">
                <LinkIcon className="w-3 h-3 mr-2" />
                Encode
              </Button>
              <Button onClick={handleDecode} size="sm" variant="secondary">
                <Unlink className="w-3 h-3 mr-2" />
                Decode
              </Button>
            </div>
            <CopyButton text={output} />
          </div>
        </div>
        <Card className="flex-1 bg-muted/30">
          <CardContent className="p-0 h-full">
            <Textarea
              id="output"
              value={output}
              readOnly
              placeholder="Result will appear here..."
              className="w-full h-full resize-none border-0 bg-transparent focus-visible:ring-0 p-4 font-mono text-sm text-muted-foreground"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
