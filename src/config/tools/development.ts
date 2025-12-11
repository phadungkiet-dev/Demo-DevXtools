import { ToolConfig } from "@/config/tools";
import {
  Fingerprint,
  Regex,
  Timer,
  Keyboard,
  Clock,
  Database,
} from "lucide-react";

export const developmentTools: ToolConfig[] = [
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
];
