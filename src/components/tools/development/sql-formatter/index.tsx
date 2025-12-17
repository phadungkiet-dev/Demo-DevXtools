"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/shared/buttons/copy-button";
import { Trash2, Database, AlignLeft, Minimize } from "lucide-react";
import { toast } from "sonner";

// --- Simple SQL Formatter Logic ---
const formatSQL = (sql: string) => {
  if (!sql.trim()) return "";

  // 1. Normalize whitespace (remove extra spaces/tabs/newlines)
  let formatted = sql.replace(/\s+/g, " ").trim();

  // 2. List of Keywords to start a new line
  const keywords = [
    "SELECT",
    "FROM",
    "WHERE",
    "AND",
    "OR",
    "ORDER BY",
    "GROUP BY",
    "HAVING",
    "LIMIT",
    "INSERT INTO",
    "VALUES",
    "UPDATE",
    "SET",
    "DELETE FROM",
    "LEFT JOIN",
    "RIGHT JOIN",
    "INNER JOIN",
    "OUTER JOIN",
    "JOIN",
    "UNION",
    "UNION ALL",
    "CASE",
    "END",
  ];

  // 3. Regex replacement for keywords (Case insensitive)
  // Add newline before keywords
  keywords.forEach((kw) => {
    const regex = new RegExp(`\\b${kw}\\b`, "yi"); // 'y' for sticky might not be best here, use 'gi'
    // Safe replace: Ensure we don't break words inside strings (Basic heuristic)
    // Using a simpler approach: Word boundary check
    const simpleRegex = new RegExp(`\\b${kw}\\b`, "gi");
    formatted = formatted.replace(
      simpleRegex,
      (match) => `\n${match.toUpperCase()}`
    );
  });

  // 4. Handle parentheses (Basic indentation attempt)
  formatted = formatted.replace(/\(/g, " (\n  ").replace(/\)/g, "\n)");

  // 5. Fix multiple newlines
  return formatted.replace(/\n\s*\n/g, "\n").trim();
};

const minifySQL = (sql: string) => {
  return sql.replace(/\s+/g, " ").trim();
};

export function SqlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleFormat = () => {
    try {
      const formatted = formatSQL(input);
      setOutput(formatted);
      toast.success("SQL Formatted");
    } catch (e) {
      toast.error("Failed to format SQL");
    }
  };

  const handleMinify = () => {
    const minified = minifySQL(input);
    setOutput(minified);
    toast.success("SQL Minified");
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2 h-[calc(100vh-200px)] min-h-[500px]">
      {/* Input Section */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <Label>Raw SQL</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Clear
          </Button>
        </div>
        <Card className="flex-1 overflow-hidden">
          <CardContent className="p-0 h-full">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="SELECT * FROM users WHERE id = 1..."
              className="w-full h-full resize-none border-0 focus-visible:ring-0 p-4 font-mono text-sm leading-relaxed"
              spellCheck={false}
            />
          </CardContent>
        </Card>
      </div>

      {/* Output Section */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <Label>Result</Label>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={handleMinify}>
              <Minimize className="w-4 h-4 mr-2" /> Minify
            </Button>
            <Button size="sm" onClick={handleFormat}>
              <AlignLeft className="w-4 h-4 mr-2" /> Format
            </Button>
          </div>
        </div>
        <Card className="flex-1 overflow-hidden bg-muted/30 relative">
          <div className="absolute top-2 right-2 z-10">
            <CopyButton text={output} />
          </div>
          <CardContent className="p-0 h-full">
            <Textarea
              value={output}
              readOnly
              placeholder="Formatted result will appear here..."
              className="w-full h-full resize-none border-0 bg-transparent focus-visible:ring-0 p-4 font-mono text-sm leading-relaxed text-primary"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
