"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { CopyButton } from "@/components/shared/copy-button";

export function WordCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    // 1. Logic การคำนวณสถิติ
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;

    // นับคำ (รองรับทั้งอังกฤษและไทยเบื้องต้นด้วยการ split space/newline)
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

    const sentences =
      text.trim() === "" ? 0 : text.split(/[.!?]+/).filter(Boolean).length;
    const paragraphs =
      text.trim() === "" ? 0 : text.split(/\n+/).filter(Boolean).length;

    // คำนวณเวลา (Average reading speed = 200 words/min)
    const readingTime = Math.ceil(words / 200);
    const speakingTime = Math.ceil(words / 130);

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime,
      speakingTime,
    };
  }, [text]);

  return (
    <div className="grid gap-6 lg:grid-cols-3 h-[calc(100vh-200px)] min-h-[500px]">
      {/* Input Area (2 cols) */}
      <div className="lg:col-span-2 flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Type or paste your text
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setText("")}
              className="text-xs text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-3 h-3 mr-2" />
              Clear
            </Button>
            <CopyButton text={text} />
          </div>
        </div>
        <Card className="flex-1">
          <CardContent className="p-0 h-full">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start typing here..."
              className="w-full h-full resize-none border-0 focus-visible:ring-0 p-4 text-base leading-relaxed"
            />
          </CardContent>
        </Card>
      </div>

      {/* Stats Area (1 col) */}
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Primary Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">
                  {stats.words}
                </div>
                <div className="text-xs text-muted-foreground uppercase">
                  Words
                </div>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">
                  {stats.characters}
                </div>
                <div className="text-xs text-muted-foreground uppercase">
                  Chars
                </div>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Chars (no spaces)</span>
                <span className="font-medium">{stats.charactersNoSpaces}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Sentences</span>
                <span className="font-medium">{stats.sentences}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Paragraphs</span>
                <span className="font-medium">{stats.paragraphs}</span>
              </div>
            </div>

            {/* Time Stats */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Reading Time</span>
                <span>~{stats.readingTime} min</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Speaking Time</span>
                <span>~{stats.speakingTime} min</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
