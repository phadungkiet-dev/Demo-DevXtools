import { MetadataRoute } from "next";

// Base URL Configuration
const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  ? `https://${process.env.NEXT_PUBLIC_APP_URL}`
  : process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3030";

export default function robots(): MetadataRoute.Robots {
  return {
    // Rules Definition
    rules: {
      userAgent: "*", // ใช้กับ Bot ทุกเจ้า (Googlebot, Bingbot, etc.)
      allow: "/", // อนุญาตให้เข้าถึงได้ทุกหน้า (Root path ลงไป)
      // Best Practice: ควรกัน Bot ออกจาก API Routes เพื่อประหยัด Crawl Budget และความปลอดภัย
      disallow: ["/api/", "/_next/", "/static/"],
    },
    // Sitemap Link
    sitemap: `${baseUrl}/sitemap.xml`, // บอกพิกัดแผนที่เว็บไซต์
  };
}
