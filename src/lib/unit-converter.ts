import { Ruler, Weight, Thermometer, Type, LucideIcon } from "lucide-react";

// --- Types ---
export type CategoryType = "length" | "weight" | "temperature" | "typography";

export interface UnitDef {
  id: string;
  label: string;
  ratio: number;
}

export interface CategoryConfig {
  label: string;
  icon: LucideIcon;
  units: UnitDef[];
}

// --- Configuration ---
export const UNIT_CATEGORIES: Record<CategoryType, CategoryConfig> = {
  length: {
    label: "Length",
    icon: Ruler,
    units: [
      { id: "m", label: "Meter (m)", ratio: 1 },
      { id: "km", label: "Kilometer (km)", ratio: 1000 },
      { id: "cm", label: "Centimeter (cm)", ratio: 0.01 },
      { id: "mm", label: "Millimeter (mm)", ratio: 0.001 },
      { id: "in", label: "Inch (in)", ratio: 0.0254 },
      { id: "ft", label: "Foot (ft)", ratio: 0.3048 },
      { id: "yd", label: "Yard (yd)", ratio: 0.9144 },
      { id: "mi", label: "Mile (mi)", ratio: 1609.34 },
    ],
  },
  weight: {
    label: "Weight",
    icon: Weight,
    units: [
      { id: "g", label: "Gram (g)", ratio: 1 },
      { id: "kg", label: "Kilogram (kg)", ratio: 1000 },
      { id: "mg", label: "Milligram (mg)", ratio: 0.001 },
      { id: "lb", label: "Pound (lb)", ratio: 453.592 },
      { id: "oz", label: "Ounce (oz)", ratio: 28.3495 },
    ],
  },
  temperature: {
    label: "Temperature",
    icon: Thermometer,
    units: [
      { id: "c", label: "Celsius (°C)", ratio: 0 },
      { id: "f", label: "Fahrenheit (°F)", ratio: 0 },
      { id: "k", label: "Kelvin (K)", ratio: 0 },
    ],
  },
  typography: {
    label: "Typography",
    icon: Type,
    units: [
      { id: "px", label: "Pixels (px)", ratio: 0 },
      { id: "rem", label: "REM", ratio: 0 },
      { id: "em", label: "EM", ratio: 0 },
      { id: "pt", label: "Points (pt)", ratio: 0 },
    ],
  },
};

// --- Logic Function ---
export function convertUnitValue(
  value: number,
  fromUnit: string,
  toUnit: string,
  category: CategoryType,
  baseSize: number = 16
): number {
  // A. Temperature
  if (category === "temperature") {
    if (fromUnit === toUnit) return value;
    if (fromUnit === "c" && toUnit === "f") return (value * 9) / 5 + 32;
    if (fromUnit === "c" && toUnit === "k") return value + 273.15;
    if (fromUnit === "f" && toUnit === "c") return ((value - 32) * 5) / 9;
    if (fromUnit === "f" && toUnit === "k")
      return ((value - 32) * 5) / 9 + 273.15;
    if (fromUnit === "k" && toUnit === "c") return value - 273.15;
    if (fromUnit === "k" && toUnit === "f")
      return ((value - 273.15) * 9) / 5 + 32;
    return value;
  }

  // B. Typography
  if (category === "typography") {
    // Step 1: Normalize to PX
    let valInPx = value;
    if (fromUnit === "rem" || fromUnit === "em") valInPx = value * baseSize;
    else if (fromUnit === "pt") valInPx = value * (96 / 72);

    // Step 2: Convert PX to Target
    if (toUnit === "px") return valInPx;
    if (toUnit === "rem" || toUnit === "em") return valInPx / baseSize;
    if (toUnit === "pt") return valInPx * (72 / 96);
    return valInPx;
  }

  // C. Linear (Length, Weight)
  const units = UNIT_CATEGORIES[category].units;
  const fromRatio = units.find((u) => u.id === fromUnit)?.ratio || 1;
  const toRatio = units.find((u) => u.id === toUnit)?.ratio || 1;

  return (value * fromRatio) / toRatio;
}
