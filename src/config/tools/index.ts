import { textTools } from "./text";
import { developmentTools } from "./development";
import { imageTools } from "./image";
import { cssTools } from "./css";
import { securityTools } from "./security";
import { convertersTools } from "./converters";
import { devopsTools } from "./devops";
import { webTools } from "./web";

export const toolsMap = {
  text: textTools,
  development: developmentTools,
  image: imageTools,
  css: cssTools,
  security: securityTools,
  converters: convertersTools,
  devops: devopsTools,
  web: webTools,
};

// console.log("toolsMap:", toolsMap);

export const allToolsConfig = Object.values(toolsMap).flat();
