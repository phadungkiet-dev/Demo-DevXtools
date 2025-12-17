"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowDownUp, Trash2 } from "lucide-react";
import { CopyButton } from "@/components/shared/buttons/copy-button";
import { toast } from "sonner";

export function Base64Converter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleEncode = () => {
    try {
      setOutput(btoa(input)); // Simple ASCII Base64
    } catch (e) {
      // Handle UTF-8 strings
      setOutput(Buffer.from(input, "utf-8").toString("base64"));
    }
  };

  const handleDecode = () => {
    try {
      setOutput(atob(input));
    } catch (e) {
      try {
        setOutput(Buffer.from(input, "base64").toString("utf-8"));
      } catch (err) {
        toast.error("Invalid Base64 string");
      }
    }
  };

  return (
    <div className="grid gap-6 h-[calc(100vh-200px)] min-h-[500px]">
      <div className="grid md:grid-cols-2 gap-4 h-full">
        <div className="flex flex-col gap-2">
          <Label>Input</Label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 font-mono resize-none"
            placeholder="Type here..."
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Output</Label>
          <div className="relative flex-1">
            <Textarea
              value={output}
              readOnly
              className="w-full h-full font-mono resize-none bg-muted/30"
            />
            <div className="absolute top-2 right-2">
              <CopyButton text={output} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <Button onClick={handleEncode} className="w-32">
          Encode
        </Button>
        <Button onClick={handleDecode} variant="secondary" className="w-32">
          Decode
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setInput("");
            setOutput("");
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
