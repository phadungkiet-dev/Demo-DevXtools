import dynamic from "next/dynamic";
import { ComponentType } from "react";

export const textRegistry: Record<string, ComponentType> = {
  "lorem-ipsum": dynamic(() =>
    import("@/components/tools/text/lorem-ipsum").then(
      (mod) => mod.LoremIpsumGenerator
    )
  ),
  "word-counter": dynamic(() =>
    import("@/components/tools/text/word-counter").then(
      (mod) => mod.WordCounter
    )
  ),
  "case-converter": dynamic(() =>
    import("@/components/tools/text/case-converter").then(
      (mod) => mod.CaseConverter
    )
  ),
  "json-formatter": dynamic(() =>
    import("@/components/tools/text/json-formatter").then(
      (mod) => mod.JsonFormatter
    )
  ),
  "url-encoder": dynamic(() =>
    import("@/components/tools/text/url-encoder").then((mod) => mod.UrlEncoder)
  ),
  "base64-converter": dynamic(() =>
    import("@/components/tools/text/base64-converter").then(
      (mod) => mod.Base64Converter
    )
  ),
  "diff-viewer": dynamic(() =>
    import("@/components/tools/text/diff-viewer").then((mod) => mod.DiffViewer)
  ),
  "markdown-previewer": dynamic(() =>
    import("@/components/tools/text/markdown-previewer").then(
      (mod) => mod.MarkdownPreviewer
    )
  ),
  "html-entity": dynamic(() =>
    import("@/components/tools/text/html-entity").then(
      (mod) => mod.HtmlEntityConverter
    )
  ),
};
