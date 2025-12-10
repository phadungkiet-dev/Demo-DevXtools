"use client";

import { useState, useMemo } from "react";
import cronstrue from "cronstrue";
import { CronExpressionParser } from "cron-parser"; // ใช้ตามที่คุณแก้ผ่านแล้ว
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, AlertCircle, Info } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // ⚠️ ต้องลง Table ก่อน: npx shadcn-ui@latest add table
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // ⚠️ ต้องลง Tooltip ก่อน: npx shadcn-ui@latest add tooltip

export function CronParser() {
  const [expression, setExpression] = useState("*/5 * * * *");

  const result = useMemo(() => {
    if (!expression.trim()) {
      return { description: "", nextRuns: [], error: null };
    }

    try {
      const description = cronstrue.toString(expression);
      const interval = CronExpressionParser.parse(expression);

      const nextRuns = [];
      for (let i = 0; i < 5; i++) {
        nextRuns.push(interval.next().toString());
      }

      return { description, nextRuns, error: null };
    } catch (err) {
      return {
        description: "",
        nextRuns: [],
        error: "Invalid cron expression",
      };
    }
  }, [expression]);

  const presets = [
    { label: "Every minute", value: "* * * * *" },
    { label: "Every 5 mins", value: "*/5 * * * *" },
    { label: "Hourly", value: "0 * * * *" },
    { label: "Daily (Midnight)", value: "0 0 * * *" },
    { label: "Weekly (Sun)", value: "0 0 * * 0" },
    { label: "Monthly (1st)", value: "0 0 1 * *" },
  ];

  return (
    <div className="space-y-8 h-full">
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Input */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cron Expression Editor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    value={expression}
                    onChange={(e) => setExpression(e.target.value)}
                    className={`pl-10 font-mono text-xl h-14 tracking-wide ${
                      result.error
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }`}
                    placeholder="* * * * *"
                  />
                </div>
                {result.error && (
                  <div className="flex items-center text-destructive text-sm mt-2 animate-in slide-in-from-top-1">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {result.error}
                  </div>
                )}
              </div>

              {/* Dynamic Syntax Highlights (Interactive) */}
              <SyntaxHighlighter expression={expression} />

              {result.description && !result.error && (
                <div className="p-6 bg-primary/5 rounded-xl border border-primary/10 text-center space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                    Translation
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-primary break-words">
                    &quot;{result.description}&quot;
                  </p>
                </div>
              )}

              <div className="space-y-3 pt-2 border-t">
                <Label className="text-muted-foreground">Quick Templates</Label>
                <div className="flex flex-wrap gap-2">
                  {presets.map((preset) => (
                    <Button
                      key={preset.label}
                      variant="outline"
                      size="sm"
                      onClick={() => setExpression(preset.value)}
                      className={
                        expression === preset.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "text-muted-foreground"
                      }
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Schedule */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="h-full border-l-4 border-l-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="w-5 h-5 text-primary" />
                Upcoming Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.nextRuns.length > 0 ? (
                <div className="space-y-3 relative">
                  <div className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-muted" />
                  {result.nextRuns.map((date, i) => (
                    <div
                      key={i}
                      className="relative flex items-center gap-4 p-3 rounded-lg bg-background border shadow-sm hover:shadow-md transition-shadow z-10"
                    >
                      <Badge
                        variant={i === 0 ? "default" : "secondary"}
                        className="w-8 h-8 flex items-center justify-center rounded-full shrink-0 text-sm"
                      >
                        {i + 1}
                      </Badge>
                      <div className="flex flex-col">
                        <span className="font-mono text-sm font-medium">
                          {date.split(" ").slice(0, 4).join(" ")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {date.split(" ").slice(4).join(" ")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground opacity-50 gap-2">
                  <Calendar className="w-12 h-12 stroke-1" />
                  <p>Enter a valid expression to calculate dates.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section: Cheat Sheet (ตามรูปที่คุณขอ) */}
      <CronCheatsheet />
    </div>
  );
}

// --- Sub Components ---

// 1. Syntax Highlighter (Interactive Boxes)
function SyntaxHighlighter({ expression }: { expression: string }) {
  const parts = useMemo(() => {
    const split = expression.trim().split(/\s+/);
    return {
      minute: split[0] || "?",
      hour: split[1] || "?",
      dayOfMonth: split[2] || "?",
      month: split[3] || "?",
      dayOfWeek: split[4] || "?",
    };
  }, [expression]);

  return (
    <div className="grid grid-cols-5 gap-2">
      <SyntaxBox label="MIN" value={parts.minute} range="0-59" desc="Minute" />
      <SyntaxBox label="HOUR" value={parts.hour} range="0-23" desc="Hour" />
      <SyntaxBox
        label="DAY"
        value={parts.dayOfMonth}
        range="1-31"
        desc="Day of Month"
      />
      <SyntaxBox label="MONTH" value={parts.month} range="1-12" desc="Month" />
      <SyntaxBox
        label="WEEK"
        value={parts.dayOfWeek}
        range="0-6"
        desc="Day of Week (0=Sun)"
      />
    </div>
  );
}

function SyntaxBox({
  label,
  value,
  range,
  desc,
}: {
  label: string;
  value: string;
  range: string;
  desc: string;
}) {
  const isActive = value !== "*" && value !== "?";
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`
                        flex flex-col items-center justify-center p-2 rounded-md border text-center cursor-help transition-all
                        ${
                          isActive
                            ? "bg-primary/10 border-primary/30"
                            : "bg-muted/30 border-transparent"
                        }
                    `}
          >
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter mb-1">
              {label}
            </span>
            <span
              className={`text-lg font-mono font-bold truncate w-full ${
                isActive ? "text-primary" : "text-muted-foreground/70"
              }`}
            >
              {value}
            </span>
            <span className="text-[9px] text-muted-foreground mt-1">
              {range}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="font-semibold mb-1">{desc}</p>
          <p className="text-xs text-muted-foreground">Range: {range}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// 2. Cheat Sheet Component (เหมือนรูปเป๊ะๆ)
function CronCheatsheet() {
  return (
    <div className="grid md:grid-cols-2 gap-8 pt-8 border-t">
      {/* Diagram Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Cron Format</h3>
        </div>
        <Card className="bg-muted/30">
          <CardContent className="p-6 overflow-x-auto">
            {/* Diagram แบบ Code Block สวยๆ */}
            <div className="font-mono text-sm leading-relaxed whitespace-pre">
              <div className="flex text-lg font-bold tracking-[0.8em] text-primary mb-2">
                * * * * *
              </div>
              <div className="text-muted-foreground">
                │ │ │ │ │<br />
                │ │ │ │ └──── Day of Week (0-6)
                <br />
                │ │ │ └────── Month (1-12)
                <br />
                │ │ └──────── Day of Month (1-31)
                <br />
                │ └────────── Hour (0-23)
                <br />
                └──────────── Minute (0-59)
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Special Characters</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Char</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="hidden sm:table-cell">Example</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-mono font-bold text-primary">
                  *
                </TableCell>
                <TableCell>Any value</TableCell>
                <TableCell className="hidden sm:table-cell font-mono text-xs text-muted-foreground">
                  * * * * * (Every min)
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono font-bold text-primary">
                  ,
                </TableCell>
                <TableCell>Value list separator</TableCell>
                <TableCell className="hidden sm:table-cell font-mono text-xs text-muted-foreground">
                  1,3,5 * * * * (1st, 3rd, 5th min)
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono font-bold text-primary">
                  -
                </TableCell>
                <TableCell>Range of values</TableCell>
                <TableCell className="hidden sm:table-cell font-mono text-xs text-muted-foreground">
                  1-5 * * * * (Mins 1 to 5)
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono font-bold text-primary">
                  /
                </TableCell>
                <TableCell>Step values</TableCell>
                <TableCell className="hidden sm:table-cell font-mono text-xs text-muted-foreground">
                  */5 * * * * (Every 5th min)
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
