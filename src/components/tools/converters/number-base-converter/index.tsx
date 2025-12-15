"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/shared/copy-button";
import { Trash2, Calculator, Info } from "lucide-react";
import { cn } from "@/lib/utils";
// ✅ Import Logic จาก Lib ที่เราเพิ่งสร้าง
import { BASES, BaseConfig, toBigInt, fromBigInt } from "@/lib/number-base";

export function NumberBaseConverter() {
  const [values, setValues] = useState<Record<string, string>>(
    BASES.reduce((acc, curr) => ({ ...acc, [curr.id]: "" }), {})
  );

  const [activeError, setActiveError] = useState<string | null>(null);

  const handleChange = (newValue: string, sourceBaseConfig: BaseConfig) => {
    // 1. Clear if empty
    if (newValue.trim() === "") {
      setValues(BASES.reduce((acc, curr) => ({ ...acc, [curr.id]: "" }), {}));
      setActiveError(null);
      return;
    }

    // 2. Validate Input
    if (!sourceBaseConfig.regex.test(newValue)) {
      setValues((prev) => ({ ...prev, [sourceBaseConfig.id]: newValue }));
      setActiveError(`Invalid character for ${sourceBaseConfig.label}`);
      return;
    }

    // 3. Conversion Process (เรียกใช้ function จาก lib)
    try {
      setActiveError(null);

      const decimalBigInt = toBigInt(newValue, sourceBaseConfig.base); // 👈 ใช้จาก Lib

      const newValues: Record<string, string> = {};
      BASES.forEach((target) => {
        if (target.id === sourceBaseConfig.id) {
          newValues[target.id] = newValue;
        } else {
          newValues[target.id] = fromBigInt(decimalBigInt, target.base); // 👈 ใช้จาก Lib
        }
      });

      setValues(newValues);
    } catch (err) {
      console.error(err);
      setValues((prev) => ({ ...prev, [sourceBaseConfig.id]: newValue }));
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/60 shadow-md flex flex-col overflow-hidden bg-card p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-muted/30 min-h-[60px]">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-primary/10 rounded-md text-primary">
              <Calculator size={16} />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              Mathematical Base Converter
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8 text-muted-foreground hover:text-destructive"
              onClick={() => handleChange("", BASES[0])}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-6">
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

// Sub-component (BaseInputCard) เก็บไว้ที่เดิมได้ หรือจะแยกไฟล์ก็ได้ครับ
function BaseInputCard({
  config,
  value,
  onChange,
  hasError,
}: {
  config: BaseConfig;
  value: string;
  onChange: (val: string) => void;
  hasError: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative p-4 rounded-xl border bg-card transition-all duration-200",
        hasError
          ? "border-destructive/50 ring-1 ring-destructive/20"
          : "border-border/50 hover:border-primary/40 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 shadow-sm hover:shadow-md"
      )}
    >
      <div className="flex justify-between items-center mb-3">
        <Label
          className={cn(
            "text-sm font-semibold",
            hasError ? "text-destructive" : "text-foreground"
          )}
        >
          {config.label}
        </Label>
        <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-muted-foreground">
          Base {config.base}
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={config.placeholder}
          className="font-mono text-base h-10 border-muted-foreground/20 focus-visible:ring-0 focus-visible:border-transparent px-3 bg-muted/20"
          spellCheck={false}
        />
        <CopyButton
          text={value}
          className="h-10 w-10 shrink-0 text-muted-foreground hover:text-primary"
        />
      </div>

      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground/60">
        <Info size={10} />
        <span className="truncate">{config.description}</span>
      </div>
    </div>
  );
}
