import { ToolConfig } from "@/config/tools";
import { Binary, Scale, FileCode } from "lucide-react";

export const convertersTools: ToolConfig[] = [
  {
    slug: "number-base-converter",
    title: "Number Base Converter",
    description:
      "Convert numbers between Binary, Octal, Decimal, and Hexadecimal.",
    category: "converters",
    icon: Binary,
    keywords: ["base", "converter", "binary", "hex", "octal", "decimal"],
    isNew: true,
  },
  {
    slug: "unit-converter",
    title: "Unit Converter (PX/REM)",
    description:
      "Convert Pixels to REM and vice-versa based on root font-size.",
    category: "converters",
    icon: Scale,
    keywords: ["px", "rem", "convert", "css", "unit"],
    isNew: true,
  },
  {
    slug: "yaml-json-converter",
    title: "YAML <-> JSON Converter",
    description: "Convert data between YAML and JSON formats automatically.",
    category: "converters", // หรือจะใส่ devops ก็ได้ครับ
    icon: FileCode, // อย่าลืม import FileCode จาก lucide-react ด้านบนด้วยนะครับ
    keywords: ["yaml", "json", "converter", "parser", "devops", "config"],
    isNew: true,
  },
];
