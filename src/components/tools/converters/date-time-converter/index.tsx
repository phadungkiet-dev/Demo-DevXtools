"use client";

import { useState, useEffect, ElementType } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  CalendarClock,
  Clock,
  RotateCcw,
  Trash2,
  Globe,
  Calendar,
  Hash,
} from "lucide-react";
import { CopyButton } from "@/components/shared/copy-button";
import {
  format,
  isValid,
  parseISO,
  fromUnixTime,
  formatDistanceToNow,
  getUnixTime,
} from "date-fns";
import { cn } from "@/lib/utils";

export function DateTimeConverter() {
  // ✅ 1. เริ่มต้นด้วยค่าว่าง/null เพื่อให้ Server กับ Client ตรงกัน 100%
  const [inputValue, setInputValue] = useState<string>("");
  const [dateObj, setDateObj] = useState<Date | null>(null);
  const [error, setError] = useState<boolean>(false);

  // ✅ 2. เพิ่ม useEffect เพื่อ Set เวลาปัจจุบัน "เฉพาะฝั่ง Client" ตอนโหลดครั้งแรก
  useEffect(() => {
    const timer = setTimeout(() => {
      const now = new Date();
      setInputValue(now.toISOString());
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Logic: Parse Input (ทำงานเมื่อ inputValue เปลี่ยน)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!inputValue.trim()) {
        setDateObj(null);
        setError(false);
        return;
      }

      let parsed: Date | null = null;
      const cleanInput = inputValue.trim();

      // 1. Try Unix Timestamp (Numbers)
      if (/^\d+$/.test(cleanInput)) {
        const ts = parseInt(cleanInput, 10);
        // Heuristic: 13 digits = ms, 10 digits = sec
        if (cleanInput.length >= 13) {
          parsed = new Date(ts);
        } else {
          parsed = fromUnixTime(ts);
        }
      }
      // 2. Try ISO String / Date String
      else {
        parsed = new Date(cleanInput);
        if (!isValid(parsed)) {
          parsed = parseISO(cleanInput);
        }
      }

      if (isValid(parsed)) {
        setDateObj(parsed);
        setError(false);
      } else {
        setDateObj(null);
        setError(true);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue]);

  const handleSetNow = () => {
    const now = new Date();
    setInputValue(now.toISOString());
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3 lg:h-[550px] transition-all">
      {/* ================= LEFT: INPUT PANEL ================= */}
      <Card className="lg:col-span-1 border-border/60 shadow-md flex flex-col h-full bg-card/50 backdrop-blur-sm p-0">
        <CardContent className="p-6 flex flex-col h-full gap-6">
          <div className="flex items-center gap-2 pb-2 border-b border-border/50">
            <div className="p-1.5 bg-primary/10 rounded-md text-primary">
              <CalendarClock size={16} />
            </div>
            <h3 className="font-semibold text-sm">Input Date/Time</h3>
          </div>

          <div className="space-y-6 flex-1">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-muted-foreground">
                Enter Timestamp, ISO, or Date String
              </Label>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="e.g. 1715423000 or 2024-05-11"
                className={cn(
                  "font-mono text-sm h-11",
                  error &&
                    "border-destructive/50 focus-visible:ring-destructive/30"
                )}
              />
              {error && (
                <p className="text-xs text-destructive font-medium animate-in fade-in slide-in-from-top-1">
                  Invalid date format
                </p>
              )}
            </div>

            <div className="p-4 rounded-xl bg-muted/30 border border-border/50 text-xs text-muted-foreground space-y-2">
              <p className="font-medium text-foreground">Supports:</p>
              <ul className="list-disc list-inside space-y-1 ml-1">
                <li>Unix Timestamp (Seconds)</li>
                <li>Unix Timestamp (Milliseconds)</li>
                <li>ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)</li>
                <li>Common formats (MM/DD/YYYY)</li>
              </ul>
            </div>
          </div>

          <div className="mt-auto pt-4 flex flex-col gap-2">
            <Button
              className="w-full h-10 font-medium"
              onClick={handleSetNow}
              variant="default"
            >
              <Clock className="mr-2 h-4 w-4" />
              Set to Now
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => setInputValue("")}
                disabled={!inputValue}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Clear
              </Button>
              <Button
                variant="ghost"
                onClick={handleSetNow}
                className="text-muted-foreground"
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ================= RIGHT: OUTPUT PANEL ================= */}
      <Card className="lg:col-span-2 border-border/60 shadow-md flex flex-col h-full overflow-hidden bg-card p-0">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-muted/30 min-h-[60px]">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-primary/10 rounded-md text-primary">
              <Calendar size={16} />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              Converted Formats
            </span>
          </div>
          {dateObj && (
            <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold uppercase tracking-wider">
              Valid Date
            </div>
          )}
        </div>

        <CardContent className="p-0 flex-1 relative overflow-y-auto">
          {!dateObj ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground/40 gap-4">
              <CalendarClock size={48} strokeWidth={1} />
              <p>Enter a date to see conversions</p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              <ResultRow
                label="Unix Timestamp (Seconds)"
                value={getUnixTime(dateObj).toString()}
                icon={Hash}
                desc="Seconds since Jan 01 1970"
              />
              <ResultRow
                label="Unix Timestamp (Milliseconds)"
                value={dateObj.getTime().toString()}
                icon={Hash}
                desc="Milliseconds since Jan 01 1970"
              />
              <ResultRow
                label="ISO 8601"
                value={dateObj.toISOString()}
                icon={Globe}
                desc="Universal standard format"
              />
              <ResultRow
                label="UTC / GMT"
                value={dateObj.toUTCString()}
                icon={Globe}
                desc="Coordinated Universal Time"
              />
              <ResultRow
                label="Local String"
                value={dateObj.toString()}
                icon={Clock}
                desc="Based on your browser's timezone"
              />
              <ResultRow
                label="Relative"
                value={formatDistanceToNow(dateObj, { addSuffix: true })}
                icon={RotateCcw}
                desc="Time duration from now"
              />
              <ResultRow
                label="Formatted (Custom)"
                value={format(dateObj, "yyyy-MM-dd HH:mm:ss")}
                icon={Calendar}
                desc="YYYY-MM-DD HH:mm:ss"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ResultRow({
  label,
  value,
  icon: Icon,
  desc,
}: {
  label: string;
  value: string;
  icon: ElementType;
  desc?: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 px-6 hover:bg-muted/20 transition-colors gap-4">
      <div className="flex items-start gap-3">
        <div className="mt-1 p-1.5 rounded-md bg-muted text-muted-foreground">
          <Icon size={16} />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          {desc && (
            <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="flex-1 sm:flex-none font-mono text-sm bg-background border border-border px-3 py-1.5 rounded-md text-foreground min-w-[200px] text-right truncate">
          {value}
        </div>
        <CopyButton text={value} className="h-8 w-8 shrink-0" />
      </div>
    </div>
  );
}
