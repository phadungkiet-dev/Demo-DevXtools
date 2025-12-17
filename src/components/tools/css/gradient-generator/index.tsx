"use client";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "@/components/shared/buttons/copy-button";
import { Plus, Trash2, GripVertical } from "lucide-react";

// Interface สำหรับจุดสี
interface ColorStop {
  id: string;
  color: string;
  position: number; // 0-100%
}

export function GradientGenerator() {
  const [type, setType] = useState<"linear" | "radial">("linear");
  const [angle, setAngle] = useState(90); // สำหรับ Linear
  const [radialPosition, setRadialPosition] = useState("center"); // สำหรับ Radial
  const [stops, setStops] = useState<ColorStop[]>([
    { id: crypto.randomUUID(), color: "#3b82f6", position: 0 }, // สีเริ่ม (Blue-500)
    { id: crypto.randomUUID(), color: "#a855f7", position: 100 }, // สีจบ (Purple-500)
  ]);

  // 1. Logic สร้าง CSS String
  const cssCode = useCallback(() => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const stopString = sortedStops
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(", ");

    let gradientFunc = "";
    if (type === "linear") {
      gradientFunc = `linear-gradient(${angle}deg, ${stopString})`;
    } else {
      gradientFunc = `radial-gradient(circle at ${radialPosition}, ${stopString})`;
    }

    return `background: ${gradientFunc};`;
  }, [type, angle, radialPosition, stops]);

  // Functions จัดการ Color Stops
  const addStop = () => {
    const newStop: ColorStop = {
      id: crypto.randomUUID(),
      color: "#ffffff",
      // หาตำแหน่งกึ่งกลางระหว่าง stop สุดท้ายกับ 100% หรือสุ่มเอา
      position: Math.floor(Math.random() * 100),
    };
    setStops([...stops, newStop]);
  };

  const updateStop = (
    id: string,
    field: keyof ColorStop,
    value: string | number
  ) => {
    setStops(
      stops.map((stop) => (stop.id === id ? { ...stop, [field]: value } : stop))
    );
  };

  const removeStop = (id: string) => {
    if (stops.length <= 2) return; // บังคับให้มีอย่างน้อย 2 สี
    setStops(stops.filter((stop) => stop.id !== id));
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12 h-full">
      {/* Settings Panel (Left) */}
      <div className="lg:col-span-5 space-y-6">
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Gradient Type */}
            <div className="space-y-3">
              <Label>Type</Label>
              <Tabs
                value={type}
                onValueChange={(v) => setType(v as "linear" | "radial")}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="linear">Linear</TabsTrigger>
                  <TabsTrigger value="radial">Radial</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Type-specific Settings */}
            {type === "linear" ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Angle</Label>
                  <span className="text-xs text-muted-foreground">
                    {angle}°
                  </span>
                </div>
                <Slider
                  min={0}
                  max={360}
                  step={1}
                  value={[angle]}
                  onValueChange={(v) => setAngle(v[0])}
                />
              </div>
            ) : (
              <div className="space-y-3">
                <Label>Position</Label>
                <Select
                  value={radialPosition}
                  onValueChange={setRadialPosition}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="bottom">Bottom</SelectItem>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                    <SelectItem value="top left">Top Left</SelectItem>
                     {/* ... เพิ่มตำแหน่งอื่นๆ ได้ตามต้องการ */}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="my-4 border-t" />

            {/* Color Stops Management */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Color Stops</Label>
                <Button size="sm" variant="outline" onClick={addStop}>
                  <Plus className="w-4 h-4 mr-2" /> Add Color
                </Button>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {stops
                  .sort((a, b) => a.position - b.position)
                  .map((stop, index) => (
                    <div
                      key={stop.id}
                      className="flex items-center gap-3 p-2 bg-muted/40 rounded-lg group animate-in slide-in-from-left-2"
                    >
                      <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab opacity-50 group-hover:opacity-100" />

                      {/* Color Picker */}
                      <div className="flex gap-2 items-center">
                        <Input
                          type="color"
                          value={stop.color}
                          onChange={(e) =>
                            updateStop(stop.id, "color", e.target.value)
                          }
                          className="w-8 h-8 p-0.5 border-0 rounded-full overflow-hidden cursor-pointer shrink-0"
                        />
                        <Input
                          value={stop.color}
                          onChange={(e) =>
                            updateStop(stop.id, "color", e.target.value)
                          }
                          className="w-20 h-8 text-xs font-mono uppercase"
                          maxLength={7}
                        />
                      </div>

                      {/* Position Slider */}
                      <div className="flex-1 flex items-center gap-2">
                        <Slider
                          min={0}
                          max={100}
                          step={1}
                          value={[stop.position]}
                          onValueChange={(v) =>
                            updateStop(stop.id, "position", v[0])
                          }
                          className="flex-1"
                        />
                        <span className="text-xs font-mono w-8 text-right">
                          {stop.position}%
                        </span>
                      </div>

                      {/* Delete Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() => removeStop(stop.id)}
                        disabled={stops.length <= 2}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Panel (Right) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        {/* Visual Preview */}
        <Card className="flex-1 min-h-[300px] overflow-hidden relative checkerboard-bg">
          <div
            className="absolute inset-0 w-full h-full transition-all duration-200"
            style={{
              background: cssCode()
                .replace("background: ", "")
                .replace(";", ""),
            }}
          />
        </Card>

        {/* Code Output */}
        <Card className="bg-muted/50 border-primary/20 shrink-0">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <code className="font-mono text-sm text-primary break-all line-clamp-2">
              {cssCode()}
            </code>
            <CopyButton text={cssCode()} className="shrink-0" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
