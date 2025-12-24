"use client";

// Imports ==================
import { useState, useMemo } from "react";
// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
// Icons (เหลือเฉพาะที่ใช้ใน Layout หลัก)
import {
  Type,
  FileText, // Icon for stats
} from "lucide-react";
// Shared Components
import {
  CopyButton,
  DownloadButton,
  DemoButton,
  PasteButton,
  ClearButton,
} from "@/components/shared/buttons";
// Utils & Libs
import { cn } from "@/lib/utils";
// Logic
import { transformers, caseLabels, CaseType } from "@/lib/transformers";

// Main Component ===============
export function CaseConverter() {
  // --- State Management ---
  const [input, setInput] = useState("");

  /**
   * 📊 Derived State: Statistics
   * คำนวณจำนวนตัวอักษร, คำ, และบรรทัด แบบ Real-time
   */
  const stats = useMemo(() => {
    return {
      chars: input.length,
      words: input.trim() ? input.trim().split(/\s+/).length : 0,
      lines: input ? input.split(/\r\n|\r|\n/).length : 0,
    };
  }, [input]);

  /**
   * 🚀 Helper: Load Demo Text
   */
  const handleDemo = () => {
    setInput("Hello World welcome to CodeXKit Case Converter Tool");
  };

  return (
    <div
      className={cn(
        // Layout (ระยะห่างระหว่างลูกๆ)
        "space-y-6",
        // Animation Core (ท่าทาง: เริ่มต้น + จางเข้า + ลอยขึ้น)
        "animate-in fade-in slide-in-from-bottom-4",
        // Animation Timing (ความเร็วและจังหวะ)
        "duration-600 ease-out",
        // Animation Staging (การรอ: รอ 0.2 วินาที ก่อนเริ่มเพื่อให้แม่มาครบก่อน)
        "delay-200 fill-mode-backwards"
      )}
    >
      {/* ================= INPUT SECTION ================= */}
      <Card className="border-border/60 shadow-md flex flex-col overflow-hidden bg-card p-0 transition-all hover:shadow-lg gap-2 sm:gap-4">
        {/* Toolbar Header */}
        <div
          className={cn(
            // Layout & Direction (การจัดวางและทิศทาง)
            "flex flex-col items-center sm:flex-row justify-between",
            // Sizing & Spacing
            "min-h-[60px] px-6 py-4 md:py-2 gap-4 sm:gap-0",
            // Visuals
            "bg-muted/40 border-b border-border/60"
          )}
        >
          <div className="flex items-center gap-3 ">
            <div className="p-2 bg-primary/10 rounded-md text-primary shadow-sm">
              <Type size={16} />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              Input Text
            </span>
          </div>

          {/* Refactored Toolbar Buttons: ใช้ Shared Components */}
          <div
            className={cn(
              // Layout & Sizing
              "flex flex-wrap items-center gap-1",
              "w-full sm:w-auto",
              // Alignment
              "justify-center",
              "sm:justify-end"
            )}
          >
            <DemoButton onDemo={handleDemo} />

            <div className="w-px h-4 bg-border mx-1 hidden sm:block" />

            {/* PasteButton จัดการ Clipboard logic ภายในตัว */}
            <PasteButton onPaste={setInput} />

            {/* ClearButton จัดการ Style สีแดงเมื่อ Hover */}
            <ClearButton onClear={() => setInput("")} disabled={!input} />
          </div>
        </div>

        {/* Text Area with Stats Overlay */}
        <CardContent className="px-1 py-1 relative min-h-[100px] sm:min-h-[180px] ">
          <Textarea
            id="input-text"
            className={cn(
              // Layout & Sizing (ขนาดและรูปทรง)
              "w-full h-full min-h-[180px] resize-y overflow-y-auto",
              // Spacing (ระยะห่างภายใน)
              "p-4 pb-12",
              // Typography & Placeholder (ตัวอักษร)
              "text-base leading-relaxed font-mono text-foreground/90",
              "placeholder:text-muted-foreground/60",
              // Appearance Reset (ลบเส้นขอบและพื้นหลังเดิม)
              "border-0 focus-visible:ring-0 bg-transparent rounded-none shadow-none",
              // Scrollbar & Selection (การเลื่อนและไฮไลท์)
              "scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent",
              "selection:bg-primary/20"
            )}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste your text here..."
            spellCheck={false}
          />

          {/* Real-time Statistics Overlay */}

          <div
            className={cn(
              // Positioning & Layout
              "absolute bottom-3 right-4 flex items-center gap-3",
              // Typography
              "text-[10px] font-mono font-medium text-muted-foreground/70",
              // Spacing & Shape
              "px-3 py-1.5 rounded-full",
              // Visuals (Background, Border, Shadow)
              "bg-background/80 backdrop-blur-sm border border-border/40 shadow-sm",
              // Interactivity & Animation
              "select-none pointer-events-none transition-opacity duration-200"
            )}
          >
            {/* flex items-center gap-1.5 */}
            <div className="flex items-center gap-1">
              <FileText size={10} />
              <span>{stats.chars} chars</span>
            </div>
            <span className="w-px h-3 bg-border/50" />
            <span>{stats.words} words</span>
            <span className="w-px h-3 bg-border/50" />
            <span>{stats.lines} lines</span>
          </div>
        </CardContent>
      </Card>

      {/* ================= OUTPUTS GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(Object.keys(transformers) as CaseType[]).map((key) => {
          // Calculate result on the fly (Fast & Efficient)
          const result = input ? transformers[key](input) : "";
          return (
            <Card
              key={key}
              className="overflow-hidden group border border-border/50 hover:border-primary/10 transition-all duration-200 hover:shadow-md bg-card/50 p-0"
            >
              <CardContent className="p-4 space-y-3">
                {/* Output Header */}
                <div className="flex items-center justify-between min-h-[30px]">
                  <span
                    className={cn(
                      // Typography (ตัวอักษร)
                      "text-[10px] font-bold uppercase tracking-widest",
                      "text-muted-foreground",
                      // Shape & Spacing (รูปทรงและระยะ)
                      "px-2.5 py-1 rounded-md border border-border/60",
                      // Background (สีพื้นหลังปกติ)
                      "bg-muted/30",
                      // Interactive States (เมื่อ Hover ที่ Group แม่)
                      "group-hover:bg-primary/5 group-hover:text-primary",
                      "transition-colors"
                    )}
                  >
                    {caseLabels[key]}
                  </span>

                  {/* UX Fix for Mobile */}
                  <div
                    className={cn(
                      "flex items-center gap-1 transition-opacity duration-200",
                      "opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                    )}
                  >
                    <DownloadButton
                      text={result}
                      filename={`converted-${key}.txt`}
                      className="h-6 w-6 text-muted-foreground hover:text-primary hover:bg-primary/10"
                    />
                    <CopyButton
                      text={result}
                      className="h-6 w-6 text-muted-foreground hover:text-primary hover:bg-primary/10"
                    />
                  </div>
                </div>

                {/* Output Display */}
                <div
                  className={cn(
                    // Layout & Sizing (ขนาดและการจัดวาง)
                    "min-h-[60px] max-h-[160px] overflow-y-auto relative",
                    // Spacing & Shape (ขอบและระยะห่าง)
                    "p-2 rounded-lg border border-border/40",
                    // Typography (รูปแบบตัวอักษร)
                    "font-mono text-sm break-all",
                    // Scrollbar & Transition (สไตล์สโครลบาร์และอนิเมชั่น)
                    "scrollbar-thin scrollbar-thumb-muted-foreground/20 transition-colors",
                    // Conditional State (เปลี่ยนสีพื้นหลัง/ตัวอักษรตามสถานะมีข้อมูลหรือไม่)
                    result
                      ? "bg-muted/20 text-foreground"
                      : "bg-muted/20 text-muted-foreground/60"
                  )}
                >
                  {result || (
                    <span className="text-muted-foreground/40 italic select-none text-xs flex items-center justify-center h-full">
                      Waiting for input...
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
