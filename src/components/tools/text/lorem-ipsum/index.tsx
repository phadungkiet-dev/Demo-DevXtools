"use client";

import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { CopyButton } from "@/components/shared/copy-button";
import { generateLorem, LoremType } from "@/lib/generators";

export function LoremIpsumGenerator() {
  const [count, setCount] = useState<number>(3);
  const [type, setType] = useState<LoremType>("paragraph");
  const [startWithLorem, setStartWithLorem] = useState<boolean>(true);

  const [seed, setSeed] = useState(0);

  // 3. ใช้ useMemo คำนวณค่า output ทันทีที่ dependency เปลี่ยน (ไม่ต้องรอ useEffect)
  const output = useMemo(() => {
    return generateLorem(count, type, startWithLorem);
  }, [count, type, startWithLorem, seed]); // ใส่ seed เข้าไปเพื่อให้ปุ่มกดทำงานได้

  // 4. ฟังก์ชันกดปุ่ม แค่เปลี่ยนค่า seed เพื่อกระตุ้น useMemo
  const handleRegenerate = () => {
    setSeed((prev) => prev + 1);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Settings Panel */}
      <Card className="lg:col-span-1 h-fit">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-3">
            <Label>Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as LoremType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paragraph">Paragraphs</SelectItem>
                <SelectItem value="sentence">Sentences</SelectItem>
                <SelectItem value="word">Words</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <Label>Count</Label>
              <span className="text-sm font-medium text-muted-foreground">
                {count}
              </span>
            </div>
            <Slider
              value={[count]}
              onValueChange={(val) => setCount(val[0])}
              max={type === "word" ? 100 : 20}
              min={1}
              step={1}
              className="py-4"
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="start-lorem" className="flex flex-col gap-1">
              <span>Start with Lorem</span>
              <span className="font-normal text-xs text-muted-foreground">
                Begin with &quot;Lorem ipsum...&quot;
              </span>
            </Label>
            <Switch
              id="start-lorem"
              checked={startWithLorem}
              onCheckedChange={setStartWithLorem}
            />
          </div>

          <Button
            className="w-full"
            onClick={handleRegenerate} // 5. เรียกใช้ฟังก์ชันใหม่
            variant="outline"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Regenerate
          </Button>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 relative min-h-[400px]">
        <div className="absolute top-3 right-3 z-10">
          <CopyButton text={output} />
        </div>
        <CardContent className="p-6 h-full">
          <textarea
            className="w-full h-full min-h-[350px] resize-none bg-transparent border-none focus:ring-0 p-0 text-muted-foreground leading-relaxed"
            value={output}
            readOnly
          />
        </CardContent>
      </Card>
    </div>
  );
}
