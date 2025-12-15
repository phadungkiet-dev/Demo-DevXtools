import {
  FileText,
  ImageIcon,
  Code2,
  Settings,
  ShieldCheck,
  ArrowRightLeft,
  Terminal,
  Globe,
  LucideIcon,
  Network,
} from "lucide-react";
import { toolsMap, allToolsConfig } from "./tools/index"; // Import ตัวรวมที่เราเพิ่งทำ

// --- Types --- (เก็บ Types ไว้ที่เดิม หรือจะย้ายไป types.d.ts ก็ได้)
export type ToolCategory =
  | "text"
  | "image"
  | "development"
  | "css"
  | "security"
  | "converters"
  | "devops"
  | "web"
  | "network";

export interface ToolConfig {
  slug: string;
  title: string;
  description: string;
  category: ToolCategory;
  icon: LucideIcon;
  isNew?: boolean;
  keywords?: string[];
  hidden?: boolean;
}

export interface CategoryConfig {
  id: ToolCategory;
  label: string;
  icon: LucideIcon;
  description?: string;
}

// --- Configuration ---

export const toolCategories: CategoryConfig[] = [
  {
    id: "text",
    label: "Text & Content",
    icon: FileText,
    description: "Format, generate, and manipulate text strings easily.",
  },
  {
    id: "image",
    label: "Image Tools",
    icon: ImageIcon,
    description: "Resize, crop, and convert images for the web.",
  },
  {
    id: "css",
    label: "CSS Tools",
    icon: Code2,
    description: "Generators for gradients, shadows, and modern CSS effects.",
  },
  {
    id: "development",
    label: "Development",
    icon: Settings,
    description: "Helpers for JSON, code formatting, and debugging.",
  },
  {
    id: "security",
    label: "Security & Auth",
    icon: ShieldCheck,
    description: "Generate passwords, hashes, and manage keys securely.",
  },
  {
    id: "converters",
    label: "Converters",
    icon: ArrowRightLeft,
    description: "Convert between different data formats and units.",
  },
  {
    id: "devops",
    label: "DevOps",
    icon: Terminal,
    description: "Tools for system administration and deployment tasks.",
  },
  {
    id: "web",
    label: "Web & SEO",
    icon: Globe,
    description: "Optimize and analyze web content for better performance.",
  },
  {
    id: "network",
    label: "Network",
    icon: Network,
    description: "Networking utilities, subnet calculators, and IP tools.",
  },
];

export const toolsByCategory = toolsMap;
export const allTools: ToolConfig[] = allToolsConfig.filter((t) => !t.hidden);

// --- Helpers ---
export const getToolsByCategory = (category: ToolCategory) =>
  (toolsByCategory[category] || []).filter((tool) => !tool.hidden);

export const getToolBySlug = (slug: string) =>
  allTools.find((tool) => tool.slug === slug);
