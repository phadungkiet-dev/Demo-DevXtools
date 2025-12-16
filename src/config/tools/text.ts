import { ToolConfig } from "@/config/tools";
import {
  CaseUpper, // Case Converter
  ScrollText, // Lorem Ipsum
  ChartNoAxesCombined, // Word Counter (Stats)
  GitCompare, // Diff Viewer
  Braces, // JSON
  Link2, // URL
  Binary, // Base64
  NotebookPen, // Markdown
  Ampersand, // HTML Entity
} from "lucide-react";

/**
 * Text Tools Configuration
 * ---------------------------------------
 * รวมเครื่องมือจัดการข้อความและ String manipulation
 * เน้นเครื่องมือที่ Developer ต้องใช้บ่อยๆ ในการจัดการ Data
 */
export const textTools: ToolConfig[] = [
  // 1. Case Converter
  {
    slug: "case-converter",
    title: "Case Converter",
    // Description: เน้นผลลัพธ์ที่ได้ (Clean Code)
    description:
      "Master your variable naming. Instantly convert text between camelCase, snake_case, PascalCase, and more.",
    category: "text",
    icon: CaseUpper,
    keywords: [
      "camel",
      "snake",
      "pascal",
      "kebab",
      "screaming",
      "variable",
      "programming",
      "naming convention",
    ],
  },

  // 2. Lorem Ipsum Generator
  {
    slug: "lorem-ipsum",
    title: "Lorem Ipsum Generator",
    // Description: เน้นเรื่อง Design/Prototype
    description:
      "Need filler text fast? Generate customizable placeholder text for your UI layouts and prototypes.",
    category: "text",
    icon: ScrollText,
    keywords: [
      "dummy text",
      "placeholder",
      "design",
      "layout",
      "latin",
      "generator",
      "mockup",
    ],
  },

  // 3. Word Counter
  {
    slug: "word-counter",
    title: "Word Counter & Stats",
    // Description: เน้นการวิเคราะห์ (Analytics)
    description:
      "Analyze your content in real-time. Count words, characters, lines, and estimate reading time accurately.",
    category: "text",
    icon: ChartNoAxesCombined, // ใช้ Icon กราฟเพื่อสื่อถึง Stats
    keywords: [
      "count",
      "analytics",
      "statistics",
      "calculator",
      "writing",
      "seo",
      "density",
    ],
  },

  // 4. Text Diff Viewer
  {
    slug: "diff-viewer",
    title: "Text Diff Viewer",
    // Description: เน้นการเปรียบเทียบ (Compare)
    description:
      "Spot the difference. Compare two text files side-by-side and highlight changes line by line effortlessly.",
    category: "text",
    icon: GitCompare, // ใช้ Icon Git เพื่อสื่อถึงการ Compare code
    keywords: [
      "diff",
      "compare",
      "git",
      "version control",
      "checker",
      "text difference",
    ],
  },

  // 5. JSON Formatter
  {
    slug: "json-formatter",
    title: "JSON Formatter",
    description:
      "Tame your data. Validate, beautify, and minify complex JSON structures for better readability.",
    category: "text",
    icon: Braces, // ปีกกาคือสัญลักษณ์ของ JSON
    keywords: [
      "json",
      "pretty",
      "beautify",
      "minify",
      "parser",
      "validator",
      "lint",
    ],
    hidden: true, // ซ่อนไว้ก่อนตาม config เดิม
  },

  // 6. URL Encoder / Decoder
  {
    slug: "url-encoder",
    title: "URL Encoder / Decoder",
    description:
      "Web-safe strings made easy. Encode text to URL-safe formats or decode escaped characters instantly.",
    category: "text",
    icon: Link2,
    keywords: [
      "url",
      "encode",
      "decode",
      "uri",
      "percent-encoding",
      "web tools",
    ],
    hidden: true,
  },

  // 7. Base64 Converter
  {
    slug: "base64-converter",
    title: "Base64 Encoder",
    description:
      "Data translation tool. Convert text and files to Base64 strings and back for safe data transport.",
    category: "text",
    icon: Binary, // สื่อถึงข้อมูลดิบ / binary data
    keywords: ["base64", "encode", "decode", "binary", "ascii", "encryption"],
    hidden: true,
  },

  // 8. Markdown Previewer
  {
    slug: "markdown-previewer",
    title: "Markdown Previewer",
    description:
      "Write, preview, publish. A real-time Markdown editor to visualize your documentation instantly.",
    category: "text",
    icon: NotebookPen,
    keywords: [
      "markdown",
      "preview",
      "editor",
      "md",
      "readme",
      "documentation",
      "writer",
    ],
    isNew: true,
    hidden: true,
  },

  // 9. HTML Entity
  {
    slug: "html-entity",
    title: "HTML Entity Encoder",
    description:
      "Safe characters for web. Escape text into HTML entities or decode them back to readable content.",
    category: "text",
    icon: Ampersand, // สัญลักษณ์ & คือหัวใจของ HTML Entities
    keywords: [
      "html",
      "entity",
      "escape",
      "unescape",
      "xml",
      "special characters",
      "safe",
    ],
    isNew: true,
    hidden: true,
  },
];
