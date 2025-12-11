import { ToolConfig } from "@/config/tools";
import { ShieldCheck, Hash, KeyRound } from "lucide-react";

export const securityTools: ToolConfig[] = [
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
];
