import { ToolConfig } from "@/config/tools";
import {
  CaseUpper, // Case Converter
  ScrollText, // Lorem Ipsum
  ChartNoAxesCombined, // Word Counter (Stats)
  GitCompare, // Diff Viewer
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
    isNew: true,
  },
];
