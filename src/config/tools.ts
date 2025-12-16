import {
  // Icons for Categories
  Type, // Text
  Image as ImageIcon, // Image
  Palette, // CSS
  Braces, // Development (JSON/Code)
  Fingerprint, // Security
  ArrowLeftRight, // Converters
  Container, // DevOps (Docker/Container feel)
  Rocket, // Web/SEO (Performance)
  Network, // Network
  LucideIcon,
} from "lucide-react";

// Import รวม Tools ทั้งหมด (ต้องมั่นใจว่าไฟล์ tools/index.ts มีอยู่จริงและ export ถูกต้อง)
import { toolsMap, allToolsConfig } from "./tools/index";

// =============================================================================
// 1. Type Definitions
// =============================================================================

/**
 * ToolCategory: Union Type ของหมวดหมู่ทั้งหมด
 * ใช้สำหรับทำ Type Checking เวลาเรียกใช้ key
 */
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

/**
 * ToolConfig: โครงสร้างข้อมูลของ "เครื่องมือแต่ละตัว"
 */
export interface ToolConfig {
  slug: string; // URL slug (e.g., 'json-formatter')
  title: string; // ชื่อที่แสดงผล
  description: string; // คำอธิบายสั้นๆ
  category: ToolCategory; // หมวดหมู่สังกัด
  icon: LucideIcon; // ไอคอนประจำเครื่องมือ
  isNew?: boolean; // Badge 'New'
  keywords?: string[]; // คำค้นหา (SEO/Search bar)
  hidden?: boolean; // ✅ ซ่อนเครื่องมือนี้ชั่วคราว
}

/**
 * CategoryConfig: โครงสร้างข้อมูลของ "หมวดหมู่"
 */
export interface CategoryConfig {
  id: ToolCategory;
  label: string; // ชื่อหมวดหมู่ที่แสดง (Ex: 'Text Studio')
  icon: LucideIcon; // ไอคอนหมวดหมู่
  description?: string; // คำโปรยหมวดหมู่
  hidden?: boolean; // ✅ Feature: ซ่อนหมวดหมู่นี้ทั้งยวง (Lift off)
}

// =============================================================================
// 2. Categories Configuration
// =============================================================================

const rawCategories: CategoryConfig[] = [
  {
    id: "text",
    label: "Text Studio",
    icon: Type,
    description: "Format, clean, and manipulate text strings effortlessly.",
    hidden: false, // เปิดใช้งานปกติ
  },
  {
    id: "converters",
    label: "Converter Hub",
    icon: ArrowLeftRight,
    description: "Universal translation for data, units, and encodings.",
    hidden: false,
  },
  {
    id: "development",
    label: "Dev & JSON",
    icon: Braces,
    description: "Essential helpers for debugging and code formatting.",
    hidden: true,
  },
  {
    id: "css",
    label: "CSS & UI Lab",
    icon: Palette,
    description: "Generate gradients, shadows, and perfect UI styles.",
    hidden: true,
  },
  {
    id: "image",
    label: "Image Atelier",
    icon: ImageIcon,
    description: "Resize, crop, and optimize assets for the modern web.",
    hidden: true,
  },
  {
    id: "security",
    label: "Security Vault",
    icon: Fingerprint, // ใช้ Fingerprint ดู Modern กว่า Shield
    description: "Generate strong secrets, hashes, and secure tokens.",
    hidden: true,
  },
  {
    id: "web",
    label: "Web & SEO",
    icon: Rocket, // ใช้ Rocket สื่อถึง Performance
    description: "Analyze and boost your web application performance.",
    hidden: true, // 🔒 ตัวอย่างการซ่อน: ยังไม่เสร็จ ปิดไว้ก่อน
  },
  {
    id: "devops",
    label: "DevOps Center",
    icon: Container, // สื่อถึง Docker/K8s
    description: "Utilities for system admins and deployment pipelines.",
    hidden: true, // 🔒 ซ่อนไว้ก่อน
  },
  {
    id: "network",
    label: "Network Tools",
    icon: Network,
    description: "IP calculators, subnetting, and connectivity checks.",
    hidden: true, // 🔒 ซ่อนไว้ก่อน
  },
];

// =============================================================================
// 3. Exported Data (Filtered)
// =============================================================================

// ✅ Export เฉพาะ Category ที่ไม่ถูกซ่อน (hidden !== true)
export const toolCategories = rawCategories.filter((c) => !c.hidden);

// Map เครื่องมือเข้ากับ ID หมวดหมู่
export const toolsByCategory = toolsMap;

// ✅ Export เฉพาะ Tools ที่:
// 1. ตัวมันเองไม่ hidden
// 2. Category ต้นสังกัดของมันต้องไม่ hidden (ป้องกัน Tools หลุดมาตอนปิดหมวดหมู่)
export const allTools: ToolConfig[] = allToolsConfig.filter((t) => {
  const parentCategory = rawCategories.find((c) => c.id === t.category);
  const isCategoryHidden = parentCategory?.hidden === true;
  return !t.hidden && !isCategoryHidden;
});

// =============================================================================
// 4. Helper Functions
// =============================================================================

/**
 * ดึง Tools ทั้งหมดใน Category นั้นๆ (ที่ยังเปิดใช้งานอยู่)
 */
export const getToolsByCategory = (category: ToolCategory) => {
  const tools = toolsByCategory[category] || [];
  // กรองอีกรอบเพื่อความชัวร์
  return tools.filter((tool) => !tool.hidden);
};

/**
 * ค้นหา Tool ด้วย Slug (ใช้สำหรับหน้า Dynamic Route)
 */
export const getToolBySlug = (slug: string) =>
  allTools.find((tool) => tool.slug === slug);
