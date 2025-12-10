"use client";

import { use, useEffect } from "react";
import { useRecentTools } from "@/hooks/useRecentTools";
import { notFound } from "next/navigation";
import { getToolBySlug, toolCategories } from "@/config/tools";
import { ToolHeader } from "@/components/shared/tool-header";
import { Separator } from "@/components/ui/separator";

// --- Imports: Text Tools ---
import { LoremIpsumGenerator } from "@/components/tools/text/lorem-ipsum";
import { WordCounter } from "@/components/tools/text/word-counter";
import { CaseConverter } from "@/components/tools/text/case-converter";
import { JsonFormatter } from "@/components/tools/text/json-formatter";
import { UrlEncoder } from "@/components/tools/text/url-encoder";
import { Base64Converter } from "@/components/tools/text/base64-converter";
import { DiffViewer } from "@/components/tools/text/diff-viewer";
import { MarkdownPreviewer } from "@/components/tools/text/markdown-previewer";
import { HtmlEntityConverter } from "@/components/tools/text/html-entity";

// --- Imports: Development Tools ---
import { UuidGenerator } from "@/components/tools/development/uuid-generator";
import { TimestampConverter } from "@/components/tools/development/timestamp-converter";
import { RegexTester } from "@/components/tools/development/regex-tester";
import { KeycodeInfo } from "@/components/tools/development/keycode-info";
import { CronParser } from "@/components/tools/development/cron-parser";
import { SqlFormatter } from "@/components/tools/development/sql-formatter";

// --- Imports: Image Tools ---
import { SvgToPngConverter } from "@/components/tools/image/svg-to-png";
import { QrGenerator } from "@/components/tools/image/qr-generator";

// --- Imports: CSS Tools ---
import { BoxShadowGenerator } from "@/components/tools/css/box-shadow";
import { GradientGenerator } from "@/components/tools/css/gradient-generator";
import { ColorConverter } from "@/components/tools/css/color-converter";

// --- Imports: Security Tools ---
import { JwtDecoder } from "@/components/tools/security/jwt-decoder";
import { HashGenerator } from "@/components/tools/security/hash-generator";
import { PasswordGenerator } from "@/components/tools/security/password-generator";

// --- Imports: Converters Tools ---
import { NumberBaseConverter } from "@/components/tools/converters/number-base-converter";
import { UnitConverter } from "@/components/tools/converters/unit-converter";

// --- Imports: DevOps Tools ---
import { ChmodCalculator } from "@/components/tools/devops/chmod-calculator";

// --- Imports: Web Tools ---
import { MetaTagGenerator } from "@/components/tools/web/meta-tag-generator";
import { UserAgentParser } from "@/components/tools/web/user-agent-parser";

import { FavoriteButton } from "@/components/tools/favorite-button";

interface PageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export default function ToolPage({ params }: PageProps) {
  // ใช้ hook use() เพื่อ unwrap params ตามมาตรฐาน Next.js ล่าสุด
  const resolvedParams = use(params);
  const { category, slug } = resolvedParams;
  const { addRecent } = useRecentTools();

  const tool = getToolBySlug(slug);

  // Update Page Title
  useEffect(() => {
    if (tool) {
      document.title = `${tool.title} | DevToolX`;
      addRecent(tool.slug);
    }
  }, [tool, addRecent]);

  // 1. Validation: ถ้าไม่มี Tool หรือ Category ไม่ตรง ให้ 404
  if (!tool || tool.category !== category) {
    notFound();
  }

  const categoryConfig = toolCategories.find((c) => c.id === tool.category);

  // 2. Component Mapping Logic
  const renderToolComponent = () => {
    switch (tool.slug) {
      // --- Text ---
      case "lorem-ipsum":
        return <LoremIpsumGenerator />;
      case "word-counter":
        return <WordCounter />;
      case "case-converter":
        return <CaseConverter />;
      case "json-formatter":
        return <JsonFormatter />;
      case "url-encoder":
        return <UrlEncoder />;
      case "base64-converter":
        return <Base64Converter />;
      case "diff-viewer":
        return <DiffViewer />;
      case "markdown-previewer":
        return <MarkdownPreviewer />;
      case "html-entity":
        return <HtmlEntityConverter />;

      // --- Development ---
      case "uuid-generator":
        return <UuidGenerator />;
      case "timestamp-converter":
        return <TimestampConverter />;
      case "regex-tester":
        return <RegexTester />;
      case "keycode-info":
        return <KeycodeInfo />;
      case "cron-parser":
        return <CronParser />;
      case "sql-formatter":
        return <SqlFormatter />;

      // --- Image ---
      case "svg-to-png":
        return <SvgToPngConverter />;
      case "qr-generator":
        return <QrGenerator />;

      // --- CSS ---
      // หมายเหตุ: เช็ค slug ใน tools.ts ให้ตรง (box-shadow หรือ box-shadow-generator)
      case "box-shadow":
      case "box-shadow-generator":
        return <BoxShadowGenerator />;
      case "gradient-generator":
        return <GradientGenerator />;
      case "color-converter":
        return <ColorConverter />;

      // --- Security ---
      case "jwt-decoder":
        return <JwtDecoder />;
      case "hash-generator":
        return <HashGenerator />;
      case "password-generator":
        return <PasswordGenerator />;

      // --- Converters ---
      case "number-base-converter":
        return <NumberBaseConverter />;
      case "unit-converter":
        return <UnitConverter />;

      // --- DevOps ---
      case "chmod-calculator":
        return <ChmodCalculator />;

      // --- Web ---
      case "meta-tag-generator":
        return <MetaTagGenerator />;
      case "user-agent-parser":
        return <UserAgentParser />;

      default:
        return (
          <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
            <p>
              Component not found for slug:{" "}
              <span className="font-mono text-primary">{tool.slug}</span>
            </p>
            <p className="text-sm mt-2">
              Please check the route configuration in page.tsx
            </p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* 2. แก้ไข: ใช้ Props ให้ตรงกับ ToolHeader เดิม (ลบ icon, ใช้ categoryLabel) */}
      <ToolHeader
        title={tool.title}
        description={tool.description}
        categoryLabel={categoryConfig?.label || tool.category}
        slug={tool.slug}
      />

      <Separator className="my-6" />

      <div className="min-h-[400px]">{renderToolComponent()}</div>
    </div>
  );
}
