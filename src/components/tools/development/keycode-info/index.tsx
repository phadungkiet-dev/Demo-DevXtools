"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

export function KeycodeInfo() {
  const [eventInfo, setEventInfo] = useState<{
    key: string;
    code: string;
    which: number;
    location: number;
    metaKey: boolean;
    ctrlKey: boolean;
    altKey: boolean;
    shiftKey: boolean;
  } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault(); // ป้องกัน Browser shortcut ทำงาน
      setEventInfo({
        key: e.key === " " ? "(Space)" : e.key,
        code: e.code,
        which: e.which, // Deprecated but useful for legacy
        location: e.location,
        metaKey: e.metaKey,
        ctrlKey: e.ctrlKey,
        altKey: e.altKey,
        shiftKey: e.shiftKey,
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!eventInfo) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] border-2 border-dashed rounded-xl bg-muted/20 animate-pulse">
        <p className="text-2xl font-bold text-muted-foreground">
          Press any key on your keyboard...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] gap-8">
      {/* Main Key Display */}
      <div className="text-center space-y-4">
        <div className="text-9xl font-bold text-primary animate-in zoom-in duration-300">
          {eventInfo.which}
        </div>
        <div className="text-2xl text-muted-foreground font-mono">
          event.which
        </div>
      </div>

      {/* Detailed Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
        <InfoCard label="event.key" value={eventInfo.key} />
        <InfoCard label="event.code" value={eventInfo.code} />
        <InfoCard
          label="event.location"
          value={eventInfo.location.toString()}
        />

        {/* Modifiers */}
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center h-full gap-2">
            <span className="text-xs text-muted-foreground uppercase font-bold">
              Modifiers
            </span>
            <div className="flex gap-1 flex-wrap justify-center">
              {eventInfo.metaKey && <Badge>Meta</Badge>}
              {eventInfo.ctrlKey && <Badge>Ctrl</Badge>}
              {eventInfo.altKey && <Badge>Alt</Badge>}
              {eventInfo.shiftKey && <Badge>Shift</Badge>}
              {!eventInfo.metaKey &&
                !eventInfo.ctrlKey &&
                !eventInfo.altKey &&
                !eventInfo.shiftKey && (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardContent className="p-6 text-center space-y-2">
        <div className="text-xs text-muted-foreground uppercase font-bold">
          {label}
        </div>
        <div
          className="text-xl font-mono font-bold text-primary truncate"
          title={value}
        >
          {value}
        </div>
      </CardContent>
    </Card>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2 py-1 rounded-md bg-primary text-primary-foreground text-xs font-bold">
      {children}
    </span>
  );
}
