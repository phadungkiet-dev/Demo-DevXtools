"use client";

import { useState } from "react";
import CryptoJS from "crypto-js";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/shared/copy-button";

export function HashGenerator() {
  const [input, setInput] = useState("");

  return (
    <div className="grid gap-6 lg:grid-cols-12 h-full">
      <div className="lg:col-span-4 space-y-4">
        <Label>Input Text</Label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to hash..."
          className="h-[300px] resize-none"
        />
      </div>
      <div className="lg:col-span-8 space-y-4">
        <HashRow
          label="MD5"
          value={input ? CryptoJS.MD5(input).toString() : ""}
        />
        <HashRow
          label="SHA-1"
          value={input ? CryptoJS.SHA1(input).toString() : ""}
        />
        <HashRow
          label="SHA-256"
          value={input ? CryptoJS.SHA256(input).toString() : ""}
        />
        <HashRow
          label="SHA-512"
          value={input ? CryptoJS.SHA512(input).toString() : ""}
        />
      </div>
    </div>
  );
}

function HashRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={value}
          readOnly
          className="font-mono text-sm bg-muted/50"
        />
        <CopyButton text={value} />
      </div>
    </div>
  );
}
