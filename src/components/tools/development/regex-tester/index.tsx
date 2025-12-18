"use client";

import { useState, useMemo } from "react";

// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";

// Icons
import {
  Code2,
  Settings2,
  AlertCircle,
  List,
  Highlighter,
  HelpCircle,
} from "lucide-react";

// Shared Components
import {
  CopyButton,
  ClearButton,
  PasteButton,
} from "@/components/shared/buttons";
import { cn } from "@/lib/utils";

// =============================================================================
// Constants
// =============================================================================
const FLAGS = [
  {
    key: "g",
    label: "lobal search",
    highlight: "G",
    desc: "Don't return after first match",
  },
  // ✅ 2. เปลี่ยนเป็น Ignore case เพื่อให้ I เป็นตัวหนาและสื่อความหมายตรงตัว
  {
    key: "i",
    label: "gnore case",
    highlight: "I",
    desc: "Case differences are ignored",
  },
  {
    key: "m",
    label: "ultiline",
    highlight: "M",
    desc: "^ and $ match start/end of line",
  },
  { key: "s", label: "ingle line", highlight: "S", desc: ". matches newline" },
  {
    key: "u",
    label: "nicode",
    highlight: "U",
    desc: "Enable full unicode support",
  },
];

// =============================================================================
// Main Component
// =============================================================================
export function RegexTester() {
  // --- State ---
  const [pattern, setPattern] = useState(
    "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"
  );
  const [flags, setFlags] = useState<string[]>(["g", "i"]);
  const [testString, setTestString] = useState(
    "Contact us at support@example.com or admin@site.org for help."
  );
  const [activeTab, setActiveTab] = useState("highlight");

  // --- Logic: Process Regex ---
  const result = useMemo(() => {
    if (!pattern) return { matches: [], error: null };

    try {
      const cleanPattern = pattern.replace(/\n/g, "");
      const regex = new RegExp(cleanPattern, flags.join(""));
      const matches = Array.from(testString.matchAll(regex));
      return { matches, error: null };
    } catch (err) {
      return { matches: [], error: (err as Error).message };
    }
  }, [pattern, flags, testString]);

  // --- Helper: Highlight Renderer ---
  const renderHighlightedText = () => {
    if (result.error || !pattern) return testString;
    if (result.matches.length === 0)
      return <span className="text-muted-foreground">{testString}</span>;

    let lastIndex = 0;
    const elements: React.ReactNode[] = [];

    result.matches.forEach((match, i) => {
      const startIndex = match.index!;
      const endIndex = startIndex + match[0].length;

      if (startIndex > lastIndex) {
        elements.push(
          <span key={`text-${i}`}>
            {testString.slice(lastIndex, startIndex)}
          </span>
        );
      }

      elements.push(
        <mark
          key={`match-${i}`}
          className="bg-primary/20 text-primary border-b-2 border-primary/50 rounded-sm px-0.5 mx-0.5 font-medium animate-in fade-in"
          title={`Match #${i + 1}`}
        >
          {match[0]}
        </mark>
      );

      lastIndex = endIndex;
    });

    if (lastIndex < testString.length) {
      elements.push(<span key="text-end">{testString.slice(lastIndex)}</span>);
    }

    return elements;
  };

  return (
    // ✅ 3. ปรับ Gap หลักให้เป็น gap-4 เท่ากันทั้งระบบ (เดิม gap-6)
    <div className="flex flex-col gap-4 h-full min-h-[600px] animate-in fade-in duration-500">
      {/* ================= TOP: REGEX INPUT ================= */}
      <Card className="border-border/60 shadow-md bg-card p-0 overflow-hidden">
        <div className="flex flex-col md:flex-row gap-4 p-4 items-start">
          {/* Pattern Input (Textarea) */}
          {/* ✅ 1. เพิ่ม min-w-0 เพื่อป้องกัน Textarea ดัน Layout จนปุ่มหลุดจอ */}
          <div className="flex-1 w-full min-w-0 relative group">
            <div className="absolute left-3 top-3 text-muted-foreground font-mono text-lg select-none pointer-events-none">
              /
            </div>

            <Textarea
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className={cn(
                "font-mono text-lg pl-6 pr-14 min-h-[60px] resize-y border-2 transition-all leading-relaxed",
                result.error
                  ? "border-destructive/50 focus-visible:ring-destructive/30 bg-destructive/5"
                  : "focus-visible:border-primary/50"
              )}
              placeholder="Enter regex pattern..."
              spellCheck={false}
            />

            <div className="absolute right-3 top-3 text-muted-foreground font-mono text-lg select-none pointer-events-none bg-background/80 pl-1 rounded-sm">
              /{flags.join("")}
            </div>
          </div>

          {/* ✅ 1. เพิ่ม shrink-0 เพื่อป้องกันปุ่มโดนบีบ */}
          <div className="flex items-start gap-2 shrink-0 self-center">
            {/* Flags Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-[60px] px-4 gap-2 min-w-[120px] flex flex-col items-start justify-center"
                >
                  <div className="flex items-center gap-2 w-full justify-center">
                    <Settings2 size={16} />
                    <span className="font-semibold">Flags</span>
                  </div>
                  {/* {flags.length > 0 ? (
                    <Badge
                      variant="secondary"
                      className="mt-1 h-5 px-1.5 text-[10px] w-full justify-center"
                    >
                      {flags.join("")}
                    </Badge>
                  ) : (
                    <span className="text-[10px] text-muted-foreground mt-1">
                      None
                    </span>
                  )} */}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Expression Flags</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {FLAGS.map((flag) => (
                  <DropdownMenuCheckboxItem
                    key={flag.key}
                    checked={flags.includes(flag.key)}
                    onCheckedChange={(checked) => {
                      setFlags((prev) =>
                        checked
                          ? [...prev, flag.key]
                          : prev.filter((f) => f !== flag.key)
                      );
                    }}
                  >
                    <span className="font-mono font-bold w-6 text-primary">
                      {flag.key}
                    </span>
                    <span className="text-muted-foreground text-xs ml-2">
                      <strong className="text-foreground">
                        {flag.highlight}
                      </strong>
                      {flag.label}
                    </span>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <RegexCheatsheetDialog />
          </div>
        </div>

        {/* Error Message */}
        {result.error && (
          <div className="px-4 pb-3 text-xs text-destructive font-medium flex items-center gap-2 animate-in slide-in-from-top-1">
            <AlertCircle size={14} />
            Invalid Regex: {result.error}
          </div>
        )}
      </Card>

      {/* ================= MAIN CONTENT: SPLIT VIEW ================= */}
      {/* ✅ 3. ปรับ gap เป็น 4 ให้เท่ากัน */}
      <div className="grid lg:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* LEFT: TEST STRING */}
        <Card className="flex flex-col overflow-hidden border-border/60 shadow-md h-[400px] lg:h-auto p-0">
          <div className="flex items-center justify-between px-4 h-[60px] border-b border-border/40 bg-muted/30 shrink-0">
            <span className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <Code2 size={16} /> Test String
            </span>
            <div className="flex items-center gap-1">
              <PasteButton onPaste={setTestString} />
              <ClearButton
                onClear={() => setTestString("")}
                disabled={!testString}
              />
            </div>
          </div>
          <CardContent className="p-0 flex-1 relative">
            <Textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              className="w-full h-full resize-none border-0 focus-visible:ring-0 p-4 font-mono text-sm leading-relaxed bg-transparent rounded-none shadow-none scrollbar-thin"
              placeholder="Paste your text here to test..."
              spellCheck={false}
            />
          </CardContent>
        </Card>

        {/* RIGHT: RESULTS */}
        <Card className="flex flex-col overflow-hidden border-border/60 shadow-md h-[400px] lg:h-auto p-0">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex flex-col h-full gap-6"
          >
            <div className="flex items-center justify-between px-4 h-[60px] border-b border-border/40 bg-muted/30 shrink-0">
              <TabsList className="h-9 bg-muted/50">
                <TabsTrigger value="highlight" className="text-xs h-8 px-3">
                  <Highlighter size={14} className="mr-2" /> Highlight
                </TabsTrigger>
                <TabsTrigger value="list" className="text-xs h-8 px-3">
                  <List size={14} className="mr-2" /> Match List
                </TabsTrigger>
              </TabsList>

              <div className="hidden sm:block text-xs text-muted-foreground font-mono bg-background/50 px-2 py-1 rounded border">
                {result.matches.length} matches
              </div>
            </div>

            <TabsContent
              value="highlight"
              className="flex-1 p-0 m-0 relative min-h-0"
            >
              <ScrollArea className="h-full w-full">
                <div className="p-4 font-mono text-sm leading-relaxed break-words whitespace-pre-wrap">
                  {renderHighlightedText()}
                </div>
              </ScrollArea>
              <div className="absolute bottom-4 right-4 z-10">
                <CopyButton
                  text={result.matches.map((m) => m[0]).join("\n")}
                  disabled={result.matches.length === 0}
                  className="shadow-lg border bg-background hover:bg-muted"
                />
              </div>
            </TabsContent>

            <TabsContent
              value="list"
              className="flex-1 p-0 m-0 min-h-0 bg-muted/10"
            >
              <ScrollArea className="h-full">
                {result.matches.length > 0 ? (
                  <div className="divide-y divide-border/40">
                    {result.matches.map((match, i) => (
                      <div
                        key={i}
                        className="p-3 px-4 hover:bg-muted/30 transition-colors group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Badge
                            variant="outline"
                            className="font-mono text-[10px] h-5 bg-background/50"
                          >
                            Match #{i + 1}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            Index: {match.index}
                          </span>
                        </div>
                        <div className="font-mono text-sm text-primary mb-2 break-all font-semibold bg-primary/5 p-2 rounded border border-primary/10">
                          {match[0]}
                        </div>

                        {match.length > 1 && (
                          <div className="pl-2 ml-1 border-l-2 border-dashed border-border/60 space-y-1.5">
                            {Array.from(match)
                              .slice(1)
                              .map((group, groupIndex) => (
                                <div
                                  key={groupIndex}
                                  className="text-xs flex flex-col sm:flex-row sm:gap-2"
                                >
                                  <span className="text-muted-foreground min-w-[60px] font-medium">
                                    Group {groupIndex + 1}:
                                  </span>
                                  <span className="font-mono text-foreground break-all bg-background px-1.5 rounded border border-border/50 inline-block">
                                    {group || (
                                      <span className="text-muted-foreground italic">
                                        undefined
                                      </span>
                                    )}
                                  </span>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground/40 gap-3">
                    <AlertCircle size={40} strokeWidth={1} />
                    <p className="text-sm">No matches found</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

// =============================================================================
// Helper: Regex Cheat Sheet Dialog
// =============================================================================
function RegexCheatsheetDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-[60px] w-[60px] flex flex-col gap-1 items-center justify-center text-muted-foreground hover:text-foreground"
          title="Regex Reference"
        >
          <HelpCircle size={20} />
          <span className="text-[10px] uppercase font-bold">Help</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl max-h-[85vh] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b shrink-0 bg-background/95 backdrop-blur z-10">
          <DialogTitle>Regex Cheatsheet</DialogTitle>
          <DialogDescription>
            Common regular expression syntax reference.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 bg-muted/10">
          <div className="grid md:grid-cols-2 gap-6">
            <section className="space-y-3">
              <h4 className="text-sm font-bold border-l-4 border-primary pl-2">
                Character Classes
              </h4>
              <TableWrapper>
                <TableBody>
                  <Row code="." desc="Any character except newline" />
                  <Row code="\w" desc="Word (a-z, A-Z, 0-9, _)" />
                  <Row code="\d" desc="Digit (0-9)" />
                  <Row code="\s" desc="Whitespace (space, tab, newline)" />
                  <Row code="\W" desc="Not word" />
                  <Row code="\D" desc="Not digit" />
                  <Row code="\S" desc="Not whitespace" />
                  <Row code="[abc]" desc="Any of a, b, or c" />
                  <Row code="[^abc]" desc="Not a, b, or c" />
                  <Row code="[a-g]" desc="Character between a & g" />
                </TableBody>
              </TableWrapper>
            </section>

            <section className="space-y-3">
              <h4 className="text-sm font-bold border-l-4 border-indigo-500 pl-2">
                Anchors
              </h4>
              <TableWrapper>
                <TableBody>
                  <Row code="^abc" desc="Start of string/line" />
                  <Row code="abc$" desc="End of string/line" />
                  <Row code="\b" desc="Word boundary" />
                  <Row code="\B" desc="Non-word boundary" />
                </TableBody>
              </TableWrapper>
            </section>

            <section className="space-y-3">
              <h4 className="text-sm font-bold border-l-4 border-emerald-500 pl-2">
                Escaped Characters
              </h4>
              <TableWrapper>
                <TableBody>
                  <Row code="\." desc="Escaped dot" />
                  <Row code="\*" desc="Escaped asterisk" />
                  <Row code="\\" desc="Escaped backslash" />
                  <Row code="\t" desc="Tab" />
                  <Row code="\n" desc="Newline" />
                  <Row code="\r" desc="Carriage return" />
                </TableBody>
              </TableWrapper>
            </section>

            <section className="space-y-3">
              <h4 className="text-sm font-bold border-l-4 border-orange-500 pl-2">
                Groups & Lookaround
              </h4>
              <TableWrapper>
                <TableBody>
                  <Row code="(abc)" desc="Capture group" />
                  <Row code="(?:abc)" desc="Non-capturing group" />
                  <Row code="(?=abc)" desc="Positive lookahead" />
                  <Row code="(?!abc)" desc="Negative lookahead" />
                </TableBody>
              </TableWrapper>
            </section>

            {/* ✅ 4. แก้ปัญหาช่องว่างโดยการรวม 2 ตารางเล็กเป็น 1 ตารางใหญ่ หรือเอา Grid Col Span เต็ม */}
            <section className="space-y-3 md:col-span-2">
              <h4 className="text-sm font-bold border-l-4 border-pink-500 pl-2">
                Quantifiers & Alternation
              </h4>
              {/* รวมเป็น Table เดียวเพื่อลบช่องว่าง (Gap) ระหว่างตาราง */}
              <TableWrapper>
                <TableBody>
                  {/* แบ่งเป็น 2 คอลัมน์ภายใน Row เดียวกันได้ ถ้าอยากให้แน่นขึ้น แต่ Table Row ปกติจะง่ายกว่า */}
                  <Row code="a*" desc="0 or more" />
                  <Row code="a+" desc="1 or more" />
                  <Row code="a?" desc="0 or 1" />
                  <Row code="a{5}" desc="Exactly 5" />
                  <Row code="a{2,}" desc="2 or more" />
                  <Row code="a{1,3}" desc="Between 1 and 3" />
                  <Row code="a|b" desc="Match a or b" />
                </TableBody>
              </TableWrapper>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper Components
const TableWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-md border bg-background overflow-hidden">
    <Table>{children}</Table>
  </div>
);

const Row = ({ code, desc }: { code: string; desc: string }) => (
  <TableRow className="h-9 hover:bg-muted/50">
    <TableCell className="font-mono text-xs font-bold text-primary bg-muted/30 w-[80px] text-center border-r">
      {code}
    </TableCell>
    <TableCell className="text-xs text-muted-foreground px-4">{desc}</TableCell>
  </TableRow>
);
