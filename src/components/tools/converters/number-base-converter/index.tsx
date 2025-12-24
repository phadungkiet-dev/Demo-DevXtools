"use client";

// Imports ========================
import { useState } from "react";
// UI Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

// Icons
import { Calculator, Info } from "lucide-react";

// Shared Components
import { CopyButton, ClearButton } from "@/components/shared/buttons";
// Utils & Libs
import { cn } from "@/lib/utils";
import { BASES, BaseConfig, toBigInt, fromBigInt } from "@/lib/number-base";

// Main Component =================
export function NumberBaseConverter() {
  // --- State Management ---
  const [values, setValues] = useState<Record<string, string>>(
    BASES.reduce((acc, curr) => ({ ...acc, [curr.id]: "" }), {})
  );

  const [activeError, setActiveError] = useState<string | null>(null);

  // --- Handlers ---

  // Clear All Inputs
  const handleClear = () => {
    setValues(BASES.reduce((acc, curr) => ({ ...acc, [curr.id]: "" }), {}));
    setActiveError(null);
  };

  // Handle Change Logic
  const handleChange = (newValue: string, sourceBaseConfig: BaseConfig) => {
    // ถ้าลบจนหมด ให้ Clear ทุกช่อง
    if (newValue.trim() === "") {
      handleClear();
      return;
    }

    // Validate Input (เช็คว่าตัวอักษรตรงตาม Regex ของ Base นั้นๆ หรือไม่)
    if (!sourceBaseConfig.regex.test(newValue)) {
      setValues((prev) => ({ ...prev, [sourceBaseConfig.id]: newValue }));
      setActiveError(`Invalid character for ${sourceBaseConfig.label}`);
      return;
    }

    // Conversion Process
    try {
      setActiveError(null);
      // แปลงค่า Input เป็น BigInt (Decimal)
      const decimalBigInt = toBigInt(newValue, sourceBaseConfig.base);

      // แปลง Decimal กลับเป็น Base อื่นๆ
      const newValues: Record<string, string> = {};
      BASES.forEach((target) => {
        if (target.id === sourceBaseConfig.id) {
          newValues[target.id] = newValue;
        } else {
          newValues[target.id] = fromBigInt(decimalBigInt, target.base);
        }
      });

      setValues(newValues);
    } catch (err) {
      console.error(err);
      // กรณี Error ให้คงค่าเดิมไว้แต่แสดง Error (เช่น Overflow หรือ Logic ผิดพลาด)
      setValues((prev) => ({ ...prev, [sourceBaseConfig.id]: newValue }));
    }
  };

  // เช็คว่ามีค่าใน Input บ้างหรือไม่ (เพื่อเปิด/ปิดปุ่ม Clear)
  const hasValues = Object.values(values).some((v) => v !== "");

  return (
    <div
      className={cn(
        // Layout
        "space-y-6",
        // Animation Core
        "animate-in fade-in slide-in-from-bottom-4",
        // Animation Timing
        "duration-600 ease-out",
        // Animation Staging
        "delay-200 fill-mode-backwards"
      )}
    >
      <Card className="border-border/60 shadow-md flex flex-col overflow-hidden bg-card p-0 transition-all hover:shadow-lg gap-2 sm:gap-4">
        {/* Header Toolbar */}
        <div
          className={cn(
            // Layout & Direction (การจัดวางและทิศทาง)
            "flex flex-col items-center sm:flex-row justify-between",
            // Sizing & Spacing
            "min-h-[60px] px-6 py-4 md:py-2 gap-4 sm:gap-0",
            // Visuals
            "bg-muted/40 border-b border-border/60"
          )}
        >
          <div className="flex items-center gap-3 ">
            <div className="p-2 bg-primary/10 rounded-md text-primary shadow-sm">
              <Calculator size={16} />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              Mathematical Base Converter
            </span>
          </div>

          {/* Refactored Toolbar Buttons: ใช้ Shared Components */}
          <div
            className={cn(
              // Layout & Sizing
              "flex flex-wrap items-center gap-1",
              "w-full sm:w-auto",
              // Alignment
              "justify-center",
              "sm:justify-end"
            )}
          >
            {/* ClearButton จัดการ Style สีแดงเมื่อ Hover */}
            <ClearButton onClear={handleClear} disabled={!hasValues} />
          </div>
        </div>

        {/* Inputs Grid */}
        <CardContent className="p-4 relative">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {BASES.map((config) => (
              <BaseInputCard
                key={config.id}
                config={config}
                value={values[config.id] || ""}
                onChange={(val) => handleChange(val, config)}
                hasError={
                  activeError !== null && !config.regex.test(values[config.id])
                }
              />
            ))}
          </div>

          {/* Error Message Alert */}
          {activeError && (
            <div className="mt-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium text-center animate-in fade-in slide-in-from-bottom-2">
              {activeError}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// =============================================================================
// Sub-Component: Base Input Card
// =============================================================================
interface BaseInputCardProps {
  config: BaseConfig;
  value: string;
  onChange: (val: string) => void;
  hasError: boolean;
}

function BaseInputCard({
  config,
  value,
  onChange,
  hasError,
}: BaseInputCardProps) {
  return (
    <div
      className={cn(
        // Layout & Shape
        "group relative overflow-hidden p-4 rounded-xl border",
        // Background
        "bg-card",
        // Animation
        "transition-all duration-200",
        hasError
          ? // กรณี ERROR: สีแดง, ไม่มี Hover Effect ที่ขอบ, มี Ring แดง
            "border-destructive/50 ring-1 ring-destructive/20"
          : // กรณี ปกติ (NORMAL):
            cn(
              // Border colors
              "border-border/40 hover:border-primary/20",
              "focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/20"
            )
      )}
    >
      {/* Label Header */}
      <div className="flex justify-between items-center mb-3">
        <Label
          className={cn(
            "text-sm font-semibold",
            hasError ? "text-destructive" : "text-foreground"
          )}
        >
          {config.label}
        </Label>
        <div className="px-2 py-1 text-[10px] font-bold bg-muted/50 text-muted-foreground border border-border/50 rounded">
          Base {config.base}
        </div>
      </div>

      {/* Input & Copy Row */}
      <div className="flex gap-2 items-center">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={config.placeholder}
          // font-mono text-base h-10 border-muted-foreground/20 focus-visible:ring-0 focus-visible:border-transparent px-3 bg-muted/20 hover:bg-muted/30 transition-colors
          className={cn(
            // Layout & Sizing
            "h-10 px-3",
            // Typography
            "font-mono text-base",
            // Visuals
            "bg-muted/20 border-muted-foreground/20",
            // Interaction
            "hover:bg-muted/30 focus-visible:border-transparent",
            // Animation
            "transition-colors"
          )}
          spellCheck={false}
        />
        {/* ใช้ CopyButton จาก Shared */}
        <CopyButton
          text={value}
          className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
        />
      </div>

      {/* Description / Hint */}
      <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground/60">
        <Info size={10} />
        <span className="truncate" title={config.description}>
          {config.description}
        </span>
      </div>
    </div>
  );
}
