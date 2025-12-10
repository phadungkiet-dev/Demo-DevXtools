"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Upload,
  Download,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export function SvgToPngConverter() {
  const [svgFile, setSvgFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pngUrl, setPngUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 1. Handle File Upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "image/svg+xml") {
      toast.error("Please upload an SVG file.");
      return;
    }

    setSvgFile(file);
    // สร้าง URL สำหรับแสดง Preview ทันที
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setPngUrl(null); // Reset PNG เก่าทิ้ง
    toast.success("SVG uploaded successfully.");
  };

  // 2. Core Logic: Convert SVG to PNG using Canvas
  const convertToPng = () => {
    if (!svgFile || !previewUrl || !canvasRef.current) return;

    setIsConverting(true);
    const img = new Image();

    // สำคัญ: ต้องรอให้รูปโหลดเสร็จก่อนวาดลง Canvas
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        toast.error("Failed to get canvas context.");
        setIsConverting(false);
        return;
      }

      // กำหนดขนาด Canvas ตามขนาดรูปจริง
      canvas.width = img.width;
      canvas.height = img.height;

      // เคลียร์ Canvas และวาดรูปลงไป
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // แปลง Canvas เป็น PNG Blob URL
      try {
        const dataUrl = canvas.toDataURL("image/png");
        setPngUrl(dataUrl);
        toast.success("Converted to PNG successfully!");
      } catch (err) {
        toast.error(
          "Conversion failed. The SVG might be too complex or tainted."
        );
        console.error(err);
      } finally {
        setIsConverting(false);
      }
    };

    img.onerror = () => {
      toast.error("Failed to load SVG for conversion.");
      setIsConverting(false);
    };

    // เริ่มโหลดรูปจาก Preview URL
    img.src = previewUrl;
  };

  // 3. Helper to trigger download
  const downloadPng = () => {
    if (!pngUrl) return;
    const link = document.createElement("a");
    link.href = pngUrl;
    // ตั้งชื่อไฟล์ใหม่โดยเปลี่ยนนามสกุล
    link.download = svgFile
      ? svgFile.name.replace(".svg", ".png")
      : "converted-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setSvgFile(null);
    setPreviewUrl(null);
    setPngUrl(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
      {/* Left Column: Upload Area */}
      <div className="space-y-6">
        <div>
          <Label htmlFor="svg-upload" className="block mb-2">
            Upload SVG File
          </Label>
          <Card
            className={`border-2 border-dashed cursor-pointer transition-colors hover:border-primary/50 ${
              svgFile ? "bg-muted/30" : ""
            }`}
          >
            <CardContent className="p-0">
              <label
                htmlFor="svg-upload"
                className="flex flex-col items-center justify-center h-64 w-full cursor-pointer"
              >
                {svgFile ? (
                  <div className="text-center p-4 space-y-2">
                    <ImageIcon className="w-12 h-12 text-primary mx-auto" />
                    <p className="font-medium truncate max-w-[250px]">
                      {svgFile.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {(svgFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                ) : (
                  <div className="text-center p-4 space-y-2 text-muted-foreground">
                    <Upload className="w-12 h-12 mx-auto mb-2" />
                    <p>Click to upload or drag & drop</p>
                    <p className="text-xs">SVG files only</p>
                  </div>
                )}
                <Input
                  ref={inputRef}
                  id="svg-upload"
                  type="file"
                  accept=".svg"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </CardContent>
          </Card>
        </div>

        {svgFile && (
          <div className="flex gap-4">
            <Button
              onClick={convertToPng}
              disabled={isConverting || !!pngUrl}
              className="flex-1"
              size="lg"
            >
              {isConverting ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {pngUrl
                ? "Converted"
                : isConverting
                ? "Converting..."
                : "Convert to PNG"}
            </Button>
            <Button
              onClick={reset}
              variant="outline"
              size="icon"
              className="shrink-0"
            >
              <Trash2 className="w-5 h-5 text-destructive" />
            </Button>
          </div>
        )}

        {/* Hidden Canvas for conversion */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Right Column: Preview & Download */}
      <div className="space-y-6">
        <Label className="block mb-2">Preview & Download</Label>
        <Card className="h-64 flex items-center justify-center bg-muted/20 relative overflow-hidden">
          {/* แสดง Background ลายตารางหมากรุกเพื่อให้เห็นความโปร่งใส */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZjBmMGYwIi8+PHJlY3QgeD0iOCIgeT0iOCIgd2lkdGg9IjgiIGhlaWdodD0iOCIgZmlsbD0iI2YwZjBmMCIvPjwvc3ZnPg==')] opacity-50 z-0 pointer-events-none" />

          {previewUrl ? (
            <div className="relative z-10 p-4 max-w-full max-h-full flex items-center justify-center">
              {/* แสดงรูป Preview (ใช้รูป PNG ถ้าแปลงเสร็จแล้ว) */}
              <img
                src={pngUrl || previewUrl}
                alt="Preview"
                className="max-w-full max-h-[200px] object-contain shadow-sm"
              />
            </div>
          ) : (
            <div className="text-muted-foreground z-10 flex flex-col items-center">
              <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
              <span>No image selected</span>
            </div>
          )}
        </Card>

        {pngUrl && (
          <Button
            onClick={downloadPng}
            className="w-full"
            size="lg"
            variant="secondary"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PNG
          </Button>
        )}
      </div>
    </div>
  );
}
