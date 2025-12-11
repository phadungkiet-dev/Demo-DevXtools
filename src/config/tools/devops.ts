import { ToolConfig } from "@/config/tools";
import { Calculator } from "lucide-react";

export const devopsTools: ToolConfig[] = [
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
];
