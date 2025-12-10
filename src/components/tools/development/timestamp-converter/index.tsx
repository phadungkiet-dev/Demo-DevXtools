"use client";

import { useState, useMemo } from "react"; // 💡 เปลี่ยน useEffect เป็น useMemo
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function TimestampConverter() {
  const [ts, setTs] = useState<string>(() =>
    Math.floor(Date.now() / 1000).toString()
  );

  // ✅ ใช้ useMemo คำนวณค่า Date String โดยตรงจาก ts
  const dateStr = useMemo(() => {
    // 1. ตรวจสอบค่าว่าง/ไม่ถูกต้อง
    if (!ts) {
      return ""; // คืนค่าว่างทันที ไม่ต้อง setState
    }

    const timestamp = parseInt(ts);
    if (isNaN(timestamp)) {
      return "Invalid Timestamp";
    }

    // 2. คำนวณวันที่
    // Detect if ms or seconds (if > 9999999999, likely ms)
    const date = new Date(
      timestamp > 9999999999 ? timestamp : timestamp * 1000
    );

    // 3. ตรวจสอบวันที่
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    // 4. Format วันที่
    return format(date, "yyyy-MM-dd HH:mm:ss");
  }, [ts]); // Dependency คือ ts (จะรันใหม่เมื่อ ts เปลี่ยนเท่านั้น)

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label>Unix Timestamp</Label>
            <div className="flex gap-2">
              <Input
                value={ts}
                onChange={(e) => setTs(e.target.value)}
                className="font-mono"
                placeholder="Enter timestamp..."
              />
              <Button
                onClick={() => setTs(Math.floor(Date.now() / 1000).toString())}
              >
                Now
              </Button>
            </div>
          </div>
          <div className="p-4 bg-primary/10 rounded-lg text-center">
            <div className="text-sm text-muted-foreground uppercase">
              Human Date (Local)
            </div>
            {/* 💡 ใช้ค่า dateStr ที่คำนวณมาแล้วโดยตรง */}
            <div className="text-2xl font-bold text-primary mt-1 min-h-[32px]">
              {dateStr || "Enter a timestamp"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
