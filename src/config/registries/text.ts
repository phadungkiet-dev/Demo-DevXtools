import dynamic from "next/dynamic";
import { ComponentType } from "react";

export const textRegistry: Record<string, ComponentType> = {
  "case-converter": dynamic(() =>
    import("@/components/tools/text/case-converter").then(
      (mod) => mod.CaseConverter
    )
  ),
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
  "diff-viewer": dynamic(() =>
    import("@/components/tools/text/diff-viewer").then((mod) => mod.DiffViewer)
  ),
};
