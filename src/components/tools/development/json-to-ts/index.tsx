"use client";

import { useState, useEffect } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function JsonToTsConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [rootName] = useState("RootObject");

  const generateTypes = (jsonStr: string) => {
    try {
      if (!jsonStr.trim()) return "";
      const obj = JSON.parse(jsonStr);

      const interfaces: string[] = [];

      // ฟังก์ชัน Recursive สำหรับ Parse Object
      const parseObject = (obj: Record<string, unknown>, name: string) => {
        let result = `export interface ${name} {\n`;

        Object.keys(obj).forEach((key) => {
          const value = obj[key];
          const type = typeof value;
          let tsType = "any";

          if (value === null) {
            tsType = "null";
          } else if (Array.isArray(value)) {
            if (value.length > 0) {
              const first = value[0];
              if (typeof first === "object" && first !== null) {
                const subName =
                  name + key.charAt(0).toUpperCase() + key.slice(1);
                // ✅ Cast Type สำหรับ Array item
                parseObject(first as Record<string, unknown>, subName);
                tsType = `${subName}[]`;
              } else {
                tsType = `${typeof first}[]`;
              }
            } else {
              tsType = "any[]";
            }
          } else if (type === "object") {
            const subName = name + key.charAt(0).toUpperCase() + key.slice(1);
            // ✅ Cast Type ตรงนี้ที่ error ก่อนหน้านี้
            parseObject(value as Record<string, unknown>, subName);
            tsType = subName;
          } else {
            tsType = type;
          }

          result += `  ${key}: ${tsType};\n`;
        });

        result += `}`;
        interfaces.push(result);
      };

      // เริ่มต้น Parse
      parseObject(obj as Record<string, unknown>, rootName);
      return interfaces.reverse().join("\n\n");
    } catch (e) {
      console.error(e);
      return "Error: Invalid JSON";
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setOutput(generateTypes(input));
    }, 500);
    return () => clearTimeout(timer);
  }, [input, rootName]);

  return (
    <div className="grid md:grid-cols-2 gap-6 h-[500px]">
      <div className="flex flex-col gap-2 h-full">
        <Label>Input JSON</Label>
        <Textarea
          className="flex-1 font-mono text-sm p-4"
          placeholder='{"id": 1, "name": "CodeXKit"}'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2 h-full">
        <div className="flex justify-between items-center">
          <Label>TypeScript Interface</Label>
          {output && !output.startsWith("Error") && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                navigator.clipboard.writeText(output);
                toast.success("Copied!");
              }}
            >
              <Copy className="h-3 w-3 mr-1" /> Copy
            </Button>
          )}
        </div>
        <Textarea
          className="flex-1 font-mono text-sm p-4 bg-muted/30 text-blue-600 dark:text-blue-400"
          value={output}
          readOnly
          placeholder="Result..."
        />
      </div>
    </div>
  );
}
