"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Fingerprint,
  KeyRound,
  Settings2,
  CaseSensitive,
  Info,
  BookOpen,
  Eye,
  EyeOff,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Shared Components
import { CopyButton } from "@/components/shared/buttons/copy-button";
import { ClearButton } from "@/components/shared/buttons/clear-button";
import { PasteButton } from "@/components/shared/buttons/paste-button";
import { RegenerateButton } from "@/components/shared/buttons/regenerate-button";

// Utils
import { cn } from "@/lib/utils";

// --- Constants & Info Data ---
const ALGOS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;

const ALGO_INFO = [
  {
    name: "SHA-1",
    desc: "Legacy hash function. Fast but collision-prone.",
    usage:
      "Git commits, checksums for non-security critical files. NOT for passwords.",
    secure: false,
  },
  {
    name: "SHA-256",
    desc: "Industry standard. Good balance of security and speed.",
    usage: "HTTPS certificates, Blockchain, General purpose security.",
    secure: true,
  },
  {
    name: "SHA-512",
    desc: "Higher security margin. Faster on 64-bit processors.",
    usage: "High-security applications, cryptographic libraries.",
    secure: true,
  },
  {
    name: "HMAC",
    desc: "Hash-based Message Authentication Code.",
    usage: "Verifying data integrity and authenticity using a secret key.",
    secure: true,
  },
  {
    name: "PBKDF2",
    desc: "Password-Based Key Derivation Function 2.",
    usage:
      "Secure password hashing. Uses salt and iterations to slow down attacks.",
    secure: true,
  },
];

// --- Helper Functions ---
const bufferToHex = (buffer: ArrayBuffer, uppercase: boolean): string => {
  const hex = Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return uppercase ? hex.toUpperCase() : hex;
};

const generateRandomString = (length: number = 32) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  return result;
};

// --- Sub-Components ---
const InfoModal = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-primary"
      >
        <Info className="w-4 h-4" />
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Hash Algorithms Guide
        </DialogTitle>
        <DialogDescription>
          Understanding which algorithm to use for your specific use case.
        </DialogDescription>
      </DialogHeader>
      <ScrollArea className="max-h-[60vh] pr-4">
        <div className="space-y-4">
          {ALGO_INFO.map((info) => (
            <div
              key={info.name}
              className="space-y-1 border-b pb-3 last:border-0"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">{info.name}</h4>
                <Badge
                  variant={info.secure ? "default" : "destructive"}
                  className="text-[10px] h-5"
                >
                  {info.secure ? "Secure" : "Weak"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{info.desc}</p>
              <div className="bg-muted/50 p-2 rounded text-[11px] font-mono text-foreground/80 mt-1">
                <strong>Best for:</strong> {info.usage}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </DialogContent>
  </Dialog>
);

// --- Main Component ---
export function HashGenerator() {
  // --- State ---
  const [activeTab, setActiveTab] = useState("simple");
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});

  // Settings
  const [uppercase, setUppercase] = useState(false);

  // HMAC State
  const [secretKey, setSecretKey] = useState("");
  const [showSecret, setShowSecret] = useState(false);

  // PBKDF2 State
  const [salt, setSalt] = useState("salt");
  const [iterations, setIterations] = useState(1000);
  const [keyLength, setKeyLength] = useState(256);

  // --- Logic ---
  useEffect(() => {
    const processHashing = async () => {
      // 1. Logic inside effect (Debounced below)
      if (!input && activeTab !== "pbkdf2") {
        setHashes({});
        return;
      }

      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const results: Record<string, string> = {};

      try {
        if (activeTab === "simple") {
          await Promise.all(
            ALGOS.map(async (algo) => {
              const buf = await crypto.subtle.digest(algo, data);
              results[algo] = bufferToHex(buf, uppercase);
            })
          );
        } else if (activeTab === "hmac") {
          if (!secretKey) {
            setHashes({});
            return;
          }
          const keyData = encoder.encode(secretKey);
          await Promise.all(
            ALGOS.map(async (algo) => {
              const key = await crypto.subtle.importKey(
                "raw",
                keyData,
                { name: "HMAC", hash: algo },
                false,
                ["sign"]
              );
              const signature = await crypto.subtle.sign("HMAC", key, data);
              results[algo] = bufferToHex(signature, uppercase);
            })
          );
        } else if (activeTab === "pbkdf2") {
          const saltBuffer = encoder.encode(salt);
          const keyMaterial = await crypto.subtle.importKey(
            "raw",
            data,
            { name: "PBKDF2" },
            false,
            ["deriveBits"]
          );
          const derivedBits = await crypto.subtle.deriveBits(
            {
              name: "PBKDF2",
              salt: saltBuffer,
              iterations: iterations,
              hash: "SHA-256",
            },
            keyMaterial,
            keyLength
          );
          results[`PBKDF2-SHA256 (${keyLength}-bit)`] = bufferToHex(
            derivedBits,
            uppercase
          );
        }
        setHashes(results);
      } catch (e) {
        console.error("Hash generation error", e);
      }
    };

    const timer = setTimeout(processHashing, 150);
    return () => clearTimeout(timer);
  }, [input, activeTab, uppercase, secretKey, salt, iterations, keyLength]);

  // Generators
  const handleGenKey = () => setSecretKey(generateRandomString(32));
  const handleGenSalt = () => setSalt(generateRandomString(16));

  return (
    <div className="flex flex-col gap-6 h-full min-h-[600px] animate-in fade-in duration-500">
      {/* ================= HEADER & TABS ================= */}
      <div className="flex flex-col gap-4">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-3 w-full sm:w-[320px]">
            <TabsTrigger value="simple">Digest</TabsTrigger>
            <TabsTrigger value="hmac">HMAC</TabsTrigger>
            <TabsTrigger value="pbkdf2">PBKDF2</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* ================= MAIN CONTENT GRID (EQUAL SPLIT) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        {/* --- LEFT COLUMN: INPUT & SETTINGS --- */}
        <div className="flex flex-col gap-6">
          {/* 1. INPUT CARD */}
          <Card className="flex flex-col min-h-[250px] overflow-hidden border-border/60 shadow-md p-0">
            <div className="flex flex-row items-center justify-between px-4 h-[50px] border-b border-border/40 bg-muted/30 shrink-0 gap-4">
              <div className="flex items-center gap-2 shrink-0">
                <div className="p-1.5 bg-primary/10 rounded-md text-primary">
                  <Fingerprint size={16} />
                </div>
                <span className="text-sm font-semibold text-muted-foreground">
                  Input Data
                </span>
              </div>

              {/* Shared Button Group */}
              <div className="flex items-center gap-1 bg-background/50 p-1 rounded-md border border-border/30">
                <PasteButton onPaste={setInput} className="h-7 px-3 text-xs" />
                <Separator orientation="vertical" className="h-4" />
                <ClearButton
                  onClear={() => setInput("")}
                  disabled={!input}
                  className="h-7 px-3 text-xs hover:text-destructive hover:bg-destructive/10"
                />
              </div>
            </div>

            <div className="relative flex-1">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className={cn(
                  "w-full h-full resize-none border-0 focus-visible:ring-0 p-4 font-mono text-sm leading-relaxed bg-transparent rounded-none shadow-none scrollbar-thin",
                  "placeholder:text-muted-foreground/40"
                )}
                placeholder="Type or paste content here..."
                spellCheck={false}
              />
              <div className="absolute bottom-2 right-3 pointer-events-none">
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] bg-background/80 backdrop-blur-sm"
                >
                  {input.length} chars
                </Badge>
              </div>
            </div>
          </Card>

          {/* 2. SETTINGS CARD (Conditional) */}
          {activeTab === "hmac" && (
            <Card className="flex flex-col overflow-hidden border-border/60 shadow-md p-0">
              <div className="flex flex-row items-center px-4 h-[50px] border-b border-border/40 bg-muted/30 shrink-0 gap-2">
                <KeyRound className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-muted-foreground">
                  HMAC Secret Key
                </span>
              </div>
              <div className="p-4">
                <div className="flex gap-2 items-center">
                  <div className="relative flex-1">
                    <Input
                      type={showSecret ? "text" : "password"}
                      value={secretKey}
                      onChange={(e) => setSecretKey(e.target.value)}
                      placeholder="Enter signing key..."
                      // ✅ Fix: เพิ่ม h-10 ให้ Input สูงเท่ากับปุ่ม
                      className="bg-background pr-10 h-10"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      // ✅ Fix: ปรับปุ่ม Eye ให้ center กับ h-10
                      className="absolute right-0 top-0 h-10 w-9 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowSecret(!showSecret)}
                    >
                      {showSecret ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  {/* ✅ Fix: ปุ่ม Generate ใช้ h-10 เท่ากับ Input */}
                  <RegenerateButton
                    onRegenerate={handleGenKey}
                    className="shrink-0 h-10 w-10 border-input"
                    variant="outline"
                    toastMessage="Random key generated"
                  />
                </div>
              </div>
            </Card>
          )}

          {activeTab === "pbkdf2" && (
            <Card className="flex flex-col overflow-hidden border-border/60 shadow-md p-0">
              <div className="flex flex-row items-center px-4 h-[50px] border-b border-border/40 bg-muted/30 shrink-0 gap-2">
                <Settings2 className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-muted-foreground">
                  PBKDF2 Parameters
                </span>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Salt String
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={salt}
                        onChange={(e) => setSalt(e.target.value)}
                        // ✅ Fix: ใช้ h-9 เพื่อความ Compact ใน Settings
                        className="bg-background h-9"
                      />
                      <RegenerateButton
                        onRegenerate={handleGenSalt}
                        // ✅ Fix: ใช้ h-9 เท่ากับ Input
                        className="h-9 w-9 shrink-0 border-input"
                        variant="outline"
                        toastMessage="New salt generated"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Key Length
                    </Label>
                    <select
                      className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                      value={keyLength}
                      onChange={(e) => setKeyLength(Number(e.target.value))}
                    >
                      <option value="128">128-bit</option>
                      <option value="256">256-bit</option>
                      <option value="512">512-bit</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between">
                    <Label className="text-xs text-muted-foreground">
                      Iterations (Cost)
                    </Label>
                    <span className="text-xs font-mono">
                      {iterations.toLocaleString()} rounds
                    </span>
                  </div>
                  <Slider
                    value={[iterations]}
                    onValueChange={(v) => setIterations(v[0])}
                    min={1000}
                    max={100000}
                    step={1000}
                  />
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* --- RIGHT COLUMN: OUTPUT --- */}
        <div className="flex flex-col h-full">
          <Card className="flex flex-col h-full min-h-[250px] border-border/60 shadow-md overflow-hidden p-0">
            {/* Header */}
            <div className="flex flex-row items-center justify-between px-4 h-[50px] border-b border-border/40 bg-muted/30 shrink-0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-muted-foreground">
                  Generated Hashes
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center space-x-2 bg-background/50 px-2 py-1 rounded border border-border/40">
                  <Switch
                    id="uppercase"
                    checked={uppercase}
                    onCheckedChange={setUppercase}
                    className="scale-75"
                  />
                  <Label
                    htmlFor="uppercase"
                    className="text-[10px] font-medium cursor-pointer flex items-center gap-1 uppercase tracking-wide"
                  >
                    <CaseSensitive className="w-3 h-3" /> CAPS
                  </Label>
                </div>
                <InfoModal />
              </div>
            </div>

            {/* Content Area */}
            <ScrollArea className="flex-1 bg-background/50">
              <div className="p-4 space-y-3">
                {Object.keys(hashes).length > 0 ? (
                  Object.entries(hashes).map(([algo, hash]) => (
                    <Card
                      key={algo}
                      className="overflow-hidden border-border/50 hover:border-primary/50 transition-colors shadow-sm p-0"
                    >
                      <div className="flex flex-row items-center justify-between px-3 py-2 bg-muted/20 border-b border-border/30">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="font-mono font-bold text-[10px] h-5 px-1.5"
                          >
                            {algo}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">
                            {hash.length * 4} bits
                          </span>
                        </div>
                        <CopyButton text={hash} className="h-6 w-6" />
                      </div>
                      <div className="p-3 bg-card">
                        <p className="font-mono text-xs break-all text-foreground/90 leading-relaxed selection:bg-primary/20">
                          {hash}
                        </p>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-[200px] border-2 border-dashed border-muted-foreground/20 rounded-lg bg-muted/5 mt-4 mx-4">
                    <div className="p-3 rounded-full bg-muted/30 mb-3">
                      <Settings2 className="w-5 h-5 text-muted-foreground/50" />
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">
                      No output generated
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1 max-w-[200px] text-center">
                      {activeTab === "hmac" && !secretKey
                        ? "Enter a secret key to generate HMAC signatures."
                        : "Enter text input to generate hashes."}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
}
