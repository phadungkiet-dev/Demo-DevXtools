"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/tools/favorite-button";

interface ToolHeaderProps {
  title: string;
  description: string;
  categoryLabel: string;
  slug?: string;
}

export function ToolHeader({
  title,
  description,
  categoryLabel,
  slug,
}: ToolHeaderProps) {
  return (
    <div className="mb-8 space-y-4">
      {/* Breadcrumb: ใช้ <nav> เพื่อ Semantic ที่ดี */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-sm text-muted-foreground"
      >
        {/* ใช้ asChild เพื่อไม่ให้เกิด <a> ซ้อน <button> */}
        <Button
          variant="link"
          className="h-auto p-0 text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Home
          </Link>
        </Button>
        <span aria-hidden="true" className="text-muted-foreground/60">
          /
        </span>
        <span className="font-medium text-foreground">{categoryLabel}</span>
      </nav>

      {/* Main Content */}
      <div className="space-y-2">
        {/* Flex container สำหรับ Title และ ปุ่มดาว */}
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>

          {/* ปุ่มดาว: ใช้ shrink-0 กันบีบ และ items-center ของ parent จัดการตำแหน่งแนวตั้งให้แล้ว */}
          {slug && <FavoriteButton slug={slug} className="shrink-0" />}
        </div>

        {/* Description: จำกัดความกว้าง (max-w) ให้อ่านง่ายบนจอใหญ่ */}
        <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
