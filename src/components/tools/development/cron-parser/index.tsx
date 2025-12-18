"use client";

// =============================================================================
// Imports
// =============================================================================
import { useState, useEffect } from "react";

// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Icons
import {
  Clock,
  CalendarClock,
  PlayCircle,
  Info,
  HelpCircle,
} from "lucide-react";

// Shared Components
import { CopyButton, ClearButton } from "@/components/shared/buttons";

// Utils & Libs
import cronstrue from "cronstrue";
import { CronExpressionParser } from "cron-parser";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// =============================================================================
// Constants
// =============================================================================
const CRON_EXAMPLES = [
  { label: "Every minute", value: "* * * * *" },
  { label: "Every 5 minutes", value: "*/5 * * * *" },
  { label: "Every hour", value: "0 * * * *" },
  { label: "Every day at midnight", value: "0 0 * * *" },
  { label: "Every Sunday at midnight", value: "0 0 * * 0" },
  { label: "At 14:15 on day-of-month 1", value: "15 14 1 * *" },
  { label: "Mon-Fri at 09:00", value: "0 9 * * 1-5" },
];

// =============================================================================
// Main Component
// =============================================================================
export function CronParser() {
  // --- State ---
  const [cronExpression, setCronExpression] = useState("*/5 * * * *");
  const [humanReadable, setHumanReadable] = useState("");
  const [nextRuns, setNextRuns] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // --- Logic & Effects ---
  useEffect(() => {
    const calculateCron = () => {
      if (!cronExpression.trim()) {
        setHumanReadable("");
        setNextRuns([]);
        setError(null);
        return;
      }

      try {
        const desc = cronstrue.toString(cronExpression, {
          use24HourTimeFormat: true,
        });
        setHumanReadable(desc);

        const interval = CronExpressionParser.parse(cronExpression);
        const runs: string[] = [];
        for (let i = 0; i < 5; i++) {
          const nextDate = interval.next().toDate();
          runs.push(format(nextDate, "yyyy-MM-dd HH:mm:ss"));
        }
        setNextRuns(runs);
        setError(null);
      } catch {
        setHumanReadable("");
        setNextRuns([]);
        setError("Invalid cron expression format");
      }
    };

    const timer = setTimeout(calculateCron, 300);
    return () => clearTimeout(timer);
  }, [cronExpression]);

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:h-[600px] transition-all animate-in fade-in duration-500">
      {/* ================= LEFT: INPUT & EXAMPLES ================= */}
      <Card className="flex flex-col h-full overflow-hidden bg-card p-0 border-border/60 shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-muted/30 min-h-[60px]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-md text-primary">
              <Clock size={16} />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              Editor
            </span>

            {/* ✅ เพิ่มปุ่ม Info Dialog ตรงนี้ */}
            <CronInfoDialog />
          </div>
          <ClearButton
            onClear={() => setCronExpression("")}
            disabled={!cronExpression}
          />
        </div>

        <CardContent className="p-6 flex flex-col gap-6 overflow-hidden h-full">
          {/* Input Area */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Cron Expression
              <span className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground font-mono">
                * * * * *
              </span>
            </label>
            <Input
              value={cronExpression}
              onChange={(e) => setCronExpression(e.target.value)}
              placeholder="e.g. 30 4 * * *"
              className={cn(
                "font-mono text-lg h-12 border-2 transition-all",
                error
                  ? "border-destructive/50 focus-visible:ring-destructive/30 bg-destructive/5"
                  : "focus-visible:border-primary/50"
              )}
            />
            {error && (
              <div className="flex items-center gap-2 text-xs text-destructive font-medium animate-in fade-in slide-in-from-top-1">
                <Info size={12} />
                {error}
              </div>
            )}
          </div>

          {/* Quick Examples */}
          <div className="flex-1 flex flex-col min-h-0">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
              Quick Examples
            </label>
            <ScrollArea className="flex-1 -mr-4 pr-4">
              <div className="grid gap-2 pb-2">
                {CRON_EXAMPLES.map((ex) => (
                  <button
                    key={ex.label}
                    onClick={() => setCronExpression(ex.value)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border text-left text-sm transition-all hover:shadow-sm",
                      cronExpression === ex.value
                        ? "bg-primary/10 border-primary/40 shadow-sm"
                        : "bg-background hover:bg-muted/50 border-border/60"
                    )}
                  >
                    <span className="font-medium text-foreground/80">
                      {ex.label}
                    </span>
                    <Badge
                      variant="secondary"
                      className="font-mono text-[10px] bg-muted/50 text-muted-foreground"
                    >
                      {ex.value}
                    </Badge>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      {/* ================= RIGHT: RESULT & NEXT RUNS ================= */}
      <Card className="flex flex-col h-full overflow-hidden bg-card p-0 border-border/60 shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-muted/30 min-h-[60px]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500/10 rounded-md text-emerald-600">
              <CalendarClock size={16} />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              Schedule Details
            </span>
          </div>
        </div>

        <CardContent className="p-6 flex flex-col h-full gap-8">
          {/* Human Readable Output */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Description
            </label>
            <div className="p-6 rounded-xl bg-muted/30 border border-border/60 min-h-[100px] flex items-center justify-center text-center relative group">
              {humanReadable ? (
                <p className="text-xl md:text-2xl font-semibold text-primary animate-in zoom-in-95">
                  “{humanReadable}”
                </p>
              ) : (
                <p className="text-muted-foreground/40 italic text-sm">
                  Enter a valid cron expression...
                </p>
              )}

              {humanReadable && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CopyButton text={humanReadable} className="h-8 w-8" />
                </div>
              )}
            </div>
          </div>

          {/* Next Runs List */}
          <div className="flex-1 flex flex-col min-h-0">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
              Next 5 Runs
              {nextRuns.length > 0 && (
                <Badge variant="outline" className="text-[10px] h-5 px-1.5">
                  Upcoming
                </Badge>
              )}
            </label>

            <div className="flex-1 bg-muted/10 rounded-xl border border-border/40 overflow-hidden">
              {nextRuns.length > 0 ? (
                <div className="divide-y divide-border/40">
                  {nextRuns.map((date, i) => (
                    <div
                      key={i}
                      className="p-3 px-4 flex items-center gap-3 text-sm font-mono text-muted-foreground hover:bg-muted/30 hover:text-foreground transition-colors"
                    >
                      <span className="text-primary/40 font-bold w-4 text-center">
                        {i + 1}.
                      </span>
                      <PlayCircle size={14} className="text-emerald-500/70" />
                      <span className="flex-1">{date}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground/30 gap-2">
                  <CalendarClock size={40} strokeWidth={1} />
                  <span className="text-xs">No schedule available</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// =============================================================================
// Helper: Cron Info Dialog (Cheat Sheet)
// =============================================================================
function CronInfoDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full text-muted-foreground hover:text-foreground"
          title="Cron Cheat Sheet"
        >
          <HelpCircle size={14} />
        </Button>
      </DialogTrigger>
      {/* ✅ แก้ไข 1: กำหนด max-h-[80vh] เพื่อจำกัดความสูง Modal ไม่ให้เต็มจอเกินไป
          ✅ แก้ไข 2: ใช้ overflow-hidden ที่ container หลัก
      */}
      <DialogContent className="sm:max-w-2xl max-h-[80vh] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b shrink-0 bg-background/95 backdrop-blur z-10">
          <DialogTitle>Cron Format Guide</DialogTitle>
          <DialogDescription>
            Reference for standard cron expressions and special characters.
          </DialogDescription>
        </DialogHeader>

        {/* ✅ แก้ไข 3: เปลี่ยนจาก <ScrollArea> เป็น <div> ธรรมดา
            ✅ ใช้ overflow-y-auto เพื่อบังคับให้เกิด Scrollbar
        */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-8">
            {/* 1. Format Diagram */}
            <section className="space-y-3">
              <h4 className="text-sm font-bold border-l-4 border-primary pl-2">
                Cron Structure
              </h4>
              <div className="p-4 bg-muted/40 rounded-lg border overflow-x-auto">
                <pre className="text-xs md:text-sm font-mono leading-relaxed whitespace-pre text-muted-foreground">
                  {`
 * * * * * *
 ┬    ┬    ┬    ┬    ┬    ┬
 │    │    │    │    │    │
 │    │    │    │    │    └─ day of week (0-7, 1L-7L) (0 or 7 is Sun)
 │    │    │    │    └── month (1-12, JAN-DEC)
 │    │    │    └─────── day of month (1-31, L)
 │    │    └──────────── hour (0-23)
 │    └───────────────── minute (0-59)
 └────────────────────── second (0-59, optional)
`}
                </pre>
              </div>
            </section>

            {/* 2. Special Characters */}
            <section className="space-y-3">
              <h4 className="text-sm font-bold border-l-4 border-primary pl-2">
                Special Characters
              </h4>
              <TableWrapper>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[50px]">Char</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Example</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <Row char="*" desc="Any value" ex="* * * * *" />
                  <Row char="?" desc="Any value (alias for *)" ex="? * * * *" />
                  <Row
                    char=","
                    desc="Value list separator"
                    ex="1,2,3 * * * *"
                  />
                  <Row char="-" desc="Range of values" ex="1-5 * * * *" />
                  <Row char="/" desc="Step values" ex="*/5 * * * *" />
                  <Row char="L" desc="Last day of month/week" ex="0 0 L * *" />
                  <Row char="#" desc="Nth day of month" ex="0 0 * * 1#1" />
                  <Row char="H" desc="Randomized value" ex="H * * * *" />
                </TableBody>
              </TableWrapper>
            </section>

            {/* 3. Predefined Expressions */}
            <section className="space-y-3">
              <h4 className="text-sm font-bold border-l-4 border-primary pl-2">
                Predefined Expressions
              </h4>
              <TableWrapper>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Expression</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Equivalent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <RowExpr
                    name="@yearly"
                    desc="Once a year (Jan 1)"
                    eq="0 0 0 1 1 *"
                  />
                  <RowExpr
                    name="@monthly"
                    desc="Once a month (1st day)"
                    eq="0 0 0 1 * *"
                  />
                  <RowExpr
                    name="@weekly"
                    desc="Once a week (Sun)"
                    eq="0 0 0 * * 0"
                  />
                  <RowExpr
                    name="@daily"
                    desc="Once a day (Midnight)"
                    eq="0 0 0 * * *"
                  />
                  <RowExpr
                    name="@hourly"
                    desc="Once an hour"
                    eq="0 0 * * * *"
                  />
                </TableBody>
              </TableWrapper>
            </section>

            {/* 4. Field Values */}
            <section className="space-y-3">
              <h4 className="text-sm font-bold border-l-4 border-primary pl-2">
                Field Values
              </h4>
              <TableWrapper>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Field</TableHead>
                    <TableHead>Values</TableHead>
                    <TableHead>Special</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <RowField name="second" val="0-59" spec="* ? , - / H" />
                  <RowField name="minute" val="0-59" spec="* ? , - / H" />
                  <RowField name="hour" val="0-23" spec="* ? , - / H" />
                  <RowField
                    name="day of month"
                    val="1-31"
                    spec="* ? , - / H L"
                  />
                  <RowField name="month" val="1-12" spec="* ? , - / H" />
                  <RowField
                    name="day of week"
                    val="0-7"
                    spec="* ? , - / H L #"
                  />
                </TableBody>
              </TableWrapper>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper Components for Table Rows to keep code clean
const TableWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-md border overflow-hidden">
    <Table>{children}</Table>
  </div>
);

const Row = ({
  char,
  desc,
  ex,
}: {
  char: string;
  desc: string;
  ex: string;
}) => (
  <TableRow>
    <TableCell className="font-mono font-bold text-primary">{char}</TableCell>
    <TableCell>{desc}</TableCell>
    <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
      {ex}
    </TableCell>
  </TableRow>
);

const RowExpr = ({
  name,
  desc,
  eq,
}: {
  name: string;
  desc: string;
  eq: string;
}) => (
  <TableRow>
    <TableCell className="font-mono font-bold text-primary">{name}</TableCell>
    <TableCell>{desc}</TableCell>
    <TableCell className="font-mono text-xs text-muted-foreground">
      {eq}
    </TableCell>
  </TableRow>
);

const RowField = ({
  name,
  val,
  spec,
}: {
  name: string;
  val: string;
  spec: string;
}) => (
  <TableRow>
    <TableCell className="font-medium capitalize">{name}</TableCell>
    <TableCell className="font-mono text-xs">{val}</TableCell>
    <TableCell className="font-mono text-xs text-muted-foreground">
      {spec}
    </TableCell>
  </TableRow>
);
