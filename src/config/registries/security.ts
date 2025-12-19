import dynamic from "next/dynamic";
import { ComponentType } from "react";

export const securityRegistry: Record<string, ComponentType> = {
  "hash-generator-security": dynamic(() =>
    import("@/components/tools/security/hash-generator-security").then(
      (mod) => mod.HashGenerator
    )
  ),
  "password-generator": dynamic(() =>
    import("@/components/tools/security/password-generator").then(
      (mod) => mod.PasswordGenerator
    )
  ),
  "rsa-key-generator": dynamic(() =>
    import("@/components/tools/security/rsa-key-generator").then(
      (mod) => mod.RsaKeyGenerator
    )
  ),
};
