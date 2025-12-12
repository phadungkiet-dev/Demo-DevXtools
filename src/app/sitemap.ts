import { MetadataRoute } from "next";
import { allTools } from "@/config/tools"; // ดึงข้อมูล Tools ทั้งหมดมา

export default function sitemap(): MetadataRoute.Sitemap {
  // Base URL Logic: (ควรใช้ Logic เดียวกับ robots.ts เพื่อความถูกต้องบน Vercel)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `https://${process.env.NEXT_PUBLIC_APP_URL}`
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3030";

  // Static Routes Definition
  // แยกออกมาเป็น Object ชัดเจน อ่านง่ายกว่า array strings
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1.0, // Homepage = สำคัญที่สุด
    },
    {
      url: `${baseUrl}/settings`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3, // Settings แทบไม่ต้อง Index ก็ได้ ให้ความสำคัญต่ำ
    },
  ];

  // Dynamic Tool Routes
  const toolRoutes = allTools.map((tool) => ({
    url: `${baseUrl}/tools/${tool.category}/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8, // หน้า Tools สำคัญรองลงมา
  }));

  return [...staticRoutes, ...toolRoutes];
}
