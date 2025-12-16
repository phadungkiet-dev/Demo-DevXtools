import { ToolConfig } from "@/config/tools";
// Import Icons: เลือกไอคอนที่สื่อความหมายชัดเจนและดู Modern
import {
  Binary, // Number Base
  Ruler, // Unit Converter (PX/REM)
  FileJson, // JSON
  Settings2, // YAML (สื่อถึง Config)
  Code2, // XML
  Table, // CSV (สื่อถึงตาราง)
  CalendarClock, // Date Time
  Landmark, // Roman (สื่อถึงยุคโรมัน/ประวัติศาสตร์)
  Shield, // Base64 (สื่อถึงการ Encode/Security)
  Palette, // Color
  Globe, // Unicode (สื่อถึงภาษาโลก)
  FileCode2, // Markdown to HTML
} from "lucide-react";

/**
 * Converters Tools Configuration
 * ---------------------------------------
 * เครื่องมือสำหรับแปลงข้อมูลจากรูปแบบหนึ่งไปสู่อีกรูปแบบหนึ่ง
 * ครอบคลุมทั้ง Data Format, Units, Time และ Encoding
 */
export const convertersTools: ToolConfig[] = [
  // --- 1. Number & Math ---
  {
    slug: "number-base-converter",
    title: "Number Base Converter",
    // Description: เน้นการคุยกับ Machine
    description:
      "Speak the machine's language. Translate numbers effortlessly between Binary, Octal, Decimal, and Hex.",
    category: "converters",
    icon: Binary, // 0101 สื่อถึงฐานข้อมูล
    keywords: [
      "base",
      "converter",
      "binary",
      "hex",
      "octal",
      "decimal",
      "radix",
      "math",
    ],
  },
  {
    slug: "roman-numeral-converter",
    title: "Roman Numeral Converter",
    // Description: เล่นคำว่า Ancient/Modern
    description:
      "Decode history. Convert modern integers to Ancient Roman numerals and vice versa instantly.",
    category: "converters",
    icon: Landmark, // ใช้รูปวิหารโรมัน สื่อถึง Roman ได้เท่และตรงจุด
    keywords: ["roman", "numeral", "latin", "history", "math", "year"],
  },

  // --- 2. Web & Design Units ---
  {
    slug: "unit-converter",
    title: "PX to REM Converter",
    // Description: เน้นเรื่อง Responsive Design
    description:
      "Pixel-perfect scaling. Calculate PX to REM values based on your root font-size for responsive typography.",
    category: "converters",
    icon: Ruler, // ไม้บรรทัด สื่อถึงการวัดขนาดที่แม่นยำ
    keywords: [
      "px",
      "rem",
      "em",
      "css",
      "responsive",
      "typography",
      "calculator",
    ],
  },
  {
    slug: "color-format-converter",
    title: "Color Format Converter",
    description:
      "Design system synchronizer. Translate colors between HEX, RGB, HSL, and CMYK for print and web.",
    category: "converters",
    icon: Palette, // ถาดสี Classic และเข้าใจง่ายที่สุด
    keywords: ["color", "hex", "rgb", "hsl", "cmyk", "picker", "design"],
  },

  // --- 3. Data Formats (Universal) ---
  {
    slug: "json-converter",
    title: "JSON Converter",
    description:
      "Data interoperability solved. Transform JSON datasets into YAML, XML, or CSV formats in a snap.",
    category: "converters",
    icon: FileJson,
    keywords: ["json", "yaml", "xml", "csv", "format", "transform", "api"],
  },
  {
    slug: "yaml-converter",
    title: "YAML Converter",
    description:
      "DevOps ready. Convert YAML configurations to JSON or other formats without syntax headaches.",
    category: "converters",
    icon: Settings2, // Slider settings สื่อถึง Config file (YAML มักใช้กับ Config)
    keywords: [
      "yaml",
      "json",
      "converter",
      "parser",
      "devops",
      "config",
      "kubernetes",
    ],
  },
  {
    slug: "xml-converter",
    title: "XML Converter",
    description:
      "Legacy meets modern. Parse XML structures into clean JSON, YAML, or CSV data for modern apps.",
    category: "converters",
    icon: Code2, // Tag < > สื่อถึง XML
    keywords: ["xml", "json", "yaml", "csv", "soap", "rss", "data"],
  },
  {
    slug: "csv-converter",
    title: "CSV Converter",
    description:
      "Spreadsheet liberation. Turn CSV rows into structured JSON or XML arrays for your applications.",
    category: "converters",
    icon: Table, // ตาราง สื่อถึง Excel/CSV ได้ดีกว่าไอคอนไฟล์ทั่วไป
    keywords: ["csv", "json", "yaml", "xml", "excel", "spreadsheet", "export"],
  },

  // --- 4. Encoding & System ---
  {
    slug: "date-time-converter",
    title: "Date-Time Converter",
    description:
      "Time travel made easy. Convert ISO strings, Unix timestamps, and human-readable dates instantly.",
    category: "converters",
    icon: CalendarClock,
    keywords: ["time", "date", "timestamp", "unix", "iso", "epoch", "duration"],
    isNew: true,
  },
  {
    slug: "base64-string-converter",
    title: "Base64 Encoder/Decoder",
    description:
      "Safe transport. Encode text to Base64 strings or decode them back for secure data handling.",
    category: "converters",
    icon: Shield, // โล่ + Code สื่อถึงข้อมูลที่ถูก Encode/Protect ไว้
    keywords: ["base64", "encode", "decode", "binary", "string", "hash"],
    isNew: true,
  },
  {
    slug: "text-to-unicode",
    title: "Text to Unicode",
    description:
      "Global compatibility. Escape text into Unicode sequences for universal system display.",
    category: "converters",
    icon: Globe, // ลูกโลก สื่อถึงภาษาและความเป็นสากล (Unicode)
    keywords: ["unicode", "escape", "utf-8", "ascii", "text", "characters"],
    isNew: true,
  },
  {
    slug: "markdown-to-html",
    title: "Markdown to HTML",
    description:
      "Web publisher. Compile Markdown syntax into raw, semantic HTML code for your blog or docs.",
    category: "converters",
    icon: FileCode2, // ไฟล์ที่มี Code สื่อถึงการแปลง Code ไฟล์
    keywords: ["markdown", "html", "compiler", "parser", "md", "preview"],
    isNew: true,
  },
];
