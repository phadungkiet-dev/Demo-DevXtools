"use client";

import { useState, useEffect } from "react";

// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Icons
import {
  ShieldCheck,
  FileJson,
  Clock,
  AlertTriangle,
  KeyRound,
} from "lucide-react";

// Shared Components
import {
  CopyButton,
  ClearButton,
  PasteButton,
} from "@/components/shared/buttons";
import { cn } from "@/lib/utils";

// Libs
import { jwtDecode, type JwtHeader, type JwtPayload } from "jwt-decode";

// =============================================================================
// Helper: Format Date
// =============================================================================
const formatDate = (timestamp: number) => {
  if (!timestamp) return "N/A";
  try {
    return new Date(timestamp * 1000).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "medium",
    });
  } catch (e) {
    return "Invalid Date";
  }
};

// =============================================================================
// Main Component
// =============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExtendedJwtPayload = JwtPayload & { [key: string]: any };

export function JwtDecoder() {
  // State
  const [token, setToken] = useState("");
  const [header, setHeader] = useState<JwtHeader | null>(null);
  const [payload, setPayload] = useState<ExtendedJwtPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("payload");

  // เริ่มต้นเป็น 0 เพื่อป้องกัน Hydration Mismatch
  const [now, setNow] = useState<number>(0);

  // ✅ แก้ไข: ใช้ setTimeout เพื่อหลบ Linter error (Synchronous setState in effect)
  useEffect(() => {
    // หน่วงเวลา 0ms เพื่อให้การอัปเดตเกิดขึ้นใน Tick ถัดไป
    const timeout = setTimeout(() => {
      setNow(Date.now());
    }, 0);

    // ตั้ง Timer ให้อัปเดตทุก 1 นาที
    const timer = setInterval(() => setNow(Date.now()), 60000);

    // Cleanup ทั้ง timeout และ interval
    return () => {
      clearTimeout(timeout);
      clearInterval(timer);
    };
  }, []);

  // Event Driven Logic: ทำงานเมื่อ Token เปลี่ยน
  const handleTokenChange = (value: string) => {
    setToken(value);
    setNow(Date.now()); // อัปเดตเวลาทันทีเมื่อมีการพิมพ์ (ใน Event Handler ทำได้ ไม่ติด Linter)

    if (!value.trim()) {
      setHeader(null);
      setPayload(null);
      setError(null);
      return;
    }

    try {
      const decodedHeader = jwtDecode<JwtHeader>(value, { header: true });
      setHeader(decodedHeader);

      const decodedPayload = jwtDecode<ExtendedJwtPayload>(value);
      setPayload(decodedPayload);

      setError(null);
    } catch (err) {
      setError("Invalid JWT Token format");
      setHeader(null);
      setPayload(null);
    }
  };

  // Helper: Render JSON
  const renderJson = (data: unknown) => {
    if (!data) return null;
    return JSON.stringify(data, null, 2);
  };

  const getTimeStatus = (expTimestamp: number) => {
    if (!expTimestamp || !now) return "";

    const diff = expTimestamp - now / 1000;

    if (diff > 0) {
      const hours = Math.floor(diff / 3600);
      const mins = Math.floor((diff % 3600) / 60);
      return `(expires in ${hours}h ${mins}m)`;
    } else {
      return `(expired)`;
    }
  };

  const isExpired = (expTimestamp?: number) => {
    if (!expTimestamp || !now) return false;
    return expTimestamp * 1000 < now;
  };

  return (
    <div className="flex flex-col gap-6 h-full min-h-[600px] animate-in fade-in duration-500">
      {/* ================= TOP: INPUT ================= */}
      <Card className="flex flex-col min-h-0 overflow-hidden border-border/60 shadow-md p-0">
        <div className="flex flex-row items-center justify-between px-4 h-[60px] border-b border-border/40 bg-muted/30 shrink-0 gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <div className="p-1.5 bg-primary/10 rounded-md text-primary">
              <KeyRound size={16} />
            </div>
            <span className="text-sm font-semibold text-muted-foreground hidden sm:inline-block">
              Encoded Token
            </span>
          </div>

          <div className="flex items-center gap-2">
            <PasteButton onPaste={handleTokenChange} className="flex" />
            <ClearButton
              onClear={() => handleTokenChange("")}
              disabled={!token}
            />
          </div>
        </div>

        <div className="relative min-h-[120px] max-h-[200px]">
          <Textarea
            value={token}
            onChange={(e) => handleTokenChange(e.target.value)}
            className={cn(
              "w-full h-full resize-y border-0 focus-visible:ring-0 p-4 font-mono text-sm leading-relaxed bg-transparent rounded-none shadow-none scrollbar-thin",
              error ? "text-destructive bg-destructive/5" : "text-foreground"
            )}
            placeholder="Paste your JWT (eyJ...)"
            spellCheck={false}
          />
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="px-4 py-2 bg-destructive/10 text-destructive text-xs font-medium flex items-center gap-2 border-t border-destructive/20">
            <AlertTriangle size={14} />
            {error}
          </div>
        )}
      </Card>

      {/* ================= BOTTOM: DECODED OUTPUT ================= */}
      <div className="grid lg:grid-cols-2 gap-6 flex-1 min-h-0">
        {/* LEFT: DECODED DATA (TABS) */}
        <Card className="flex flex-col overflow-hidden border-border/60 shadow-md p-0 lg:col-span-1">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex flex-col h-full"
          >
            <div className="flex items-center justify-between px-4 h-[60px] border-b border-border/40 bg-muted/30 shrink-0">
              <TabsList className="h-9 bg-muted/50">
                <TabsTrigger value="payload" className="text-xs h-8 px-3">
                  Payload
                </TabsTrigger>
                <TabsTrigger value="header" className="text-xs h-8 px-3">
                  Header
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-1">
                <CopyButton
                  text={
                    renderJson(activeTab === "payload" ? payload : header) || ""
                  }
                  disabled={!payload}
                  className="h-8 w-8"
                />
              </div>
            </div>

            <TabsContent
              value="payload"
              className="flex-1 p-0 m-0 min-h-0 relative"
            >
              <ScrollArea className="h-full w-full">
                <pre className="p-4 font-mono text-sm text-foreground/90">
                  {payload ? (
                    renderJson(payload)
                  ) : (
                    <span className="text-muted-foreground/40 italic">
                      Waiting for token...
                    </span>
                  )}
                </pre>
              </ScrollArea>
            </TabsContent>

            <TabsContent
              value="header"
              className="flex-1 p-0 m-0 min-h-0 relative"
            >
              <ScrollArea className="h-full w-full">
                <pre className="p-4 font-mono text-sm text-foreground/90">
                  {header ? (
                    renderJson(header)
                  ) : (
                    <span className="text-muted-foreground/40 italic">
                      Waiting for token...
                    </span>
                  )}
                </pre>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </Card>

        {/* RIGHT: SMART ANALYSIS */}
        <Card className="flex flex-col overflow-hidden border-border/60 shadow-md p-0 lg:col-span-1">
          <div className="flex items-center gap-2 px-4 h-[60px] border-b border-border/40 bg-muted/30 shrink-0">
            <div className="p-1.5 bg-blue-500/10 rounded-md text-blue-500">
              <ShieldCheck size={16} />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              Claims Analysis
            </span>
          </div>

          <CardContent className="p-0 flex-1 overflow-y-auto bg-muted/5">
            {payload ? (
              <div className="divide-y divide-border/40">
                {/* Standard Claims */}
                <div className="p-4 space-y-3">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Standard Claims
                  </h4>

                  {/* Subject */}
                  {payload.sub && (
                    <div className="grid grid-cols-[80px_1fr] gap-2 text-sm">
                      <span className="font-mono text-muted-foreground">
                        sub
                      </span>
                      <span className="font-medium">{payload.sub}</span>
                    </div>
                  )}

                  {/* Issuer */}
                  {payload.iss && (
                    <div className="grid grid-cols-[80px_1fr] gap-2 text-sm">
                      <span className="font-mono text-muted-foreground">
                        iss
                      </span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        {payload.iss}
                      </span>
                    </div>
                  )}

                  {/* Dates (Highlighted) */}
                  {payload.iat && (
                    <div className="grid grid-cols-[80px_1fr] gap-2 text-sm">
                      <span className="font-mono text-muted-foreground flex items-center gap-1">
                        <Clock size={12} /> iat
                      </span>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {formatDate(payload.iat)}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          Issued At
                        </span>
                      </div>
                    </div>
                  )}

                  {payload.exp && (
                    <div className="grid grid-cols-[80px_1fr] gap-2 text-sm mt-2">
                      <span className="font-mono text-muted-foreground flex items-center gap-1">
                        <Clock size={12} /> exp
                      </span>
                      <div className="flex flex-col">
                        <span
                          className={cn(
                            "font-medium",
                            isExpired(payload.exp)
                              ? "text-destructive"
                              : "text-green-600"
                          )}
                        >
                          {formatDate(payload.exp)}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {getTimeStatus(payload.exp)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Scopes / Roles */}
                {(payload.scope || payload.roles || payload.permissions) && (
                  <div className="p-4 space-y-2">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Permissions
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {String(
                        payload.scope || payload.roles || payload.permissions
                      )
                        .split(/[\s,]+/)
                        .map((role, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="font-mono text-[10px]"
                          >
                            {role}
                          </Badge>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground/40 gap-3 p-6 text-center">
                <FileJson size={40} strokeWidth={1} />
                <p className="text-sm">Decode a token to see details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
