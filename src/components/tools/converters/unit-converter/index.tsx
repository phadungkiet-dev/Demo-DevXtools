"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRightLeft, Settings2, Trash2 } from "lucide-react";
import { CopyButton } from "@/components/shared/copy-button";
import {
  UNIT_CATEGORIES,
  CategoryType,
  convertUnitValue,
} from "@/lib/unit-converter";

export function UnitConverter() {
  // State
  const [category, setCategory] = useState<CategoryType>("length");
  const [fromUnit, setFromUnit] = useState<string>("m");
  const [toUnit, setToUnit] = useState<string>("ft");
  const [inputValue, setInputValue] = useState<string>("");
  const [outputValue, setOutputValue] = useState<string>("");
  const [baseSize, setBaseSize] = useState<number>(16);

  // ✅ แก้ Error: สร้าง Handler เพื่อเปลี่ยน Category และ Reset Unit ทันที (ไม่ต้องรอ useEffect)
  const handleCategoryChange = (newCategory: CategoryType) => {
    setCategory(newCategory);

    // Reset units immediately based on new category config
    const units = UNIT_CATEGORIES[newCategory].units;
    setFromUnit(units[0].id);
    setToUnit(units[1]?.id || units[0].id);

    // Clear values
    setInputValue("");
    setOutputValue("");
  };

  // Logic: Calculate Conversion (ยังคงใช้ useEffect สำหรับ debounce การพิมพ์)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!inputValue || isNaN(parseFloat(inputValue))) {
        setOutputValue("");
        return;
      }

      const val = parseFloat(inputValue);

      // เรียกใช้ Logic จาก Lib
      const result = convertUnitValue(
        val,
        fromUnit,
        toUnit,
        category,
        baseSize
      );

      // Formatting
      const formatted = Number(result.toPrecision(7)).toString();
      setOutputValue(formatted);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, fromUnit, toUnit, category, baseSize]);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setInputValue(outputValue);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:h-[550px] transition-all">
      {/* ================= LEFT: INPUT ================= */}
      <Card className="flex flex-col h-full overflow-hidden bg-card p-0 border-border/60 shadow-md">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-border/40 bg-muted/30 min-h-[60px] gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="p-1.5 bg-primary/10 rounded-md text-primary shrink-0">
              {(() => {
                const Icon = UNIT_CATEGORIES[category].icon;
                return <Icon size={16} />;
              })()}
            </div>

            {/* ✅ เรียกใช้ Handler ใหม่ที่นี่ */}
            <Select
              value={category}
              onValueChange={(v) => handleCategoryChange(v as CategoryType)}
            >
              <SelectTrigger className="h-8 min-w-[140px] bg-background text-xs font-medium border-border/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(
                  Object.entries(UNIT_CATEGORIES) as [
                    CategoryType,
                    (typeof UNIT_CATEGORIES)[CategoryType]
                  ][]
                ).map(([key, conf]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <conf.icon className="w-3.5 h-3.5 opacity-70" />
                      {conf.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-8 text-muted-foreground hover:text-destructive self-end sm:self-auto"
            onClick={() => setInputValue("")}
            disabled={!inputValue}
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            Clear
          </Button>
        </div>

        {/* Input Form */}
        <CardContent className="p-6 flex-1 flex flex-col gap-6">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase font-bold">
              From
            </Label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger className="w-full h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {UNIT_CATEGORIES[category].units.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase font-bold">
              Value
            </Label>
            <Input
              type="number"
              className="h-14 text-2xl font-mono bg-muted/20"
              placeholder="0"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>

          {/* {category === "typography" && (
            <div className="mt-auto pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Settings2 size={14} className="text-muted-foreground" />
                <Label className="text-xs font-medium">
                  Base Font Size (px)
                </Label>
              </div>
              <Input
                type="number"
                value={baseSize}
                onChange={(e) => setBaseSize(Number(e.target.value))}
                className="h-9 w-24"
              />
            </div>
          )} */}
        </CardContent>
      </Card>

      {/* ================= RIGHT: OUTPUT ================= */}
      <Card className="flex flex-col h-full overflow-hidden bg-card p-0 border-border/60 shadow-md">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-muted/30 min-h-[60px]">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSwap}
              className="h-8 text-xs gap-2"
            >
              <ArrowRightLeft size={14} />
              Swap
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <CopyButton
              text={outputValue}
              className="h-8 w-8 hover:bg-background hover:text-primary transition-colors"
            />
          </div>
        </div>

        {/* Output Form */}
        <CardContent className="p-6 flex-1 flex flex-col gap-6 bg-muted/10">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase font-bold">
              To
            </Label>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger className="w-full h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {UNIT_CATEGORIES[category].units.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 flex-1 flex flex-col">
            <Label className="text-xs text-muted-foreground uppercase font-bold">
              Result
            </Label>
            <div className="flex-1 flex items-center justify-center min-h-[120px] rounded-lg border border-border bg-background p-4 relative group">
              {outputValue ? (
                <span className="text-4xl md:text-5xl font-bold tracking-tight text-primary break-all">
                  {outputValue}
                </span>
              ) : (
                <span className="text-muted-foreground/30 text-sm italic">
                  Enter value to convert
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
