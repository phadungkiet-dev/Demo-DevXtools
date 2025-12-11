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
};
