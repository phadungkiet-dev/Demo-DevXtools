import dynamic from "next/dynamic";
import { ComponentType } from "react";

export const securityRegistry: Record<string, ComponentType> = {
  "jwt-decoder": dynamic(() =>
    import("@/components/tools/security/jwt-decoder").then(
      (mod) => mod.JwtDecoder
    )
  ),
  "hash-generator": dynamic(() =>
    import("@/components/tools/security/hash-generator").then(
      (mod) => mod.HashGenerator
    )
  ),
  "password-generator": dynamic(() =>
    import("@/components/tools/security/password-generator").then(
      (mod) => mod.PasswordGenerator
    )
  ),
};
