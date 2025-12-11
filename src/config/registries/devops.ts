import dynamic from "next/dynamic";
import { ComponentType } from "react";

export const devopsRegistry: Record<string, ComponentType> = {
  "chmod-calculator": dynamic(() =>
    import("@/components/tools/devops/chmod-calculator").then(
      (mod) => mod.ChmodCalculator
    )
  ),
};
