import { ToolConfig } from "@/config/tools";
import { Network, Calculator } from "lucide-react";

export const networkTools: ToolConfig[] = [
  {
    slug: "ipv4-subnet-calculator",
    title: "IPv4 Subnet Calculator",
    description: "Calculate network range, netmask, and usable IPs from CIDR.",
    category: "network",
    icon: Calculator,
    keywords: ["ipv4", "subnet", "cidr", "network", "mask"],
    isNew: true,
  },
];
