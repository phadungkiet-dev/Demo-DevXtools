import { ToolConfig } from "@/config/tools";
import { ImageIcon, QrCode, Scaling } from "lucide-react";

export const imageTools: ToolConfig[] = [
  {
    slug: "svg-to-png",
    title: "SVG to PNG Converter",
    description:
      "Convert SVG vector files to PNG images directly in your browser.",
    category: "image",
    icon: ImageIcon,
    keywords: ["svg", "png", "convert", "image", "vector", "raster"],
    isNew: true,
  },
  {
    slug: "qr-generator",
    title: "QR Code Generator",
    description: "Generate customizable QR codes for URLs or text.",
    category: "image",
    icon: QrCode,
    keywords: ["qr", "code", "generator", "barcode", "2d"],
  },
  {
    slug: "aspect-ratio-calculator",
    title: "Aspect Ratio Calculator",
    description: "Calculate image aspect ratios and dimensions.",
    category: "image",
    icon: Scaling, // import Scaling (หรือใช้ Ratio ถ้ามี, ถ้าไม่มีใช้ Box)
    keywords: ["ratio", "aspect", "calculator", "image", "dimension"],
    isNew: true,
  },
];
