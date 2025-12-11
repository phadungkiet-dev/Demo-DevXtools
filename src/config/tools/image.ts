import { ToolConfig } from "@/config/tools";
import { ImageIcon, QrCode } from "lucide-react";

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
];
