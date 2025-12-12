// Optimized Import: ดึงเฉพาะฟังก์ชันที่ใช้ (ช่วยเรื่อง Tree Shaking)
import {
  camelCase,
  kebabCase,
  snakeCase,
  startCase,
  upperFirst,
  lowerCase,
} from "lodash";

export const transformers = {
  // --- Basic ---
  lowercase: (text: string) => text.toLowerCase(),
  uppercase: (text: string) => text.toUpperCase(),

  // --- Code Cases ---
  camelCase: (text: string) => camelCase(text),
  pascalCase: (text: string) => upperFirst(camelCase(text)),
  snakeCase: (text: string) => snakeCase(text),
  kebabCase: (text: string) => kebabCase(text),
  constantCase: (text: string) => snakeCase(text).toUpperCase(),

  // --- New Additions ---
  dotCase: (text: string) => lowerCase(text).replace(/ /g, "."), // dev.tool.x
  pathCase: (text: string) => lowerCase(text).replace(/ /g, "/"), // dev/tool/x

  // --- Text Formats ---
  sentenceCase: (text: string) => upperFirst(text.toLowerCase()),
  titleCase: (text: string) => startCase(camelCase(text)),

  // Custom Logic
  alternatingCase: (text: string) =>
    text
      .split("")
      .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
      .join(""),
};

// Derived Type (Automatic Type Safety)
export type CaseType = keyof typeof transformers;

// UI Mapping
export const caseLabels: Record<CaseType, string> = {
  lowercase: "lowercase",
  uppercase: "UPPERCASE",
  camelCase: "camelCase",
  pascalCase: "PascalCase",
  snakeCase: "snake_case",
  kebabCase: "kebab-case",
  constantCase: "CONSTANT_CASE",
  dotCase: "dot.case",
  pathCase: "path/case",
  sentenceCase: "Sentence case",
  titleCase: "Title Case",
  alternatingCase: "aLtErNaTiNg cAsE",
};
