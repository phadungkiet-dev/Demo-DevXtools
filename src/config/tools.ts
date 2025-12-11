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
  { id: "network", label: "Network", icon: Network },
];

export const toolsByCategory = toolsMap;
export const allTools: ToolConfig[] = allToolsConfig;

// --- Helpers ---

// export const getToolsByCategory = (category: ToolCategory) => {
//   return allTools.filter((tool) => tool.category === category);
// };

export const getToolsByCategory = (category: ToolCategory) =>
  toolsByCategory[category] || [];

export const getToolBySlug = (slug: string) =>
  allTools.find((tool) => tool.slug === slug);
