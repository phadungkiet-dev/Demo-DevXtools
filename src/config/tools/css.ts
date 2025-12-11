import { ToolConfig } from "@/config/tools";
import { Box, Palette } from "lucide-react";

export const cssTools: ToolConfig[] = [
  {
    slug: "box-shadow",
    title: "CSS Box Shadow",
    description: "Create and preview CSS box-shadows visually.",
    category: "css",
    icon: Box,
    keywords: ["css", "shadow", "generator", "design", "ui"],
  },
  {
    slug: "gradient-generator",
    title: "CSS Gradient",
    description: "Generate linear and radial CSS gradients visually.",
    category: "css",
    icon: Palette,
    keywords: ["css", "gradient", "linear", "radial", "color"],
  },
  {
    slug: "color-converter",
    title: "Color Converter",
    description: "Convert HEX to RGB, HSL and preview colors.",
    category: "css",
    icon: Palette,
    keywords: ["color", "converter", "hex", "rgb", "hsl"],
  },
];
