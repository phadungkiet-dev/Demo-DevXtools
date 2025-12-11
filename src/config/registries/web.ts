import dynamic from "next/dynamic";
import { ComponentType } from "react";

export const webRegistry: Record<string, ComponentType> = {
  "meta-tag-generator": dynamic(() =>
    import("@/components/tools/web/meta-tag-generator").then(
      (mod) => mod.MetaTagGenerator
    )
  ),
  "user-agent-parser": dynamic(() =>
    import("@/components/tools/web/user-agent-parser").then(
      (mod) => mod.UserAgentParser
    )
  ),
};
