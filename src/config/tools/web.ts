import { ToolConfig } from "@/config/tools";
import { Tag, Monitor } from "lucide-react";

export const webTools: ToolConfig[] = [
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
