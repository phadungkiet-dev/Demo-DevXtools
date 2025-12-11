import dynamic from "next/dynamic";
import { ComponentType } from "react";

export const convertersRegistry: Record<string, ComponentType> = {
  "number-base-converter": dynamic(() =>
    import("@/components/tools/converters/number-base-converter").then(
      (mod) => mod.NumberBaseConverter
    )
  ),
  "unit-converter": dynamic(() =>
    import("@/components/tools/converters/unit-converter").then(
      (mod) => mod.UnitConverter
    )
  ),
  "yaml-json-converter": dynamic(() =>
    import("@/components/tools/converters/yaml-json-converter").then(
      (mod) => mod.YamlJsonConverter
    )
  ),
};
