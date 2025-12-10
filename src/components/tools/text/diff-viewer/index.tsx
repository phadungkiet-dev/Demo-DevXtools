"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { diffLines, Change } from "diff";
import { Trash2 } from "lucide-react";

export function DiffViewer() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");

  const differences = useMemo(() => {
    if (!original && !modified) return [];
    return diffLines(original, modified);
  }, [original, modified]);

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] min-h-[600px] gap-6">
      {/* Inputs Area (2 Columns) */}
      <div className="grid md:grid-cols-2 gap-4 h-1/2">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Label>Original Text</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOriginal("")}
              className="h-6 text-xs"
            >
              Clear
            </Button>
          </div>
          <Textarea
            className="flex-1 font-mono text-xs resize-none"
            placeholder="Paste original text here..."
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Label>Modified Text</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setModified("")}
              className="h-6 text-xs"
            >
              Clear
            </Button>
          </div>
          <Textarea
            className="flex-1 font-mono text-xs resize-none"
            placeholder="Paste new text here..."
            value={modified}
            onChange={(e) => setModified(e.target.value)}
          />
        </div>
      </div>

      {/* Output / Diff Result */}
      <div className="flex flex-col gap-2 h-1/2">
        <Label>Difference Result</Label>
        <Card className="flex-1 overflow-hidden bg-muted/30 border-dashed">
          <CardContent className="p-0 h-full overflow-auto">
            <div className="font-mono text-sm p-4">
              {differences.map((part, index) => {
                // กำหนดสี: เขียว=เพิ่ม, แดง=ลบ, ปกติ=ไม่เปลี่ยน
                let bgColor = "transparent";
                let textColor = "inherit";
                let prefix = "  ";

                if (part.added) {
                  bgColor = "rgba(34, 197, 94, 0.2)"; // green-500/20
                  textColor = "#15803d"; // green-700
                  prefix = "+ ";
                } else if (part.removed) {
                  bgColor = "rgba(239, 68, 68, 0.2)"; // red-500/20
                  textColor = "#b91c1c"; // red-700
                  prefix = "- ";
                }

                return (
                  <div
                    key={index}
                    style={{ backgroundColor: bgColor, color: textColor }}
                    className="whitespace-pre-wrap break-all px-1"
                  >
                    {part.value}
                  </div>
                );
              })}
              {!original && !modified && (
                <div className="text-muted-foreground opacity-50 text-center mt-10">
                  Waiting for input to compare...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
