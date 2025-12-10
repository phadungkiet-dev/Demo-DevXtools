"use client";

import { useState, useEffect, useRef } from "react";
import QRCodeStyling, {
  DotType,
  CornerSquareType,
  CornerDotType,
  Options,
} from "qr-code-styling";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Upload, Image as ImageIcon, X } from "lucide-react";

// ค่า Default ของ QR Code
const defaultOptions: Options = {
  width: 300,
  height: 300,
  type: "svg",
  data: "https://example.com",
  image: "",
  dotsOptions: {
    color: "#000000",
    type: "rounded",
  },
  backgroundOptions: {
    color: "#ffffff",
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 10,
  },
  cornersSquareOptions: {
    type: "extra-rounded",
  },
};

export function QrGenerator() {
  const [url, setUrl] = useState("https://example.com");
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [dotType, setDotType] = useState<DotType>("rounded");
  const [cornerType, setCornerType] =
    useState<CornerSquareType>("extra-rounded");
  const [logo, setLogo] = useState<string | null>(null);

  const ref = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  // 1. Initialize QR Code Instance (Run once)
  useEffect(() => {
    qrCode.current = new QRCodeStyling(defaultOptions);
    if (ref.current) {
      qrCode.current.append(ref.current);
    }
  }, []);

  // 2. Update QR Code when state changes
  useEffect(() => {
    if (!qrCode.current) return;
    qrCode.current.update({
      data: url,
      dotsOptions: {
        color: color,
        type: dotType,
      },
      backgroundOptions: {
        color: bgColor,
      },
      cornersSquareOptions: {
        type: cornerType,
        color: color, // ให้สีกรอบตามสีจุด
      },
      cornersDotOptions: {
        type: cornerType as unknown as CornerDotType, // Type casting เล็กน้อยให้เข้ากัน
        color: color,
      },
      image: logo || undefined,
    });
  }, [url, color, bgColor, dotType, cornerType, logo]);

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = (ext: "png" | "svg") => {
    if (!qrCode.current) return;
    qrCode.current.download({
      name: "qr-code",
      extension: ext,
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12 h-full">
      {/* Settings Panel (Left) */}
      <div className="lg:col-span-5 space-y-6">
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* URL Input */}
            <div className="space-y-2">
              <Label>Content (URL or Text)</Label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL..."
              />
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>QR Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    className="w-12 p-1 h-10 cursor-pointer"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                  <Input
                    className="uppercase"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Background</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    className="w-12 p-1 h-10 cursor-pointer"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                  />
                  <Input
                    className="uppercase"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Styles Selectors */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Dots Style</Label>
                <Select
                  value={dotType}
                  onValueChange={(v) => setDotType(v as DotType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="dots">Dots</SelectItem>
                    <SelectItem value="rounded">Rounded</SelectItem>
                    <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                    <SelectItem value="classy">Classy</SelectItem>
                    <SelectItem value="classy-rounded">
                      Classy Rounded
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Corners Style</Label>
                <Select
                  value={cornerType}
                  onValueChange={(v) => setCornerType(v as CornerSquareType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="dot">Dot</SelectItem>
                    <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Logo Upload */}
            <div className="space-y-2">
              <Label>Logo (Optional)</Label>
              <div className="flex items-center gap-2">
                {logo ? (
                  <div className="flex items-center gap-2 w-full">
                    <div className="h-10 w-10 relative border rounded bg-muted/50 flex items-center justify-center overflow-hidden">
                      <img
                        src={logo}
                        alt="Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLogo(null)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="w-4 h-4 mr-2" /> Remove
                    </Button>
                  </div>
                ) : (
                  <div className="relative w-full">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <Button variant="outline" className="w-full" asChild>
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Logo
                      </label>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Panel (Right) */}
      <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-8">
        <Card className="p-8 bg-white/50 backdrop-blur-sm shadow-sm border overflow-hidden">
          {/* Container for QR Code Library */}
          <div ref={ref} className="bg-transparent" />
        </Card>

        <div className="flex gap-4">
          <Button size="lg" onClick={() => handleDownload("png")}>
            <Download className="w-4 h-4 mr-2" />
            Download PNG
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => handleDownload("svg")}
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Download SVG
          </Button>
        </div>
      </div>
    </div>
  );
}
