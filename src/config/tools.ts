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
  Code,
  Clock,
  Keyboard,
  Hash,
  FileCode,
  KeyRound,
  ArrowRightLeft,
  Binary,
  Database,
  SquarePen,
  Scale,
  Terminal,
  Calculator,
  Globe,
  Tag,
  Monitor,
  Box,
  Fingerprint,
  Regex,
  Timer,
  FileJson,
  FileDiff,
} from "lucide-react";

// --- Types ---

export type ToolCategory =
  | "text"
  | "image"
  | "development"
  | "css"
  | "security"
  | "converters"
  | "devops"
  | "web";

export interface ToolConfig {
  slug: string;
  title: string;
  description: string;
  category: ToolCategory;
  icon: LucideIcon;
  isNew?: boolean;
  keywords?: string[];
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
  { id: "converters", label: "Converters", icon: ArrowRightLeft },
  { id: "devops", label: "DevOps", icon: Terminal },
  { id: "web", label: "Web & SEO", icon: Globe },
];

export const allTools: ToolConfig[] = [
  // --- Text Tools ---
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
    icon: FileJson,
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
  {
    slug: "diff-viewer",
    title: "Text Diff Viewer",
    description: "Compare two texts and highlight differences line by line.",
    category: "text",
    icon: FileDiff,
    keywords: ["diff", "compare", "git", "text", "check"],
  },
  {
    slug: "base64-converter",
    title: "Base64 Encoder",
    description: "Encode and decode text to Base64 format.",
    category: "text",
    icon: Hash,
    keywords: ["base64", "encode", "decode", "binary"],
  },
  {
    slug: "markdown-previewer",
    title: "Markdown Previewer",
    description: "Write and preview Markdown content in real-time.",
    category: "text",
    icon: SquarePen,
    keywords: ["markdown", "preview", "editor", "md", "text"],
    isNew: true,
  },
  {
    slug: "html-entity",
    title: "HTML Entity Encoder/Decoder",
    description: "Convert characters to HTML entities and vice versa.",
    category: "text",
    icon: Code,
    keywords: ["html", "entity", "encode", "decode", "xml", "escape"],
    isNew: true,
  },

  // --- Development Tools ---
  {
    slug: "uuid-generator",
    title: "UUID Generator",
    description: "Generate random UUIDs v4.",
    category: "development",
    icon: Fingerprint,
    keywords: ["uuid", "generator", "guid", "v4"],
  },
  {
    slug: "regex-tester",
    title: "Regex Tester",
    description:
      "Test regular expressions against text with real-time highlighting.",
    category: "development",
    icon: Regex,
    keywords: ["regex", "regexp", "test", "match", "pattern"],
  },
  {
    slug: "cron-parser",
    title: "Cron Parser",
    description:
      "Parse cron expressions into human-readable text and schedule.",
    category: "development",
    icon: Timer,
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
    slug: "timestamp-converter",
    title: "Timestamp Converter",
    description: "Convert Unix timestamp to human-readable date.",
    category: "development",
    icon: Clock,
    keywords: ["timestamp", "unix", "date", "converter"],
  },
  {
    slug: "sql-formatter",
    title: "SQL Formatter",
    description: "Format and beautify SQL queries (Basic).",
    category: "development",
    icon: Database,
    keywords: ["sql", "formatter", "database", "query", "beautify"],
    isNew: true,
  },

  // --- Image Tools ---
  {
    slug: "svg-to-png",
    title: "SVG to PNG Converter",
    description:
      "Convert SVG vector files to PNG images directly in your browser.",
    category: "image",
    icon: ImageIcon,
    keywords: ["svg", "png", "convert", "image", "vector", "raster"],
    isNew: true,
  },
  {
    slug: "qr-generator",
    title: "QR Code Generator",
    description: "Generate customizable QR codes for URLs or text.",
    category: "image",
    icon: QrCode,
    keywords: ["qr", "code", "generator", "barcode", "2d"],
  },

  // --- CSS Tools ---
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

  // --- Security Tools ---
  {
    slug: "jwt-decoder",
    title: "JWT Decoder",
    description: "Decode JSON Web Tokens to view header and payload data.",
    category: "security",
    icon: ShieldCheck,
    keywords: ["jwt", "token", "auth", "decode", "base64"],
  },
  {
    slug: "hash-generator",
    title: "Hash Generator",
    description: "Generate MD5, SHA-1, SHA-256 hashes.",
    category: "security",
    icon: Hash,
    keywords: ["hash", "md5", "sha", "generator"],
  },
  {
    slug: "password-generator",
    title: "Password Generator",
    description: "Generate strong, secure, and random passwords.",
    category: "security",
    icon: KeyRound,
    keywords: ["password", "generator", "security", "random"],
    isNew: true,
  },

  // --- Converters ---
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

  // --- DevOps ---
  {
    slug: "chmod-calculator",
    title: "Chmod Calculator",
    description:
      "Calculate Linux file permissions in octal (755) and symbolic formats.",
    category: "devops",
    icon: Calculator,
    keywords: ["chmod", "permission", "linux", "calculator"],
    isNew: true,
  },

  // --- Web & SEO ---
  {
    slug: "meta-tag-generator",
    title: "Meta Tag Generator",
    description:
      "Generate SEO meta tags and Open Graph preview for your website.",
    category: "web",
    icon: Tag,
    keywords: ["seo", "meta", "html", "open graph", "social"],
    isNew: true,
  },
  {
    slug: "user-agent-parser",
    title: "User Agent Parser",
    description:
      "Identify browser, operating system, and device from a user agent string.",
    category: "web",
    icon: Monitor,
    keywords: ["user agent", "ua", "browser", "os", "device"],
    isNew: true,
  },
];

// --- Helpers ---

export const getToolsByCategory = (category: ToolCategory) => {
  return allTools.filter((tool) => tool.category === category);
};

export const getToolBySlug = (slug: string) => {
  return allTools.find((tool) => tool.slug === slug);
};
