"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  Laptop,
  Smartphone,
  Tablet,
  Globe,
  Cpu,
} from "lucide-react";

interface UAInfo {
  browser: string;
  version: string;
  os: string;
  device: "Desktop" | "Mobile" | "Tablet" | "Unknown";
  cpu: string;
}

const parseUA = (ua: string): UAInfo => {
  const info: UAInfo = {
    browser: "Unknown",
    version: "",
    os: "Unknown",
    device: "Unknown",
    cpu: "Unknown",
  };

  if (!ua) return info;

  // 1. Detect Device Type
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    info.device = "Tablet";
  } else if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    info.device = "Mobile";
  } else {
    info.device = "Desktop";
  }

  // 2. Detect OS
  if (/Windows/.test(ua)) {
    info.os = "Windows";
    if (/Windows NT 10.0/.test(ua)) info.os += " 10/11";
    else if (/Windows NT 6.3/.test(ua)) info.os += " 8.1";
    else if (/Windows NT 6.2/.test(ua)) info.os += " 8";
    else if (/Windows NT 6.1/.test(ua)) info.os += " 7";
  } else if (/Mac/.test(ua)) {
    info.os = "macOS";
    const match = /Mac OS X ([\d_]+)/.exec(ua);
    if (match) info.os += ` ${match[1].replace(/_/g, ".")}`;
    if (/iPhone|iPad|iPod/.test(ua)) info.os = "iOS";
  } else if (/Android/.test(ua)) {
    info.os = "Android";
  } else if (/Linux/.test(ua)) {
    info.os = "Linux";
  }

  // 3. Detect Browser & Version
  const browserRegexs = [
    { name: "Edge", regex: /Edg\/([\d.]+)/ },
    { name: "Chrome", regex: /Chrome\/([\d.]+)/ },
    { name: "Firefox", regex: /Firefox\/([\d.]+)/ },
    { name: "Safari", regex: /Version\/([\d.]+).*Safari/ },
    { name: "Opera", regex: /OPR\/([\d.]+)/ },
    { name: "IE", regex: /Trident.*rv:([\d.]+)/ },
  ];

  for (const b of browserRegexs) {
    const match = b.regex.exec(ua);
    if (match) {
      info.browser = b.name;
      info.version = match[1];
      break;
    }
  }

  if (info.browser === "Unknown" && /Opera/.test(ua)) info.browser = "Opera";

  // 4. Architecture / CPU
  if (/Win64|x64|x86_64/.test(ua)) info.cpu = "64-bit";
  else if (/Win32|x86/.test(ua)) info.cpu = "32-bit";
  else if (/jq/.test(ua)) info.cpu = "Unknown";

  return info;
};

// แยก Component ออกมาด้านนอก (แก้ Error: Cannot create components during render)
const DeviceIcon = ({ device }: { device: string }) => {
  if (device === "Mobile")
    return <Smartphone className="w-8 h-8 text-primary" />;
  if (device === "Tablet") return <Tablet className="w-8 h-8 text-primary" />;
  return <Laptop className="w-8 h-8 text-primary" />;
};

// --- Main Component ---

export function UserAgentParser() {
  const [uaString, setUaString] = useState("");

  // ใช้ useMemo คำนวณ info จาก uaString แทนการเก็บ State (แก้ Error: setState in effect และลด Render)
  const info = useMemo(() => parseUA(uaString), [uaString]);

  // Auto-detect current UA on mount
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const timer = setTimeout(() => {
        setUaString(navigator.userAgent);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleUseMyUA = () => {
    if (typeof navigator !== "undefined") {
      setUaString(navigator.userAgent);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12 h-full">
      {/* Input Section */}
      <div className="lg:col-span-12 space-y-4">
        <div className="flex justify-between items-center">
          <Label>User Agent String</Label>
          <Button variant="outline" size="sm" onClick={handleUseMyUA}>
            <RefreshCw className="w-3 h-3 mr-2" /> Use My User Agent
          </Button>
        </div>
        <div className="flex gap-2">
          <Textarea
            value={uaString}
            onChange={(e) => setUaString(e.target.value)}
            placeholder="Paste User Agent string here..."
            className="font-mono text-sm min-h-[100px]"
          />
        </div>
      </div>

      {/* Result Cards */}
      {uaString && (
        <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="bg-muted/30 hover:bg-muted/50 transition-colors">
            <CardContent className="p-6 flex flex-col items-center text-center gap-2">
              <Globe className="w-8 h-8 text-primary" />
              <div className="text-xs text-muted-foreground uppercase font-bold">
                Browser
              </div>
              <div className="font-semibold text-lg">{info.browser}</div>
              <div className="text-sm text-muted-foreground">
                {info.version}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30 hover:bg-muted/50 transition-colors">
            <CardContent className="p-6 flex flex-col items-center text-center gap-2">
              <Cpu className="w-8 h-8 text-primary" />
              <div className="text-xs text-muted-foreground uppercase font-bold">
                OS System
              </div>
              <div className="font-semibold text-lg">{info.os}</div>
              <div className="text-sm text-muted-foreground">{info.cpu}</div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30 hover:bg-muted/50 transition-colors">
            <CardContent className="p-6 flex flex-col items-center text-center gap-2">
              <DeviceIcon device={info.device} />
              <div className="text-xs text-muted-foreground uppercase font-bold">
                Device
              </div>
              <div className="font-semibold text-lg">{info.device}</div>
              <div className="text-sm text-muted-foreground opacity-0">.</div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30 hover:bg-muted/50 transition-colors">
            <CardContent className="p-6 flex flex-col items-center text-center gap-2">
              <RefreshCw className="w-8 h-8 text-primary" />
              <div className="text-xs text-muted-foreground uppercase font-bold">
                Engine
              </div>
              <div className="font-semibold text-lg">
                {/WebKit/.test(uaString)
                  ? "WebKit"
                  : /Gecko/.test(uaString)
                  ? "Gecko"
                  : "Unknown"}
              </div>
              <div className="text-sm text-muted-foreground opacity-0">.</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
