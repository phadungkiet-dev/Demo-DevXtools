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
  "json-converter": dynamic(() =>
    import("@/components/tools/converters/json-converter").then(
      (mod) => mod.JsonConverter
    )
  ),
  "yaml-converter": dynamic(() =>
    import("@/components/tools/converters/yaml-converter").then(
      (mod) => mod.YamlConverter
    )
  ),
  "xml-converter": dynamic(() =>
    import("@/components/tools/converters/xml-converter").then(
      (mod) => mod.XmlConverter
    )
  ),
  "csv-converter": dynamic(() =>
    import("@/components/tools/converters/csv-converter").then(
      (mod) => mod.CsvConverter
    )
  ),
  "date-time-converter": dynamic(() =>
    import("@/components/tools/converters/date-time-converter").then(
      (mod) => mod.DateTimeConverter
    )
  ),
    "roman-numeral-converter": dynamic(() =>
    import("@/components/tools/converters/roman-numeral-converter").then(
      (mod) => mod.RomanNumeralConverter
    )
  ),
};
