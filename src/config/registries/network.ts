import dynamic from "next/dynamic";
import { ComponentType } from "react";

export const networkRegistry: Record<string, ComponentType> = {
  "ipv4-subnet-calculator": dynamic(() =>
    import("@/components/tools/network/ipv4-subnet-calculator").then(
      (mod) => mod.IPv4SubnetCalculator
    )
  ),
};
