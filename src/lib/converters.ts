// devtoolx\src\lib\converters.ts
import yaml from "js-yaml";
import Papa from "papaparse";
import { js2xml, xml2js } from "xml-js";

export type DataFormat = "json" | "yaml" | "xml" | "csv";

// ✅ 1. เปลี่ยน return type เป็น unknown
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
        const result = Papa.parse(input, { header: true });
        return result.data;
      default:
        return null;
    }
  } catch (e) {
    throw new Error(`Invalid ${format.toUpperCase()} format`);
  }
};

// ✅ 2. เปลี่ยน parameter type เป็น unknown
const formatOutput = (data: unknown, format: DataFormat): string => {
  try {
    switch (format) {
      case "json":
        return JSON.stringify(data, null, 2);
      case "yaml":
        return yaml.dump(data);
      case "xml":
        return js2xml(data as object, { compact: true, spaces: 2 });

      // ✅ แก้ไขบรรทัดนี้: เปลี่ยน as any[] เป็น as Record<string, unknown>[]
      case "csv":
        return Papa.unparse(data as Record<string, unknown>[]);

      default:
        return "";
    }
  } catch (e) {
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
    // ✅ 3. Handle Error Type
    if (err instanceof Error) {
      return `Error: ${err.message}`;
    }
    return "An unknown error occurred";
  }
};
