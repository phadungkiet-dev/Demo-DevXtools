"use client";

// =============================================================================
// Imports
// =============================================================================
import { useState, useEffect, ElementType } from "react";

// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Icons
import {
  CalendarClock,
  Clock,
  RotateCcw,
  Globe,
  Calendar,
  Hash,
} from "lucide-react";

// Shared Components
import { CopyButton, ClearButton } from "@/components/shared/buttons";

// Utils & Libs
import {
  format,
  isValid,
  parseISO,
  fromUnixTime,
  formatDistanceToNow,
  getUnixTime,
} from "date-fns";
import { cn } from "@/lib/utils";

// =============================================================================
// Main Component
// =============================================================================
export function DateTimeConverter() {
  // --- State Management ---
  const [inputValue, setInputValue] = useState<string>("");
  const [dateObj, setDateObj] = useState<Date | null>(null);
  const [error, setError] = useState<boolean>(false);

  // --- Handlers & Logic ---

  /**
   * 🔄 Handlers (✅ ย้ายขึ้นมาไว้ก่อน useEffect เพื่อแก้ Error Reference)
   */
  const handleSetNow = () => {
    const now = new Date();
    setInputValue(now.toISOString());
  };

  /**
   * 🕒 Initial Set Now (Client-side only)
   */
  useEffect(() => {
    // เรียกใช้ handleSetNow ได้แล้ว เพราะประกาศไว้ด้านบน
    const timer = setTimeout(() => handleSetNow(), 0);
    return () => clearTimeout(timer);
  }, []);

  /**
   * 🧠 Core Logic: Parse Date Input
   */
  const parseDateInput = (input: string) => {
    const cleanInput = input.trim();
    if (!cleanInput) return null;

    let parsed: Date | null = null;

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

    return isValid(parsed) ? parsed : null;
  };

  /**
   * ⚡ Effect: Watch Input Change
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!inputValue.trim()) {
        setDateObj(null);
        setError(false);
        return;
      }

      const parsed = parseDateInput(inputValue);

      if (parsed) {
        setDateObj(parsed);
        setError(false);
      } else {
        setDateObj(null);
        setError(true);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue]);

  return (
    <div className="grid gap-6 lg:grid-cols-3 lg:h-[550px] transition-all animate-in fade-in duration-500">
      {/* ================= LEFT: INPUT PANEL ================= */}
      <Card className="lg:col-span-1 border-border/60 shadow-md flex flex-col h-full bg-card/50 backdrop-blur-sm p-0 overflow-hidden">
        <CardContent className="p-6 flex flex-col h-full gap-6">
          {/* Header */}
          <div className="flex items-center gap-2 pb-2 border-b border-border/50">
            <div className="p-1.5 bg-primary/10 rounded-md text-primary">
              <CalendarClock size={16} />
            </div>
            <h3 className="font-semibold text-sm text-foreground/80 uppercase tracking-wide">
              Input Date/Time
            </h3>
          </div>

          {/* Input Area */}
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
                  "font-mono text-sm h-11 transition-all",
                  error &&
                    "border-destructive/50 focus-visible:ring-destructive/30 bg-destructive/5"
                )}
              />
              {error && (
                <p className="text-xs text-destructive font-medium animate-in fade-in slide-in-from-top-1 flex items-center gap-1">
                  Invalid date format
                </p>
              )}
            </div>

            {/* Helper Info */}
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50 text-xs text-muted-foreground space-y-2">
              <p className="font-bold text-foreground/80 uppercase tracking-wide text-[10px]">
                Supported Formats:
              </p>
              <ul className="list-disc list-inside space-y-1.5 ml-1 opacity-80">
                <li>Unix Timestamp (Seconds/Millis)</li>
                <li>ISO 8601 (YYYY-MM-DDTHH:mm:ss)</li>
                <li>Common formats (MM/DD/YYYY)</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto pt-4 flex flex-col gap-2">
            <Button
              className="w-full h-10 font-medium shadow-sm"
              onClick={handleSetNow}
              variant="default"
            >
              <Clock className="mr-2 h-4 w-4" />
              Set to Now
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <ClearButton
                onClear={() => setInputValue("")}
                disabled={!inputValue}
                className="w-full justify-center"
              />
              <Button
                variant="ghost"
                onClick={handleSetNow}
                className="text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ================= RIGHT: OUTPUT PANEL ================= */}
      <Card className="lg:col-span-2 border-border/60 shadow-md flex flex-col h-full overflow-hidden bg-card p-0">
        {/* Toolbar */}
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
            <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[10px] font-bold uppercase tracking-wider animate-in fade-in zoom-in-95">
              Valid Date
            </div>
          )}
        </div>

        {/* Result List */}
        <CardContent className="p-0 flex-1 relative overflow-y-auto custom-scrollbar">
          {!dateObj ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground/40 gap-4 animate-in fade-in duration-500">
              <div className="p-4 bg-muted/20 rounded-full">
                <CalendarClock size={48} strokeWidth={1} />
              </div>
              <p className="text-sm font-medium">
                Enter a valid date to see conversions
              </p>
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

// =============================================================================
// Sub-Component: Result Row
// =============================================================================
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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 px-6 hover:bg-muted/30 transition-colors gap-4 group">
      <div className="flex items-start gap-3">
        <div className="mt-1 p-1.5 rounded-md bg-muted text-muted-foreground group-hover:text-foreground transition-colors">
          <Icon size={16} />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground/90">{label}</p>
          {desc && (
            <p className="text-[11px] text-muted-foreground mt-0.5">{desc}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="flex-1 sm:flex-none font-mono text-sm bg-background/50 border border-border/60 px-3 py-1.5 rounded-md text-foreground min-w-[200px] text-right truncate select-all hover:border-primary/30 transition-colors">
          {value}
        </div>
        <CopyButton
          text={value}
          className="h-8 w-8 shrink-0 hover:bg-background hover:text-primary transition-colors"
        />
      </div>
    </div>
  );
}
