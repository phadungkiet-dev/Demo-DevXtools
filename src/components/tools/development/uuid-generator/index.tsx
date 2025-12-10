"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RefreshCw } from "lucide-react";
import { CopyButton } from "@/components/shared/copy-button";

// 1. แยก Logic การสร้าง UUID ออกมาเป็นฟังก์ชันธรรมดา (Pure Function)
// เอาไว้นอก Component เพื่อไม่ให้มันถูกสร้างใหม่ทุกครั้งที่ Render
const generateUUIDList = (count: number) => {
  try {
    return Array.from({ length: count }, () => crypto.randomUUID());
  } catch (e) {
    // Fallback logic
    return Array.from({ length: count }, () =>
      "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      })
    );
  }
};

export function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [amount, setAmount] = useState<number>(1);

  // 2. ใช้ useEffect แค่เพื่อ Sync ข้อมูลเมื่อ amount เปลี่ยน
  // (ESLint จะไม่งอแงเพราะเราไม่ได้เรียกฟังก์ชันจาก dependencies ที่ซับซ้อน)
  useEffect(() => {
    // สร้าง UUID ชุดใหม่ตามจำนวน amount
    setUuids(generateUUIDList(amount));
  }, [amount]);

  // 3. ฟังก์ชันสำหรับปุ่มกด (Manual Regenerate)
  const handleRegenerate = () => {
    setUuids(generateUUIDList(amount));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Controls */}
      <Card>
        <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="w-full md:w-1/2 space-y-4">
            <div className="flex justify-between">
              <Label>Amount to generate</Label>
              <span className="text-sm font-medium text-muted-foreground">
                {amount}
              </span>
            </div>
            <Slider
              value={[amount]}
              onValueChange={(val) => setAmount(val[0])}
              min={1}
              max={10}
              step={1}
              className="py-4"
            />
          </div>

          <Button
            onClick={handleRegenerate}
            size="lg"
            className="w-full md:w-auto"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Regenerate UUIDs
          </Button>
        </CardContent>
      </Card>

      {/* Output List */}
      <div className="space-y-3">
        {uuids.map((uuid, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={uuid}
              readOnly
              className="font-mono text-center md:text-left h-12 text-lg bg-muted/50"
            />
            <CopyButton text={uuid} className="h-12 w-12 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
