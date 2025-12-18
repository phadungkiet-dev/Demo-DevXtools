"use client";

import { useState, useEffect } from "react";

// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Icons
import { Fingerprint, Settings2 } from "lucide-react";

// Shared Components
import {
  CopyButton,
  DownloadButton,
  ClearButton,
  RegenerateButton, // ✅ ใช้ Shared Component
} from "@/components/shared/buttons";
import { cn } from "@/lib/utils";

// Libs
import { v4 as uuidv4, v1 as uuidv1 } from "uuid";
import { nanoid } from "nanoid";
import { ulid } from "ulid";

// =============================================================================
// Types & Constants
// =============================================================================
type IdType = "uuidv4" | "uuidv1" | "nanoid" | "ulid";

const ID_TYPES = [
  { value: "uuidv4", label: "UUID v4 (Random)" },
  { value: "uuidv1", label: "UUID v1 (Timestamp)" },
  { value: "nanoid", label: "NanoID" },
  { value: "ulid", label: "ULID (Sortable)" },
];

// =============================================================================
// Main Component
// =============================================================================
export function UuidGenerator() {
  // --- State ---
  const [type, setType] = useState<IdType>("uuidv4");
  const [quantity, setQuantity] = useState([1]);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [output, setOutput] = useState("");

  const [trigger, setTrigger] = useState(0);

  // --- Logic & Effects ---
  const count = quantity[0];

  useEffect(() => {
    const timer = setTimeout(() => {
      const ids: string[] = [];

      for (let i = 0; i < count; i++) {
        let id = "";

        switch (type) {
          case "uuidv4":
            id = uuidv4();
            break;
          case "uuidv1":
            id = uuidv1();
            break;
          case "nanoid":
            id = nanoid();
            break;
          case "ulid":
            id = ulid();
            break;
        }

        if ((type === "uuidv4" || type === "uuidv1") && !hyphens) {
          id = id.replace(/-/g, "");
        }

        if (uppercase) {
          id = id.toUpperCase();
        }

        ids.push(id);
      }

      setOutput(ids.join("\n"));
    }, 100);

    return () => clearTimeout(timer);
  }, [type, count, uppercase, hyphens, trigger]);

  // Helper: Reset Config
  const handleReset = () => {
    setQuantity([1]);
    setUppercase(false);
    setHyphens(true);
    setType("uuidv4");
  };

  // Helper: Regenerate
  const handleRegenerate = () => {
    setTrigger((prev) => prev + 1);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3 lg:h-[600px] animate-in fade-in duration-500">
      {/* ================= LEFT: CONFIG PANEL (1 Col) ================= */}
      <Card className="flex flex-col h-full overflow-hidden border-border/60 shadow-md p-0 lg:col-span-1">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 h-[60px] border-b border-border/40 bg-muted/30 shrink-0">
          <div className="p-1.5 bg-primary/10 rounded-md text-primary">
            <Settings2 size={16} />
          </div>
          <span className="text-sm font-semibold text-muted-foreground">
            Configuration
          </span>
        </div>

        {/* Controls */}
        <CardContent className="p-6 flex-1 overflow-y-auto space-y-8">
          {/* 1. Type Selection */}
          <div className="space-y-3">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              ID Type
            </Label>
            <Select value={type} onValueChange={(v) => setType(v as IdType)}>
              <SelectTrigger className="h-10 w-full font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ID_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[10px] text-muted-foreground h-4">
              {type === "uuidv4" && "Randomly generated 128-bit ID."}
              {type === "uuidv1" && "Timestamp-based 128-bit ID."}
              {type === "nanoid" &&
                "Tiny, secure, URL-friendly unique string ID."}
              {type === "ulid" &&
                "Universally Unique Lexicographically Sortable ID."}
            </p>
          </div>

          {/* 2. Quantity Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Quantity
              </Label>
              <Badge
                variant="outline"
                className="font-mono h-5 min-w-[30px] justify-center"
              >
                {quantity[0]}
              </Badge>
            </div>
            <Slider
              value={quantity}
              onValueChange={setQuantity}
              max={100}
              step={1}
              min={1}
              className="cursor-pointer"
            />
          </div>

          {/* 3. Formatting Options */}
          <div className="space-y-4">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Options
            </Label>

            {/* Uppercase Switch */}
            <div className="flex items-center justify-between p-3 rounded-lg border bg-background/50 hover:bg-muted/30 transition-colors">
              <span className="text-sm font-medium">Uppercase</span>
              <Switch checked={uppercase} onCheckedChange={setUppercase} />
            </div>

            {/* Hyphens Switch */}
            <div
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border bg-background/50 transition-colors",
                !type.startsWith("uuid")
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-muted/30"
              )}
            >
              <span className="text-sm font-medium">Hyphens (-)</span>
              <Switch
                checked={hyphens}
                onCheckedChange={setHyphens}
                disabled={!type.startsWith("uuid")}
              />
            </div>
          </div>
        </CardContent>

        {/* Footer Actions */}

        <div className="p-4 border-t border-border/40 bg-muted/10 shrink-0 flex flex-col sm:flex-row gap-3 min-w-0">
          <Button
            variant="outline"
            onClick={handleReset}
            className="w-full sm:w-auto"
          >
            Reset
          </Button>

          <RegenerateButton
            onRegenerate={handleRegenerate}
            label="Regenerate"
            variant="default"
            className="w-full sm:flex-1 shadow-sm min-w-0"
          />
        </div>
      </Card>

      {/* ================= RIGHT: OUTPUT PANEL (2 Cols) ================= */}
      <Card className="flex flex-col h-full overflow-hidden border-border/60 shadow-md p-0 lg:col-span-2">
        {/* Toolbar */}
        {/* ✅ แก้ไข: เพิ่ม gap-4 และ overflow-x-auto ให้กับปุ่มเครื่องมือ */}
        <div className="flex items-center justify-between px-4 h-[60px] border-b border-border/40 bg-muted/30 shrink-0 gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <div className="p-1.5 bg-purple-500/10 rounded-md text-purple-500">
              <Fingerprint size={16} />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              Generated IDs
            </span>
            <Badge
              variant="secondary"
              className="ml-2 text-[10px] h-5 px-1.5 hidden sm:flex"
            >
              Total: {quantity[0]}
            </Badge>
          </div>

          {/* ✅ ส่วนนี้คือจุดสำคัญ: เพิ่ม overflow-x-auto เพื่อให้ support desktop/mobile */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mask-fade-right">
            <DownloadButton
              text={output}
              filename={`generated-${type}.txt`}
              extension="txt"
              className="h-8 w-8 hover:bg-background hover:text-primary transition-colors flex-shrink-0" // เพิ่ม flex-shrink-0 กันปุ่มบี้
            />
            <CopyButton
              text={output}
              className="h-8 w-8 hover:bg-background hover:text-primary transition-colors flex-shrink-0"
            />
            <ClearButton
              onClear={() => setOutput("")}
              disabled={!output}
              className="flex-shrink-0"
            />
          </div>
        </div>

        {/* Output Area */}
        <div className="flex-1 relative min-h-0 bg-muted/5">
          <Textarea
            value={output}
            readOnly
            className={cn(
              "w-full h-full resize-none border-0 focus-visible:ring-0 p-6",
              "font-mono text-sm md:text-base leading-relaxed text-foreground bg-transparent rounded-none shadow-none",
              "scrollbar-thin scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40 overflow-y-auto"
            )}
            placeholder="Generated IDs will appear here..."
          />
        </div>
      </Card>
    </div>
  );
}
