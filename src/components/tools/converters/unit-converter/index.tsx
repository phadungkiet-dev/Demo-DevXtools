"use client";

// =============================================================================
// Imports
// =============================================================================
import { useState, useEffect } from "react";
// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Shared Components
import {
  CopyButton,
  ClearButton,
  SwapButton,
} from "@/components/shared/buttons";

// Logic & Libs
import {
  UNIT_CATEGORIES,
  CategoryType,
  convertUnitValue,
} from "@/lib/unit-converter";

// =============================================================================
// Main Component
// =============================================================================
export function UnitConverter() {
  // --- State Management ---
  const [category, setCategory] = useState<CategoryType>("length");
  const [fromUnit, setFromUnit] = useState<string>("m");
  const [toUnit, setToUnit] = useState<string>("ft");
  const [inputValue, setInputValue] = useState<string>("");
  const [outputValue, setOutputValue] = useState<string>("");

  // --- Handlers ---

  const handleCategoryChange = (newCategory: CategoryType) => {
    setCategory(newCategory);
    const units = UNIT_CATEGORIES[newCategory].units;
    setFromUnit(units[0].id);
    setToUnit(units[1]?.id || units[0].id);
    setInputValue("");
    setOutputValue("");
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setInputValue(outputValue);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!inputValue || isNaN(parseFloat(inputValue))) {
        setOutputValue("");
        return;
      }
      const val = parseFloat(inputValue);
      const result = convertUnitValue(val, fromUnit, toUnit, category);
      const formatted = Number(result.toPrecision(7)).toString();
      setOutputValue(formatted);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, fromUnit, toUnit, category]);

  return (
    // ✅ Main Layout: Flex Container
    <div className="flex flex-col lg:flex-row items-stretch lg:h-[550px] gap-4 transition-all animate-in fade-in duration-500">
      {/* ================= 1. LEFT CARD (INPUT) ================= */}
      <Card className="flex-1 flex flex-col overflow-hidden bg-card p-0 border-border/60 shadow-md">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-border/40 bg-muted/30 min-h-[60px] gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="p-1.5 bg-primary/10 rounded-md text-primary shrink-0">
              {(() => {
                const Icon = UNIT_CATEGORIES[category].icon;
                return <Icon size={16} />;
              })()}
            </div>
            <Select
              value={category}
              onValueChange={(v) => handleCategoryChange(v as CategoryType)}
            >
              <SelectTrigger className="h-8 min-w-[140px] bg-background text-xs font-medium border-border/60 focus:ring-offset-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(
                  Object.entries(UNIT_CATEGORIES) as unknown as [
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
          <div className="self-end sm:self-auto">
            <ClearButton
              onClear={() => setInputValue("")}
              disabled={!inputValue}
            />
          </div>
        </div>

        {/* Input Content */}
        <CardContent className="p-6 flex-1 flex flex-col gap-6">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase font-bold">
              From Unit
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
              className="h-14 text-2xl font-mono bg-muted/20 focus-visible:ring-primary/20"
              placeholder="0"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* ================= 2. MIDDLE (SWAP BUTTON) ================= */}
      {/* ✅ Flex Center Item: วางอยู่ตรงกลางระหว่างการ์ดซ้ายขวา */}
      <div className="flex items-center justify-center shrink-0">
        <SwapButton
          onSwap={handleSwap}
          className="h-10 w-10 border shadow-md bg-background hover:bg-muted text-primary"
        />
      </div>

      {/* ================= 3. RIGHT CARD (OUTPUT) ================= */}
      <Card className="flex-1 flex flex-col overflow-hidden bg-card p-0 border-border/60 shadow-md">
        {/* Toolbar */}
        <div className="flex items-center justify-end px-6 py-4 border-b border-border/40 bg-muted/30 min-h-[60px]">
          <CopyButton
            text={outputValue}
            className="h-8 w-8 hover:bg-background hover:text-primary transition-colors"
          />
        </div>

        {/* Output Content */}
        <CardContent className="p-6 flex-1 flex flex-col gap-6 bg-muted/10">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase font-bold">
              To Unit
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
            <div className="flex-1 flex items-center justify-center min-h-[120px] rounded-lg border border-border bg-background p-4 relative group transition-colors">
              {outputValue ? (
                <span className="text-4xl md:text-5xl font-bold tracking-tight text-primary break-all animate-in zoom-in-95 duration-200">
                  {outputValue}
                </span>
              ) : (
                <span className="text-muted-foreground/30 text-sm italic select-none">
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
