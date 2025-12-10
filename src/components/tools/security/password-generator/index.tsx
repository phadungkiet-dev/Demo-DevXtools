"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { RefreshCw, ShieldCheck, ShieldAlert, Shield } from "lucide-react";
import { CopyButton } from "@/components/shared/copy-button";

// --- Helper Functions (Pure) ---

type PasswordSettings = {
  length: number[];
  upper: boolean;
  lower: boolean;
  numbers: boolean;
  symbols: boolean;
};

const evaluateStrength = (len: number): "weak" | "medium" | "strong" => {
  if (len < 8) return "weak";
  if (len < 12) return "medium";
  return "strong";
};

const generatePasswordString = (settings: PasswordSettings): string => {
  let charset = "";
  if (settings.lower) charset += "abcdefghijklmnopqrstuvwxyz";
  if (settings.upper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (settings.numbers) charset += "0123456789";
  if (settings.symbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

  if (charset === "") return "";

  let generated = "";
  for (let i = 0; i < settings.length[0]; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    generated += charset[randomIndex];
  }
  return generated;
};

// --- Component ---

export function PasswordGenerator() {
  // 1. รวม State การตั้งค่า
  const [settings, setSettings] = useState<PasswordSettings>({
    length: [16],
    upper: true,
    lower: true,
    numbers: true,
    symbols: true,
  });

  // 2. State ผลลัพธ์
  const [password, setPassword] = useState(() =>
    generatePasswordString(settings)
  );
  const [strength, setStrength] = useState<"weak" | "medium" | "strong">(
    "strong"
  );

  // 3. ฟังก์ชันอัปเดตและสร้างรหัสผ่านใหม่ทันที (Action-based)
  // ✅ แก้ไข: ใช้ Generic Type แทน any เพื่อความปลอดภัยและแก้ ESLint error
  const updateSettings = <K extends keyof PasswordSettings>(
    key: K,
    value: PasswordSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    // Generate ใหม่ทันทีเมื่อมีการเปลี่ยนค่า
    const newPassword = generatePasswordString(newSettings);
    setPassword(newPassword);
    setStrength(evaluateStrength(newSettings.length[0]));
  };

  const handleRegenerate = () => {
    const newPassword = generatePasswordString(settings);
    setPassword(newPassword);
  };

  const getStrengthColor = () => {
    if (!password) return "text-muted-foreground";
    switch (strength) {
      case "weak":
        return "text-destructive";
      case "medium":
        return "text-yellow-500";
      case "strong":
        return "text-green-500";
    }
  };

  const getStrengthIcon = () => {
    switch (strength) {
      case "weak":
        return <ShieldAlert className="w-5 h-5" />;
      case "medium":
        return <Shield className="w-5 h-5" />;
      case "strong":
        return <ShieldCheck className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Output Display */}
      <Card className="overflow-hidden border-primary/20 shadow-md">
        <CardContent className="p-6 md:p-8 flex flex-col items-center gap-4 text-center">
          <div className="w-full relative">
            <Input
              value={password}
              readOnly
              className="text-center text-2xl md:text-3xl font-mono h-16 bg-muted/30 border-dashed border-2"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <CopyButton text={password} />
            </div>
          </div>

          <div
            className={`flex items-center gap-2 font-medium ${getStrengthColor()}`}
          >
            {getStrengthIcon()}
            <span className="uppercase text-sm tracking-widest">
              {strength} Password
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base">Password Length</Label>
              <span className="text-xl font-bold text-primary">
                {settings.length[0]}
              </span>
            </div>
            <Slider
              value={settings.length}
              onValueChange={(val) => updateSettings("length", val)}
              min={6}
              max={50}
              step={1}
              className="py-4"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
              <Label htmlFor="upper" className="cursor-pointer">
                Uppercase (A-Z)
              </Label>
              <Switch
                id="upper"
                checked={settings.upper}
                onCheckedChange={(v) => updateSettings("upper", v)}
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
              <Label htmlFor="lower" className="cursor-pointer">
                Lowercase (a-z)
              </Label>
              <Switch
                id="lower"
                checked={settings.lower}
                onCheckedChange={(v) => updateSettings("lower", v)}
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
              <Label htmlFor="numbers" className="cursor-pointer">
                Numbers (0-9)
              </Label>
              <Switch
                id="numbers"
                checked={settings.numbers}
                onCheckedChange={(v) => updateSettings("numbers", v)}
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
              <Label htmlFor="symbols" className="cursor-pointer">
                Symbols (!@#$)
              </Label>
              <Switch
                id="symbols"
                checked={settings.symbols}
                onCheckedChange={(v) => updateSettings("symbols", v)}
              />
            </div>
          </div>

          <Button
            size="lg"
            className="w-full mt-4"
            onClick={handleRegenerate}
            disabled={
              !settings.upper &&
              !settings.lower &&
              !settings.numbers &&
              !settings.symbols
            }
          >
            <RefreshCw className="mr-2 h-5 w-5" /> Regenerate Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
