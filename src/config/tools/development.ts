import { ToolConfig } from "@/config/tools";
import {
  Fingerprint,
  Regex,
  Timer,
  Keyboard,
  Clock,
  Database,
  Code2,
  ShieldCheck,
  Hash,
} from "lucide-react";

export const developmentTools: ToolConfig[] = [
  {
    slug: "cron-parser",
    title: "Cron Parser",
    description:
      "Parse and schedule cron expressions with human-readable descriptions.",
    category: "development",
    icon: Timer,
    keywords: ["cron", "schedule", "parser", "time", "linux", "job"],
  },
  {
    slug: "regex-tester",
    title: "Regex Tester",
    description:
      "Test regular expressions against text with real-time highlighting.",
    category: "development",
    icon: Regex,
    keywords: ["regex", "regexp", "test", "match", "pattern", "javascript"],
  },
  {
    slug: "sql-formatter",
    title: "SQL Formatter",
    description: "Beautify and format SQL queries for better readability.",
    category: "development",
    icon: Database,
    keywords: ["sql", "formatter", "database", "query", "mysql", "postgres"],
    isNew: true,
  },
  {
    slug: "uuid-generator",
    title: "UUID Generator",
    description: "Generate unique identifiers (UUID v4) for development.",
    category: "development",
    icon: Fingerprint,
    keywords: ["uuid", "generator", "guid", "v4", "unique", "id"],
  },
  {
    slug: "jwt-decoder",
    title: "JWT Decoder",
    description:
      "Decode and inspect JSON Web Token (JWT) headers and payloads.",
    category: "development",
    icon: ShieldCheck,
    keywords: ["jwt", "token", "auth", "decode", "base64", "security"],
  },
  {
    slug: "hash-generator",
    title: "Hash Generator",
    description:
      "Generate cryptographic hashes (SHA), HMAC signatures, and PBKDF2 keys.",
    category: "development",
    icon: Hash,
    keywords: [
      "hash",
      "crypto",
      "sha",
      "hmac",
      "pbkdf2",
      "digest",
      "security",
      "md5",
    ],
  },
  // --------------------------------------------------

  {
    slug: "keycode-info",
    title: "Keycode Info",
    description: "Visualizer for keyboard events, codes, and keys.",
    category: "development",
    icon: Keyboard,
    keywords: ["key", "code", "keyboard", "event", "javascript", "dom"],
    hidden: true,
  },
  {
    slug: "timestamp-converter",
    title: "Timestamp Converter",
    description: "Convert Unix timestamp to human-readable date and vice versa.",
    category: "development",
    icon: Clock,
    keywords: ["timestamp", "unix", "date", "time", "converter", "epoch"],
    hidden: true,
  },

  {
    slug: "json-to-ts",
    title: "JSON to TypeScript",
    description: "Convert JSON objects into TypeScript interfaces instantly.",
    category: "development",
    icon: Code2,
    keywords: ["json", "typescript", "interface", "type", "convert", "dts"],
    isNew: true,
    hidden: true,
  },
];
