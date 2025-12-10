import _ from "lodash";

export const transformers = {
  lowercase: (text: string) => text.toLowerCase(),
  uppercase: (text: string) => text.toUpperCase(),
  camelCase: (text: string) => _.camelCase(text),
  pascalCase: (text: string) => _.upperFirst(_.camelCase(text)),
  snakeCase: (text: string) => _.snakeCase(text),
  kebabCase: (text: string) => _.kebabCase(text),
  constantCase: (text: string) => _.snakeCase(text).toUpperCase(),
  sentenceCase: (text: string) => _.upperFirst(text.toLowerCase()),
  titleCase: (text: string) => _.startCase(_.camelCase(text)), // Adjust based on preference
  alternatingCase: (text: string) =>
    text
      .split("")
      .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
      .join(""),
};

export type CaseType = keyof typeof transformers;

export const caseLabels: Record<CaseType, string> = {
  lowercase: "lowercase",
  uppercase: "UPPERCASE",
  camelCase: "camelCase",
  pascalCase: "PascalCase",
  snakeCase: "snake_case",
  kebabCase: "kebab-case",
  constantCase: "CONSTANT_CASE",
  sentenceCase: "Sentence case",
  titleCase: "Title Case",
  alternatingCase: "aLtErNaTiNg cAsE",
};
