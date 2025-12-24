"use client";

// Imports ===============
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

// Icon
import { RulerDimensionLine } from "lucide-react";

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
import { cn } from "@/lib/utils";

// Main Component =========================
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

  // Render
  return (
    <div
      className={cn(
        // Layout
        "flex flex-col lg:flex-row items-stretch lg:h-[550px] gap-6",
        // Animation Core
        "animate-in fade-in slide-in-from-bottom-4",
        // Animation Timing
        "duration-600 ease-out",
        // Animation Staging
        "delay-200 fill-mode-backwards"
      )}
    >
      {/* ================= LEFT CARD (INPUT) ================= */}
      <Card
        className={cn(
          // Grid & Flex Layout
          "flex-1 flex flex-col overflow-hidden",
          // Visuals
          "bg-card border-border/60 shadow-md",
          // Spacing
          "p-0 gap-2 sm:gap-4",
          // Animation & Interaction
          "transition-all hover:shadow-lg"
        )}
      >
        {/* Toolbar */}
        <div
          className={cn(
            // Layout & Direction
            "flex flex-col sm:flex-row justify-between items-center",
            // Sizing & Spacing
            "min-h-[60px] px-6 py-4 md:py-2 gap-4",
            // Visuals
            "bg-muted/40 border-b border-border/60"
          )}
        >
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* p-2 bg-primary/10 rounded-md text-primary shadow-sm */}
            <div className="p-2 bg-primary/10 rounded-md text-primary shadow-sm">
              {(() => {
                const Icon = UNIT_CATEGORIES[category].icon;
                return <Icon size={16} />;
              })()}
            </div>
            <Select
              value={category}
              onValueChange={(v) => handleCategoryChange(v as CategoryType)}
            >
              <SelectTrigger className="w-full h-10 bg-background/50 border-border/60 focus:ring-primary/20">
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
                      <conf.icon className="w-3 h-3 opacity-70" />
                      {conf.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div
            className={cn(
              // Layout & Sizing
              "flex flex-warp items-center gap-1",
              "w-full sm:w-auto",
              // Alignment
              "justify-center sm:justify-end"
            )}
          >
            <ClearButton
              onClear={() => setInputValue("")}
              disabled={!inputValue}
            />
          </div>
        </div>

        {/* Input Content */}
        <CardContent className="p-4 flex flex-col h-full gap-6">
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
              From Unit
            </Label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger className="w-full h-10 bg-background/50 border-border/60 focus:ring-primary/20">
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
            <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
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

      {/* ================= MIDDLE (SWAP BUTTON) ================= */}
      {/* Flex Center Item: วางอยู่ตรงกลางระหว่างการ์ดซ้ายขวา */}
      <div className="flex items-center justify-center shrink-0">
        <SwapButton
          onSwap={handleSwap}
          className="h-10 w-10 border shadow-md bg-background hover:bg-muted text-primary"
        />
      </div>

      {/* ================= RIGHT CARD (OUTPUT) ================= */}
      <Card
        className={cn(
          // Grid & Flex Layout
          "flex-1 flex flex-col overflow-hidden",
          // Visuals
          "bg-card border-border/60 shadow-md",
          // Spacing
          "p-0 gap-2 sm:gap-4",
          // Animation & Interaction
          "transition-all hover:shadow-lg"
        )}
      >
        {/* Toolbar */}
        <div
          className={cn(
            // Layout & Direction
            "flex flex-col sm:flex-row justify-between",
            // Sizing & Spacing
            "min-h-[60px] px-6 py-4 md:py-2 gap-4",
            // Visuals
            "bg-muted/40 border-b border-border/60"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-md text-primary shadow-sm">
              <RulerDimensionLine size={16} />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              Result
            </span>
          </div>

          <div
            className={cn(
              // Layout & Sizing
              "flex flex-warp items-center gap-1",
              "w-full sm:w-auto",
              // Alignment
              "justify-center sm:justify-end"
            )}
          >
            <CopyButton
              text={outputValue}
              className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10"
            />
          </div>
        </div>

        {/* Output Content */}
        <CardContent className="p-4 flex flex-col h-full gap-6">
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
              To Unit
            </Label>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger className="w-full h-10 bg-background/50 border-border/60 focus:ring-primary/20">
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
            <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
              Result
            </Label>
            <div
              className={cn(
                // Layout & Positioning
                "relative flex flex-1 items-center justify-center",
                // Sizing & Spacing
                "min-h-[120px] p-4",
                // Visuals
                "bg-background border border-border rounded-lg",
                // Interaction
                "group transition-colors"
              )}
            >
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
