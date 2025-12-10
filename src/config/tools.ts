import {
  Type,
  FileText,
  ImageIcon,
  Code2,
  Settings,
  LucideIcon,
  Braces,
  Link as LinkIcon,
  AlignLeft,
  ShieldCheck,
  Layers,
  GitCompare,
  QrCode,
  Palette,
  Regex, // ถ้าไม่มีให้ใช้ Code หรือ Terminal แทน
  Code, // Fallback
  Clock,
  Keyboard,
  Hash,
  FileCode,
} from "lucide-react";

// --- Types ---

export type ToolCategory =
  | "text"
  | "image"
  | "development"
  | "css"
  | "security";

export interface ToolConfig {
  slug: string; // URL path part (e.g., 'case-converter')
  title: string; // Display title
  description: string; // SEO & Card description
  category: ToolCategory; // For grouping in Sidebar/Dashboard
  icon: LucideIcon; // Icon component
  isNew?: boolean; // Badge 'New'
  keywords?: string[]; // For search indexing (Command Palette)
}

export interface CategoryConfig {
  id: ToolCategory;
  label: string;
  icon: LucideIcon;
}

// --- Configuration ---

export const toolCategories: CategoryConfig[] = [
  { id: "text", label: "Text & Content", icon: FileText },
  { id: "image", label: "Image Tools", icon: ImageIcon },
  { id: "css", label: "CSS Tools", icon: Code2 },
  { id: "development", label: "Development", icon: Settings },
  { id: "security", label: "Security & Auth", icon: ShieldCheck },
];

export const allTools: ToolConfig[] = [
  // Text Tools
  {
    slug: "case-converter",
    title: "Case Converter",
    description:
      "Convert text between camelCase, snake_case, PascalCase, and more.",
    category: "text",
    icon: Type,
    keywords: ["camel", "snake", "pascal", "kebab", "upper", "lower"],
  },
  {
    slug: "lorem-ipsum",
    title: "Lorem Ipsum Generator",
    description: "Generate placeholder text for your designs.",
    category: "text",
    icon: FileText,
    isNew: true,
  },
  {
    slug: "json-formatter",
    title: "JSON Formatter",
    description: "Validate, format, and minify JSON data.",
    category: "text",
    icon: Braces,
    keywords: ["json", "pretty", "minify", "parser"],
  },
  {
    slug: "url-encoder",
    title: "URL Encoder / Decoder",
    description: "Encode text to URL-safe format or decode it back.",
    category: "text",
    icon: LinkIcon,
    keywords: ["url", "encode", "decode", "uri", "component"],
  },
  {
    slug: "word-counter",
    title: "Word Counter",
    description:
      "Count words, characters, sentences, and estimate reading time.",
    category: "text",
    icon: AlignLeft,
    keywords: ["count", "stats", "calculator", "writing", "seo"],
  },
  // Future tools (Example)
  {
    slug: "uuid-generator",
    title: "UUID Generator",
    description: "Generate random UUIDs v4.",
    category: "development",
    icon: Code2,
  },
  {
    slug: "jwt-decoder",
    title: "JWT Decoder",
    description: "Decode JSON Web Tokens to view header and payload data.",
    category: "security",
    icon: ShieldCheck,
    keywords: ["jwt", "token", "auth", "decode", "base64"],
  },
  {
    slug: "svg-to-png",
    title: "SVG to PNG Converter",
    description:
      "Convert SVG vector files to PNG images directly in your browser.",
    category: "image", // <--- หมวดใหม่
    icon: ImageIcon,
    keywords: ["svg", "png", "convert", "image", "vector", "raster"],
    isNew: true, // ใส่ป้าย New เท่ๆ
  },
  {
    slug: "box-shadow-generator",
    title: "CSS Box Shadow",
    description: "Create and preview CSS box-shadows visually.",
    category: "css", // หมวด CSS
    icon: Layers,
    keywords: ["css", "shadow", "generator", "design", "ui"],
  },
  {
    slug: "diff-viewer",
    title: "Text Diff Viewer",
    description: "Compare two texts and highlight differences line by line.",
    category: "text",
    icon: GitCompare,
    keywords: ["diff", "compare", "git", "text", "check"],
  },
  {
    slug: "qr-generator",
    title: "QR Code Generator",
    description: "Generate customizable QR codes for URLs or text.",
    category: "image", // ใส่ในหมวด Image
    icon: QrCode,
    keywords: ["qr", "code", "generator", "barcode", "2d"],
  },
  {
    slug: "gradient-generator",
    title: "CSS Gradient",
    description: "Generate linear and radial CSS gradients visually.",
    category: "css",
    icon: Palette,
    keywords: ["css", "gradient", "linear", "radial", "color", "background"],
  },
  {
    slug: "regex-tester",
    title: "Regex Tester",
    description:
      "Test regular expressions against text with real-time highlighting.",
    category: "development", // จัดอยู่ในหมวด Development
    icon: Code, // หรือ Regex ถ้ามี
    keywords: ["regex", "regexp", "test", "match", "pattern"],
  },
  {
    slug: "cron-parser",
    title: "Cron Parser",
    description:
      "Parse cron expressions into human-readable text and schedule.",
    category: "development",
    icon: Clock,
    keywords: ["cron", "schedule", "parser", "time", "interval"],
  },
  {
    slug: "keycode-info",
    title: "Keycode Info",
    description: "Visualizer for keyboard events, codes, and keys.",
    category: "development",
    icon: Keyboard,
    keywords: ["key", "code", "keyboard", "event", "javascript"],
  },
  {
    slug: "hash-generator",
    title: "Hash Generator",
    description: "Generate MD5, SHA-1, SHA-256 hashes.",
    category: "security",
    icon: Hash,
  },
  {
    slug: "color-converter",
    title: "Color Converter",
    description: "Convert HEX to RGB, HSL and preview colors.",
    category: "css",
    icon: Palette,
  },
  {
    slug: "base64-converter",
    title: "Base64 Encoder",
    description: "Encode and decode text to Base64 format.",
    category: "text",
    icon: FileCode,
  },
  {
    slug: "timestamp-converter",
    title: "Timestamp Converter",
    description: "Convert Unix timestamp to human-readable date.",
    category: "development",
    icon: Clock,
  },
];

// --- Helpers ---

export const getToolsByCategory = (category: ToolCategory) => {
  return allTools.filter((tool) => tool.category === category);
};

export const getToolBySlug = (slug: string) => {
  return allTools.find((tool) => tool.slug === slug);
};
