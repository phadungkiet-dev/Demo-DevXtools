import yaml from "js-yaml";
import Papa from "papaparse";
import { js2xml, xml2js } from "xml-js";

export type DataFormat = "json" | "yaml" | "xml" | "csv";

const parseInput = (input: string, format: DataFormat): unknown => {
  try {
    switch (format) {
      case "json":
        return JSON.parse(input);
      case "yaml":
        return yaml.load(input);
      case "xml":
        return xml2js(input, { compact: true });
      case "csv":
        // เพิ่ม skipEmptyLines เพื่อป้องกันแถวว่างทำ Error
        const result = Papa.parse(input, {
          header: true,
          skipEmptyLines: true,
        });
        if (result.errors.length > 0) {
          throw new Error(result.errors[0].message);
        }
        return result.data;
      default:
        return null;
    }
  } catch (_e) {
    // ✅ ใช้ _e แก้ปัญหา ESLint: no-unused-vars
    throw new Error(`Invalid ${format.toUpperCase()} format`);
  }
};

const formatOutput = (data: unknown, format: DataFormat): string => {
  try {
    switch (format) {
      case "json":
        return JSON.stringify(data, null, 2);
      case "yaml":
        return yaml.dump(data);
      case "xml":
        return js2xml(data as object, { compact: true, spaces: 2 });
      case "csv":
        // ✅ Cast type ให้ถูกต้องตามที่ Papa Parse ต้องการ
        return Papa.unparse(data as Record<string, unknown>[]);
      default:
        return "";
    }
  } catch (_e) {
    // ✅ ใช้ _e แก้ปัญหา ESLint
    return `Error converting to ${format.toUpperCase()}`;
  }
};

export const convertData = (
  input: string,
  from: DataFormat,
  to: DataFormat
): string => {
  if (!input.trim()) return "";
  try {
    const data = parseInput(input, from);
    return formatOutput(data, to);
  } catch (err) {
    // ✅ Handle Error Type อย่างถูกต้อง
    if (err instanceof Error) {
      return `Error: ${err.message}`;
    }
    return "An unknown error occurred";
  }
};
