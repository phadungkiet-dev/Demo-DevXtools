import dynamic from "next/dynamic";
import { ComponentType } from "react";

export const cssRegistry: Record<string, ComponentType> = {
  "box-shadow": dynamic(() =>
    import("@/components/tools/css/box-shadow").then(
      (mod) => mod.BoxShadowGenerator
    )
  ),
  "box-shadow-generator": dynamic(() =>
    import("@/components/tools/css/box-shadow").then(
      (mod) => mod.BoxShadowGenerator
    )
  ), // Alias
  "gradient-generator": dynamic(() =>
    import("@/components/tools/css/gradient-generator").then(
      (mod) => mod.GradientGenerator
    )
  ),
  "color-converter": dynamic(() =>
    import("@/components/tools/css/color-converter").then(
      (mod) => mod.ColorConverter
    )
  ),
  "glassmorphism-generator": dynamic(() =>
    import("@/components/tools/css/glassmorphism-generator").then(
      (mod) => mod.GlassmorphismGenerator
    )
  ),
  "blob-generator": dynamic(() =>
    import("@/components/tools/css/blob-generator").then(
      (mod) => mod.BlobGenerator
    )
  ),
  "neumorphism-generator": dynamic(() =>
    import("@/components/tools/css/neumorphism-generator").then(
      (mod) => mod.NeumorphismGenerator
    )
  ),
  "gradient-text-generator": dynamic(() =>
    import("@/components/tools/css/gradient-text-generator").then(
      (mod) => mod.GradientTextGenerator
    )
  ),
  "claymorphism-generator": dynamic(() =>
    import("@/components/tools/css/claymorphism-generator").then(
      (mod) => mod.ClaymorphismGenerator
    )
  ),
};
