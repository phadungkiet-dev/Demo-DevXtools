"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { transformers, caseLabels, CaseType } from "@/lib/transformers";
import { CopyButton } from "@/components/shared/copy-button";

export function CaseConverter() {
  const [input, setInput] = useState("");

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="input-text">Input Text</Label>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-8 text-muted-foreground hover:text-destructive"
            onClick={() => setInput("")}
            disabled={!input}
          >
            <Trash2 className="mr-2 h-3 w-3" />
            Clear
          </Button>
        </div>
        <Textarea
          id="input-text"
          placeholder="Type or paste your text here..."
          className="min-h-[150px] font-mono text-base resize-y"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      {/* Outputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Object.keys(transformers) as CaseType[]).map((key) => {
          const result = input ? transformers[key](input) : "";

          return (
            <Card
              key={key}
              className="overflow-hidden group hover:border-primary/50 transition-colors"
            >
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {caseLabels[key]}
                  </span>
                  <CopyButton text={result} className="h-6 w-6" />
                </div>
                <div className="min-h-[2.5rem] p-2 bg-muted/50 rounded-md font-mono text-sm break-all relative">
                  {result || (
                    <span className="text-muted-foreground/40 italic">
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
