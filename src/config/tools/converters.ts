import { ToolConfig } from "@/config/tools";
import {
  FileJson,
  FileCode,
  FileSpreadsheet,
  FileType,
  CalendarClock,
  Binary,
  Hash,
  Palette,
  Type,
  Languages,
  Code2,
  Scale,
} from "lucide-react";

export const convertersTools: ToolConfig[] = [
  {
    slug: "number-base-converter",
    title: "Number Base Converter",
    description:
      "Convert numbers between Binary, Octal, Decimal, and Hexadecimal.",
    category: "converters",
    icon: Binary,
    keywords: ["base", "converter", "binary", "hex", "octal", "decimal"],
  },
  {
    slug: "unit-converter",
    title: "Unit Converter (PX/REM)",
    description:
      "Convert Pixels to REM and vice-versa based on root font-size.",
    category: "converters",
    icon: Scale,
    keywords: ["px", "rem", "convert", "css", "unit"],
  },
  // --- Data Formats (Universal) ---
  {
    slug: "json-converter",
    title: "JSON Converter",
    description: "Convert JSON to YAML, XML, or CSV.",
    category: "converters",
    icon: FileJson,
    keywords: ["json", "yaml", "xml", "csv", "format"],
  },
  {
    slug: "yaml-converter",
    title: "YAML Converter",
    description: "Convert YAML to JSON, XML, or CSV.",
    category: "converters",
    icon: FileCode,
    keywords: ["yaml", "json", "converter", "parser", "devops", "config"],
  },
  {
    slug: "xml-converter",
    title: "XML Converter",
    description: "Convert XML to JSON, YAML, or CSV.",
    category: "converters",
    icon: Code2,
    keywords: ["xml", "json", "yaml", "csv", "soap"],
  },
  {
    slug: "csv-converter",
    title: "CSV Converter",
    description: "Convert CSV to JSON, YAML, or XML.",
    category: "converters",
    icon: FileSpreadsheet,
    keywords: ["csv", "json", "yaml", "xml", "excel"],
  },

  // --- Specific Converters ---
  {
    slug: "date-time-converter",
    title: "Date-Time Converter",
    description:
      "Convert between ISO, Unix Timestamp, and Human-readable formats.",
    category: "converters",
    icon: CalendarClock,
  },
  {
    slug: "roman-numeral-converter",
    title: "Roman Numeral Converter",
    description: "Convert numbers to Roman numerals and vice versa.",
    category: "converters",
    icon: Type,
  },
  {
    slug: "base64-string-converter",
    title: "Base64 String Encoder/Decoder",
    description: "Encode text to Base64 or decode Base64 strings.",
    category: "converters",
    icon: Hash,
  },
  {
    slug: "color-format-converter",
    title: "Color Format Converter",
    description: "Convert colors between HEX, RGB, HSL, and CMYK.",
    category: "converters",
    icon: Palette,
  },
  {
    slug: "text-to-ascii",
    title: "Text to ASCII Binary",
    description: "Convert text to 8-bit binary ASCII code.",
    category: "converters",
    icon: Binary,
  },
  {
    slug: "text-to-unicode",
    title: "Text to Unicode",
    description: "Convert text to Unicode escape sequences.",
    category: "converters",
    icon: Languages,
  },
  {
    slug: "markdown-to-html",
    title: "Markdown to HTML",
    description: "Convert Markdown syntax to raw HTML.",
    category: "converters",
    icon: FileType,
  },
];
