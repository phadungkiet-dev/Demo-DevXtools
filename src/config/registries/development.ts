import dynamic from "next/dynamic";
import { ComponentType } from "react";

export const developmentRegistry: Record<string, ComponentType> = {
  "uuid-generator": dynamic(() =>
    import("@/components/tools/development/uuid-generator").then(
      (mod) => mod.UuidGenerator
    )
  ),
  "timestamp-converter": dynamic(() =>
    import("@/components/tools/development/timestamp-converter").then(
      (mod) => mod.TimestampConverter
    )
  ),
  "regex-tester": dynamic(() =>
    import("@/components/tools/development/regex-tester").then(
      (mod) => mod.RegexTester
    )
  ),
  "keycode-info": dynamic(() =>
    import("@/components/tools/development/keycode-info").then(
      (mod) => mod.KeycodeInfo
    )
  ),
  "cron-parser": dynamic(() =>
    import("@/components/tools/development/cron-parser").then(
      (mod) => mod.CronParser
    )
  ),
  "sql-formatter": dynamic(() =>
    import("@/components/tools/development/sql-formatter").then(
      (mod) => mod.SqlFormatter
    )
  ),
  "json-to-ts": dynamic(() =>
    import("@/components/tools/development/json-to-ts").then(
      (mod) => mod.JsonToTsConverter
    )
  ),
};
