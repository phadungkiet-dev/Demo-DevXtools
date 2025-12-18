"use client";

import { useState } from "react";

// UI Components
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Icons
import {
  Database,
  AlignLeft,
  Minimize2,
  Code2,
  FileCode,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

// Shared Components
import {
  CopyButton,
  ClearButton,
  PasteButton,
  DownloadButton,
} from "@/components/shared/buttons";
import { toast } from "sonner";

// Libs
import { format, type SqlLanguage } from "sql-formatter";

// =============================================================================
// Constants
// =============================================================================
const DIALECTS: { value: SqlLanguage; label: string }[] = [
  { value: "sql", label: "Standard SQL" },
  { value: "mysql", label: "MySQL" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "transactsql", label: "SQL Server (T-SQL)" },
  { value: "plsql", label: "Oracle (PL/SQL)" },
  { value: "bigquery", label: "Google BigQuery" },
];

// =============================================================================
// Main Component
// =============================================================================
export function SqlFormatter() {
  const [input, setInput] = useState("SELECT * FROM users WHERE id = 1");
  const [output, setOutput] = useState("");
  const [dialect, setDialect] = useState<SqlLanguage>("sql");
  const [error, setError] = useState<string | null>(null);

  // --- Handlers ---
  const handleFormat = () => {
    if (!input.trim()) {
      toast("SQL input is empty", {
        icon: <AlertCircle className="h-4 w-4 text-destructive" />,
      });
      return;
    }

    try {
      const formatted = format(input, {
        language: dialect,
        tabWidth: 2,
        keywordCase: "upper",
        linesBetweenQueries: 2,
      });
      setOutput(formatted);
      setError(null);

      toast("Formatted successfully", {
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      });
    } catch (err) {
      const errMsg = (err as Error).message;
      setError(errMsg);
      toast("Formatting failed", {
        icon: <AlertCircle className="h-4 w-4 text-destructive" />,
      });
    }
  };

  const handleMinify = () => {
    if (!input.trim()) {
      toast("SQL input is empty", {
        icon: <AlertCircle className="h-4 w-4 text-destructive" />,
      });
      return;
    }

    try {
      const minified = input
        .replace(/\s+/g, " ")
        .replace(/\s*([,()])\s*/g, "$1")
        .trim();

      setOutput(minified);
      setError(null);
      toast("Minified successfully", {
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      });
    } catch (err) {
      const errMsg = (err as Error).message;
      setError(errMsg);
      toast("Minify failed", {
        icon: <AlertCircle className="h-4 w-4 text-destructive" />,
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 h-[600px] animate-in fade-in duration-500">
      {/* ================= TOP PANEL: INPUT ================= */}
      <Card className="flex-1 flex flex-col min-h-0 overflow-hidden border-border/60 shadow-md p-0">
        {/* Toolbar */}
        <div className="flex flex-row items-center justify-between px-4 h-[60px] border-b border-border/40 bg-muted/30 shrink-0 gap-4">
          {/* Label Group */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="p-1.5 bg-primary/10 rounded-md text-primary">
              <Database size={16} />
            </div>
            {/* ✅ แก้ไขตรงนี้: เปลี่ยนจาก xs เป็น sm */}
            {/* Mobile: ซ่อน Text (โชว์แค่ไอคอน) */}
            {/* Desktop (sm ขึ้นไป): โชว์ Text "Input SQL" */}
            <span className="text-sm font-semibold text-muted-foreground hidden sm:inline-block">
              Input SQL
            </span>
          </div>

          {/* Tools Group */}
          {/* ใช้ overflow-x-auto เพื่อให้เครื่องมือไม่ล้นจอในมือถือจอเล็ก */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mask-fade-right">
            <Select
              value={dialect}
              onValueChange={(v) => setDialect(v as SqlLanguage)}
            >
              <SelectTrigger className="h-8 w-[130px] text-xs font-medium bg-background border-border/60">
                <SelectValue placeholder="Select Dialect" />
              </SelectTrigger>
              <SelectContent>
                {DIALECTS.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="w-px h-4 bg-border mx-1 shrink-0" />
            <PasteButton onPaste={setInput} className="flex" />
            <ClearButton onClear={() => setInput("")} disabled={!input} />
          </div>
        </div>

        {/* Input Area */}
        <div className="flex-1 relative min-h-0">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-full resize-none border-0 focus-visible:ring-0 p-4 font-mono text-sm leading-relaxed bg-transparent rounded-none shadow-none scrollbar-thin placeholder:text-muted-foreground/30"
            placeholder="SELECT * FROM table..."
            spellCheck={false}
          />
        </div>
      </Card>

      {/* ================= MIDDLE ACTIONS ================= */}
      <div className="flex justify-center gap-3 shrink-0 py-1">
        <Button onClick={handleFormat} className="min-w-[120px] shadow-sm">
          <AlignLeft className="mr-2 h-4 w-4" />
          Format
        </Button>
        <Button
          variant="outline"
          onClick={handleMinify}
          className="min-w-[120px] shadow-sm bg-background"
        >
          <Minimize2 className="mr-2 h-4 w-4" />
          Minify
        </Button>
      </div>

      {/* ================= BOTTOM PANEL: OUTPUT ================= */}
      <Card className="flex-1 flex flex-col min-h-0 overflow-hidden border-border/60 shadow-md p-0 bg-muted/10">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 h-[60px] border-b border-border/40 bg-muted/30 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-500/10 rounded-md text-purple-500">
              <Code2 size={16} />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              Output
            </span>
          </div>
          <div className="flex items-center gap-1">
            <DownloadButton
              text={output}
              filename="query.sql"
              extension="sql"
              className="h-8 w-8 hover:bg-background hover:text-primary transition-colors"
            />
            <CopyButton
              text={output}
              className="h-8 w-8 hover:bg-background hover:text-primary transition-colors"
            />
          </div>
        </div>

        {/* Output Area */}
        <div className="flex-1 relative min-h-0">
          {output ? (
            <Textarea
              value={output}
              readOnly
              className="w-full h-full resize-none border-0 focus-visible:ring-0 p-4 font-mono text-sm leading-relaxed bg-transparent rounded-none shadow-none scrollbar-thin text-foreground"
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground/40 gap-3 select-none">
              <FileCode size={48} strokeWidth={1} />
              <p>Formatted SQL will appear here</p>
            </div>
          )}

          {error && (
            <div className="absolute bottom-4 left-4 right-4 bg-destructive/10 text-destructive text-xs p-3 rounded-md border border-destructive/20 backdrop-blur-sm animate-in slide-in-from-bottom-2 flex items-center gap-2">
              <AlertCircle size={14} />
              <span className="font-bold">Error:</span> {error}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
