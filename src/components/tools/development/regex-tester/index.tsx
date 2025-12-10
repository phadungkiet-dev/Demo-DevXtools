"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export function RegexTester() {
  const [pattern, setPattern] = useState("[A-Z]\\w+");
  const [flags, setFlags] = useState(["g"]);
  const [text, setText] = useState("Hello World! This is a Regex Test.");

  // ❌ ลบ State error ทิ้ง (ไม่ต้องใช้แล้ว)
  // const [error, setError] = useState<string | null>(null);

  // Helper เพื่อจัดการ Flags
  const toggleFlag = (flag: string) => {
    setFlags((prev) =>
      prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag]
    );
  };

  // 1. Core Logic: คำนวณทุกอย่างในนี้ (Derived State)
  const result = useMemo(() => {
    if (!pattern) return { matches: [], highlighted: text, error: null };

    try {
      const regex = new RegExp(pattern, flags.join(""));
      const matches = [...text.matchAll(regex)];

      // สร้าง Highlighted HTML
      let lastIndex = 0;
      const parts = [];

      matches.forEach((match, i) => {
        if (match.index! > lastIndex) {
          parts.push(text.substring(lastIndex, match.index));
        }
        parts.push(
          <mark
            key={i}
            className="bg-yellow-200 dark:bg-yellow-900/50 rounded-sm px-0.5 text-foreground"
          >
            {match[0]}
          </mark>
        );
        lastIndex = match.index! + match[0].length;
      });

      if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
      }

      // ส่ง error เป็น null ถ้าผ่าน
      return { matches, highlighted: parts, error: null };
    } catch (err) {
      // ส่ง error message กลับไปตรงๆ เลย
      return { matches: [], highlighted: text, error: (err as Error).message };
    }
  }, [pattern, flags, text]);

  // ❌ ลบ useEffect ทิ้ง (ไม่ต้อง Sync state แล้ว เพราะเราใช้ result.error ได้เลย)
  // useEffect(() => { setError(result.error); }, [result.error]);

  return (
    <div className="grid gap-6 h-full">
      {/* Configuration Panel */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-12">
            {/* Pattern Input */}
            <div className="md:col-span-8 space-y-2">
              <Label>Regex Pattern</Label>
              <div className="relative font-mono">
                <span className="absolute left-3 top-2.5 text-muted-foreground">
                  /
                </span>
                <Input
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  className="pl-6 pr-12 font-mono"
                  placeholder="e.g. [a-z]+"
                />
                <span className="absolute right-3 top-2.5 text-muted-foreground">
                  /{flags.join("")}
                </span>
              </div>

              {/* ✅ เรียกใช้ result.error โดยตรง */}
              {result.error && (
                <p className="text-xs text-destructive font-medium">
                  {result.error}
                </p>
              )}
            </div>

            {/* Flags Selection */}
            <div className="md:col-span-4 space-y-2">
              <Label>Flags</Label>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="flag-g"
                    checked={flags.includes("g")}
                    onCheckedChange={() => toggleFlag("g")}
                  />
                  <Label
                    htmlFor="flag-g"
                    className="font-mono text-xs cursor-pointer"
                  >
                    Global (g)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="flag-i"
                    checked={flags.includes("i")}
                    onCheckedChange={() => toggleFlag("i")}
                  />
                  <Label
                    htmlFor="flag-i"
                    className="font-mono text-xs cursor-pointer"
                  >
                    Insensitive (i)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="flag-m"
                    checked={flags.includes("m")}
                    onCheckedChange={() => toggleFlag("m")}
                  />
                  <Label
                    htmlFor="flag-m"
                    className="font-mono text-xs cursor-pointer"
                  >
                    Multiline (m)
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6 h-[500px]">
        {/* Test String Input */}
        <div className="flex flex-col gap-2">
          <Label>Test String</Label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 font-mono text-sm resize-none leading-relaxed"
            placeholder="Enter text to test..."
          />
        </div>

        {/* Output & Matches */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label>Result / Highlight</Label>
            <Badge variant="secondary">{result.matches.length} Matches</Badge>
          </div>
          <Card className="flex-1 bg-muted/30 overflow-hidden border-dashed">
            <CardContent className="p-4 font-mono text-sm whitespace-pre-wrap break-all h-full overflow-auto">
              {result.highlighted.length > 0 ? (
                result.highlighted
              ) : (
                <span className="text-muted-foreground opacity-50">
                  No matches found
                </span>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
