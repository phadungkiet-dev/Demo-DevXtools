"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type NeumorphismShape = "flat" | "concave" | "convex" | "pressed";

export function NeumorphismGenerator() {
  const [color, setColor] = useState("#e0e5ec");
  const [size, setSize] = useState([200]);
  const [radius, setRadius] = useState([30]);
  const [distance, setDistance] = useState([20]);
  const [intensity, setIntensity] = useState([0.15]);
  const [blur, setBlur] = useState([60]);
  const [shape, setShape] = useState<NeumorphismShape>("flat");

  // Helper to darken/lighten color (Simplified logic)
  // In real app, use a library like 'color' or 'tinycolor2'
  const getShadowColors = (hex: string, intensity: number) => {
    // This is a very basic simulation. For production, calculate HSL/RGB properly.
    // Assuming light theme color for simplicity here.
    return {
      light: `rgba(255, 255, 255, ${0.5 + intensity})`, // Lighter
      dark: `rgba(163, 177, 198, ${0.3 + intensity})`, // Darker
    };
  };

  const { light, dark } = getShadowColors(color, intensity[0]);
  const dist = distance[0];
  const blr = blur[0];

  let boxShadow = "";
  let background = color;

  switch (shape) {
    case "flat":
    case "convex":
    case "concave":
      const inset = shape === "concave" ? "" : ""; // Convex uses gradient usually
      const grad =
        shape === "convex"
          ? `linear-gradient(145deg, ${light}, ${dark})` // Fake gradient for convex logic needs real color manipulation
          : shape === "concave"
          ? `linear-gradient(145deg, ${dark}, ${light})`
          : color;

      // Simple Flat Neumorphism
      boxShadow = `${dist}px ${dist}px ${blr}px ${dark}, -${dist}px -${dist}px ${blr}px ${light}`;
      background = shape === "flat" ? color : grad; // Convex/Concave needs better color math
      // For this demo, let's stick to simple shape simulation via shadow only for Flat/Pressed
      if (shape !== "flat") background = color; // Reset for simplicity
      break;
    case "pressed":
      boxShadow = `inset ${dist}px ${dist}px ${blr}px ${dark}, inset -${dist}px -${dist}px ${blr}px ${light}`;
      break;
  }

  const cssCode = `border-radius: ${radius[0]}px;
background: ${background};
box-shadow: ${boxShadow};`;

  return (
    <div
      className="grid lg:grid-cols-2 gap-8"
      style={{ backgroundColor: color, padding: "2rem", borderRadius: "1rem" }}
    >
      {/* Controls */}
      <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-sm space-y-6">
        <div className="space-y-4">
          <Label>Color Base</Label>
          <div className="flex gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="cursor-pointer"
            />
            <span className="text-sm font-mono self-center">{color}</span>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Shape</Label>
          <Tabs value={shape} onValueChange={(v) => setShape(v as NeumorphismShape)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="flat">Flat</TabsTrigger>
              <TabsTrigger value="pressed">Pressed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-2">
          <Label>Size ({size[0]}px)</Label>
          <Slider value={size} onValueChange={setSize} min={50} max={400} />
        </div>

        <div className="space-y-2">
          <Label>Radius ({radius[0]}px)</Label>
          <Slider value={radius} onValueChange={setRadius} min={0} max={100} />
        </div>

        <div className="space-y-2">
          <Label>Distance ({distance[0]}px)</Label>
          <Slider
            value={distance}
            onValueChange={setDistance}
            min={5}
            max={50}
          />
        </div>

        <div className="space-y-2">
          <Label>Blur ({blur[0]}px)</Label>
          <Slider value={blur} onValueChange={setBlur} min={0} max={100} />
        </div>

        <div className="relative pt-4">
          <Button
            className="w-full"
            onClick={() => {
              navigator.clipboard.writeText(cssCode);
              toast.success("Copied!");
            }}
          >
            <Copy className="h-4 w-4 mr-2" /> Copy CSS
          </Button>
        </div>
      </div>

      {/* Preview */}
      <div className="flex items-center justify-center min-h-[400px]">
        <div
          className="flex items-center justify-center text-slate-500 font-bold transition-all duration-300"
          style={{
            width: `${size[0]}px`,
            height: `${size[0]}px`,
            borderRadius: `${radius[0]}px`,
            background: color,
            boxShadow: boxShadow,
          }}
        >
          Soft UI
        </div>
      </div>
    </div>
  );
}
