"use client";

import { useState, useEffect } from "react";
import yaml from "js-yaml"; // Library สำหรับจัดการ YAML
import { toast } from "sonner"; // แจ้งเตือนสวยๆ
import { Copy, RefreshCw, Trash2, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "@/components/shared/copy-button"; // สมมติว่ามี Component นี้ (ถ้าไม่มีใช้ Button ธรรมดาก่อนได้)

// กำหนด Mode การทำงาน
type ConversionMode = "yaml-to-json" | "json-to-yaml";

export function YamlJsonConverter() {
  // --- State Management ---
  const [mode, setMode] = useState<ConversionMode>("yaml-to-json");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  // --- Logic: การแปลงค่า (ทำงานทุกครั้งที่ input หรือ mode เปลี่ยน) ---
  useEffect(() => {
    // ถ้าไม่มี Input ให้เคลียร์ Output และ Error
    const timer = setTimeout(() => {
      if (!input.trim()) {
        setOutput("");
        setError(null);
        return;
      }

      try {
        let result = "";

        if (mode === "yaml-to-json") {
          // 1. แปลง YAML -> Object (Javascript Object)
          const parsed = yaml.load(input);
          // 2. แปลง Object -> JSON String (จัดรูปแบบสวยงามด้วย indent 2)
          result = JSON.stringify(parsed, null, 2);
        } else {
          // 1. แปลง JSON String -> Object
          const parsed = JSON.parse(input);
          // 2. แปลง Object -> YAML String
          result = yaml.dump(parsed);
        }

        setOutput(result);
        setError(null); // เคลียร์ Error เดิมทิ้งเมื่อทำสำเร็จ
      } catch (err) {
        // กรณีแปลงไม่ได้ (Format ผิด)
        console.error(err);
        setError((err as Error).message);
        // ไม่เคลียร์ Output เก่า เพื่อให้ User เทียบดูได้ (หรือจะเคลียร์ก็ได้แล้วแต่ UX)
      }
    }, 500);
  }, [input, mode]);

  // --- Handlers ---

  // ฟังก์ชันสลับฝั่ง (Swap) Input <-> Output
  const handleSwap = () => {
    if (!output || error) return; // ถ้าไม่มีผลลัพธ์ หรือมี Error ห้ามสลับ

    setInput(output); // เอาผลลัพธ์กลับไปเป็น Input
    setMode(mode === "yaml-to-json" ? "json-to-yaml" : "yaml-to-json"); // สลับโหมด
    toast.success("Swapped input and output!");
  };

  // ฟังก์ชันล้างค่า
  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
    toast.info("Cleared all fields.");
  };

  return (
    <div className="space-y-6">
      {/* --- Control Bar --- */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Tabs สำหรับเลือกโหมด */}
          <Tabs
            value={mode}
            onValueChange={(v) => setMode(v as ConversionMode)}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid w-full grid-cols-2 sm:w-[300px]">
              <TabsTrigger value="yaml-to-json">YAML to JSON</TabsTrigger>
              <TabsTrigger value="json-to-yaml">JSON to YAML</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSwap}
              disabled={!output || !!error}
              title="Swap Input/Output"
            >
              <ArrowRightLeft className="h-4 w-4 mr-2" />
              Swap
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClear}
              disabled={!input}
              title="Clear All"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* --- Editor Area --- */}
      <div className="grid md:grid-cols-2 gap-6 h-[500px]">
        {/* Left: Input */}
        <div className="flex flex-col gap-2 h-full">
          <Label className="font-semibold text-muted-foreground">
            Input ({mode === "yaml-to-json" ? "YAML" : "JSON"})
          </Label>
          <Textarea
            className="flex-1 font-mono text-sm resize-none p-4 leading-relaxed"
            placeholder={
              mode === "yaml-to-json"
                ? "version: '3'\nservices:\n  web:\n    image: nginx"
                : '{\n  "version": "3",\n  "services": {\n    "web": {\n      "image": "nginx"\n    }\n  }\n}'
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
          />
        </div>

        {/* Right: Output */}
        <div className="flex flex-col gap-2 h-full">
          <div className="flex items-center justify-between">
            <Label className="font-semibold text-muted-foreground">
              Output ({mode === "yaml-to-json" ? "JSON" : "YAML"})
            </Label>
            {/* ปุ่ม Copy ผลลัพธ์ (ใช้ Component แยกถ้ามี หรือเขียนเอง) */}
            {output && !error && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => {
                  navigator.clipboard.writeText(output);
                  toast.success("Copied to clipboard!");
                }}
              >
                <Copy className="h-3 w-3 mr-1" /> Copy
              </Button>
            )}
          </div>

          <div className="relative flex-1">
            <Textarea
              className={`flex-1 font-mono text-sm resize-none p-4 h-full leading-relaxed ${
                error
                  ? "border-red-500 focus-visible:ring-red-500 bg-red-50 dark:bg-red-950/10"
                  : "bg-muted/30"
              }`}
              value={error || output} // ถ้ามี Error ให้โชว์ Error แทน
              readOnly
              placeholder="Result will appear here..."
              spellCheck={false}
            />

            {/* Badge แสดงสถานะ Error ถ้ามี */}
            {error && (
              <div className="absolute bottom-4 right-4 bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-200 text-xs px-2 py-1 rounded font-medium border border-red-200 dark:border-red-800">
                Invalid Syntax
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
