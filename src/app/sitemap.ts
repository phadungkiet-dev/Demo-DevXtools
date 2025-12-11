import { MetadataRoute } from "next";
import { allTools } from "@/config/tools";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  ? `https://${process.env.NEXT_PUBLIC_APP_URL}`
  : "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  // หน้าหลักและหน้าตั้งค่า
  const routes = ["", "/settings"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // สร้าง URL สำหรับทุกเครื่องมือ
  const toolRoutes = allTools.map((tool) => ({
    url: `${baseUrl}/tools/${tool.category}/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...routes, ...toolRoutes];
}
