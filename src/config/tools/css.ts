import { ToolConfig } from "@/config/tools";
import { Box, Palette, Shapes, Cloud, Type } from "lucide-react";

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
  {
    slug: "glassmorphism-generator",
    title: "Glassmorphism Generator",
    description: "Create beautiful CSS frosted glass effects instantly.",
    category: "css",
    icon: Palette, // import Palette
    keywords: ["css", "glass", "blur", "backdrop", "ui"],
    isNew: true,
  },
  {
    slug: "blob-generator",
    title: "Blob Shape Generator",
    description: "Create organic blob shapes for background designs.",
    category: "css",
    icon: Shapes,
    keywords: ["blob", "svg", "shape", "organic", "design"],
    isNew: true,
  },
  {
    slug: "neumorphism-generator",
    title: "Neumorphism Generator",
    description: "Generate Soft UI (Neumorphism) CSS code.",
    category: "css",
    icon: Cloud,
    keywords: ["neumorphism", "soft ui", "css", "shadow", "design"],
    isNew: true,
  },
  {
    slug: "gradient-text-generator",
    title: "Gradient Text Generator",
    description: "Create stunning gradient text effects for modern websites.",
    category: "css",
    icon: Type,
    keywords: ["css", "gradient", "text", "typography", "generator"],
    isNew: true,
  },
  {
    slug: "claymorphism-generator",
    title: "Claymorphism Generator",
    description: "Generate 3D Clay-style UI components (Fluffy 3D look).",
    category: "css",
    icon: Box,
    keywords: ["css", "clay", "3d", "soft", "ui", "generator"],
    isNew: true,
  },
];
