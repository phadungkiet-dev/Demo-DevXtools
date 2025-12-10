"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { CopyButton } from "@/components/shared/copy-button";
import { jwtDecode, JwtHeader } from "jwt-decode"; // Import library

export function JwtDecoder() {
  const [token, setToken] = useState("");
  const [header, setHeader] = useState<string | null>(null);
  const [payload, setPayload] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDecode = (inputToken: string) => {
    setToken(inputToken);
    setError(null);
    setHeader(null);
    setPayload(null);

    if (!inputToken.trim()) return;

    try {
      // 1. Decode Header
      const decodedHeader: JwtHeader = jwtDecode(inputToken, { header: true });
      setHeader(JSON.stringify(decodedHeader, null, 2));

      // 2. Decode Payload
      const decodedPayload = jwtDecode(inputToken);
      setPayload(JSON.stringify(decodedPayload, null, 2));

      toast.success("JWT Decoded successfully");
    } catch (err) {
      // จัดการ Error กรณี Token ผิด format
      setError((err as Error).message || "Invalid JWT Token");
      toast.error("Failed to decode JWT");
    }
  };

  const clearAll = () => {
    setToken("");
    setHeader(null);
    setPayload(null);
    setError(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3 h-[calc(100vh-200px)] min-h-[600px]">
      {/* Input Section (1 col) */}
      <div className="flex flex-col space-y-4 lg:border-r lg:pr-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Encoded Token
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="text-xs text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-3 h-3 mr-2" />
            Clear
          </Button>
        </div>
        <Card
          className={`flex-1 overflow-hidden transition-colors ${
            error ? "border-destructive/50" : ""
          }`}
        >
          <CardContent className="p-0 h-full relative">
            <Textarea
              value={token}
              onChange={(e) => handleDecode(e.target.value)} // Decode ทันทีที่พิมพ์
              placeholder="Paste your JWT token here (e.g., eyJhbG...)"
              className="w-full h-full resize-none border-0 focus-visible:ring-0 p-4 font-mono text-sm leading-relaxed break-all"
              spellCheck={false}
            />
            {error && (
              <div className="absolute bottom-4 left-4 right-4 bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20 animate-in slide-in-from-bottom-2">
                <strong>Error:</strong> {error}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Output Section (2 cols) */}
      <div className="lg:col-span-2 flex flex-col gap-6 overflow-hidden">
        {/* Header Output */}
        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between bg-muted/30 border-b">
            <CardTitle className="text-sm font-medium">Header</CardTitle>
            {header && <CopyButton text={header} className="h-8 w-8" />}
          </CardHeader>
          <CardContent className="p-0 flex-1 bg-muted/10 overflow-auto">
            <pre className="p-4 font-mono text-sm text-muted-foreground">
              {header || (
                <span className="opacity-50 italic">Waiting for token...</span>
              )}
            </pre>
          </CardContent>
        </Card>

        {/* Payload Output */}
        <Card className="flex-[2] flex flex-col overflow-hidden">
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between bg-muted/30 border-b">
            <CardTitle className="text-sm font-medium">
              Payload (Data)
            </CardTitle>
            {payload && <CopyButton text={payload} className="h-8 w-8" />}
          </CardHeader>
          <CardContent className="p-0 flex-1 bg-muted/10 overflow-auto">
            <pre className="p-4 font-mono text-sm text-primary">
              {payload || (
                <span className="opacity-50 italic text-muted-foreground">
                  Waiting for token...
                </span>
              )}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
