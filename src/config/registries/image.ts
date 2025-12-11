import dynamic from "next/dynamic";
import { ComponentType } from "react";

export const imageRegistry: Record<string, ComponentType> = {
  "svg-to-png": dynamic(() =>
    import("@/components/tools/image/svg-to-png").then(
      (mod) => mod.SvgToPngConverter
    )
  ),
  "qr-generator": dynamic(() =>
    import("@/components/tools/image/qr-generator").then(
      (mod) => mod.QrGenerator
    )
  ),
  "aspect-ratio-calculator": dynamic(() =>
    import("@/components/tools/image/aspect-ratio-calculator").then(
      (mod) => mod.AspectRatioCalculator
    )
  ),
};
