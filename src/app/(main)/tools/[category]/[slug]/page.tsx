import { notFound } from "next/navigation";
import { getToolBySlug, toolCategories } from "@/config/tools";
import { ToolHeader } from "@/components/shared/tool-header";
import { Separator } from "@/components/ui/separator";

// ใน Phase 2 เราจะมาแก้ตรงนี้เพื่อ Import ตัว Component จริงๆ
// ตอนนี้ทำเป็น Registry แบบง่ายๆ ไปก่อน
import { CaseConverter } from "@/components/tools/text/case-converter"; // เดี๋ยวเราสร้างไฟล์นี้ใน Phase 2
import { LoremIpsumGenerator } from "@/components/tools/text/lorem-ipsum";
import { UuidGenerator } from "@/components/tools/development/uuid-generator";
import { JsonFormatter } from "@/components/tools/text/json-formatter";
import { UrlEncoder } from "@/components/tools/text/url-encoder";
import { WordCounter } from "@/components/tools/text/word-counter";
import { JwtDecoder } from "@/components/tools/security/jwt-decoder";

import { SvgToPngConverter } from "@/components/tools/image/svg-to-png";
import { BoxShadowGenerator } from "@/components/tools/css/box-shadow";
import { DiffViewer } from "@/components/tools/text/diff-viewer";
import { QrGenerator } from "@/components/tools/image/qr-generator";
import { GradientGenerator } from "@/components/tools/css/gradient-generator";

import { RegexTester } from "@/components/tools/development/regex-tester";
import { CronParser } from "@/components/tools/development/cron-parser";
import { KeycodeInfo } from "@/components/tools/development/keycode-info";

import { HashGenerator } from "@/components/tools/security/hash-generator";
import { ColorConverter } from "@/components/tools/css/color-converter";
import { Base64Converter } from "@/components/tools/text/base64-converter";
import { TimestampConverter } from "@/components/tools/development/timestamp-converter";

interface PageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export default async function ToolPage({ params }: PageProps) {
  const { category, slug } = await params;

  const tool = getToolBySlug(slug);

  // 1. Validation: ถ้าไม่มี Tool หรือ Category ไม่ตรง ให้ 404
  if (!tool || tool.category !== category) {
    notFound();
  }

  const categoryConfig = toolCategories.find((c) => c.id === tool.category);

  // 2. Component Mapping Logic (Factory Pattern)
  // ในอนาคตเมื่อมี 50 tools เราอาจจะใช้ lazy loading หรือ dynamic import ตรงนี้
  const renderToolComponent = () => {
    switch (tool.slug) {
      case "case-converter":
        return <CaseConverter />; // Uncomment เมื่อสร้างไฟล์เสร็จ
      case "lorem-ipsum":
        return <LoremIpsumGenerator />;
      case "json-formatter": // 👈 เพิ่มตรงนี้
        return <JsonFormatter />;

      case "url-encoder": // <--- เพิ่ม Case นี้
        return <UrlEncoder />;
      case "word-counter": // <--- เพิ่ม Case นี้
        return <WordCounter />;
      case "jwt-decoder": // <--- เพิ่ม Case นี้
        return <JwtDecoder />;
      case "svg-to-png": // <--- เพิ่ม Case นี้
        return <SvgToPngConverter />;
      case "box-shadow-generator": // <--- เพิ่ม Case นี้
        return <BoxShadowGenerator />;
      case "uuid-generator":
        return <UuidGenerator />;
      case "diff-viewer":
        return <DiffViewer />;
      case "qr-generator":
        return <QrGenerator />;
      case "gradient-generator": // <--- เพิ่ม Case นี้
        return <GradientGenerator />;
      case "regex-tester": // <--- เพิ่ม Case นี้
        return <RegexTester />;
      case "cron-parser": // <--- เพิ่ม Case นี้
        return <CronParser />;
      case "keycode-info": // <--- เพิ่ม Case นี้
        return <KeycodeInfo />;
      case "hash-generator":
        return <HashGenerator />;
      case "color-converter":
        return <ColorConverter />;
      case "base64-converter":
        return <Base64Converter />;
      case "timestamp-converter":
        return <TimestampConverter />;
      default:
        return (
          <div className="text-red-500">
            Component not found for {tool.slug}
          </div>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <ToolHeader
        title={tool.title}
        description={tool.description}
        categoryLabel={categoryConfig?.label || "Tool"}
      />

      <Separator className="my-6" />

      {/* Tool Workspace */}
      <div className="min-h-[400px]">{renderToolComponent()}</div>
    </div>
  );
}
