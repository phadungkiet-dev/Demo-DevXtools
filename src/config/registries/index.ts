import { ComponentType } from "react";
import { textRegistry } from "./text";
import { developmentRegistry } from "./development";
import { imageRegistry } from "./image";
import { cssRegistry } from "./css";
import { securityRegistry } from "./security";
import { convertersRegistry } from "./converters";
import { devopsRegistry } from "./devops";
import { webRegistry } from "./web";

// รวมทุก Registry เป็น Object เดียว
export const toolRegistry: Record<string, ComponentType> = {
  ...textRegistry,
  ...developmentRegistry,
  ...imageRegistry,
  ...cssRegistry,
  ...securityRegistry,
  ...convertersRegistry,
  ...devopsRegistry,
  ...webRegistry,
};
