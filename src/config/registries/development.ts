import dynamic from "next/dynamic";
import { ComponentType } from "react";

export const developmentRegistry: Record<string, ComponentType> = {
  "cron-parser": dynamic(() =>
    import("@/components/tools/development/cron-parser").then(
      (mod) => mod.CronParser
    )
  ),
  "regex-tester": dynamic(() =>
    import("@/components/tools/development/regex-tester").then(
      (mod) => mod.RegexTester
    )
  ),
  "sql-formatter": dynamic(() =>
    import("@/components/tools/development/sql-formatter").then(
      (mod) => mod.SqlFormatter
    )
  ),
  "uuid-generator": dynamic(() =>
    import("@/components/tools/development/uuid-generator").then(
      (mod) => mod.UuidGenerator
    )
  ),
  "jwt-decoder": dynamic(() =>
    import("@/components/tools/development/jwt-decoder").then(
      (mod) => mod.JwtDecoder
    )
  ),
  // --------------------------------------------------------

  "timestamp-converter": dynamic(() =>
    import("@/components/tools/development/timestamp-converter").then(
      (mod) => mod.TimestampConverter
    )
  ),

  "keycode-info": dynamic(() =>
    import("@/components/tools/development/keycode-info").then(
      (mod) => mod.KeycodeInfo
    )
  ),

  "json-to-ts": dynamic(() =>
    import("@/components/tools/development/json-to-ts").then(
      (mod) => mod.JsonToTsConverter
    )
  ),
};
