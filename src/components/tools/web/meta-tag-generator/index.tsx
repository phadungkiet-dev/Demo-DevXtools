"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/shared/copy-button";
import { RefreshCw, Globe, ImageIcon } from "lucide-react";

export function MetaTagGenerator() {
  const [values, setValues] = useState({
    title: "My Awesome Website",
    description: "This is a description of my awesome website.",
    url: "https://example.com",
    image: "https://example.com/og-image.jpg",
    author: "",
  });

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  // Generate Code Snippets
  const metaCode = `
<title>${values.title}</title>
<meta name="title" content="${values.title}" />
<meta name="description" content="${values.description}" />

<meta property="og:type" content="website" />
<meta property="og:url" content="${values.url}" />
<meta property="og:title" content="${values.title}" />
<meta property="og:description" content="${values.description}" />
<meta property="og:image" content="${values.image}" />

<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${values.url}" />
<meta property="twitter:title" content="${values.title}" />
<meta property="twitter:description" content="${values.description}" />
<meta property="twitter:image" content="${values.image}" />
`.trim();

  return (
    <div className="grid gap-8 lg:grid-cols-12 h-full">
      {/* Input Form (Left) */}
      <div className="lg:col-span-5 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Site Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Site Title</Label>
              <Input
                value={values.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g. My Website"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={values.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Brief description of your website..."
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">
                {values.description.length} chars (Recommended: 150-160)
              </p>
            </div>
            <div className="space-y-2">
              <Label>Website URL</Label>
              <Input
                value={values.url}
                onChange={(e) => handleChange("url", e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>Image URL (OG/Twitter)</Label>
              <div className="flex gap-2">
                <Input
                  value={values.image}
                  onChange={(e) => handleChange("image", e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview & Code (Right) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="preview">Social Previews</TabsTrigger>
            <TabsTrigger value="code">Generated Code</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-6 mt-4">
            {/* Google Search Result Preview */}
            <Card>
              <CardContent className="p-4 space-y-1">
                <div className="text-xs text-muted-foreground mb-2 font-bold uppercase tracking-wider">
                  Google Search
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground/80">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                    <Globe className="w-3 h-3 text-gray-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-foreground/70">
                      {values.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {values.url}
                    </span>
                  </div>
                </div>
                <div className="text-xl text-[#1a0dab] dark:text-[#8ab4f8] font-medium hover:underline cursor-pointer truncate">
                  {values.title}
                </div>
                <div className="text-sm text-foreground/80 line-clamp-2">
                  {values.description}
                </div>
              </CardContent>
            </Card>

            {/* Social Card Preview (Generic for FB/Twitter) */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-muted/30 p-4 border-b">
                  <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                    Facebook / Twitter (Large)
                  </div>
                </div>
                <div className="border m-4 rounded-lg overflow-hidden shadow-sm">
                  {/* Fake Image Area */}
                  <div className="h-[200px] w-full bg-muted flex items-center justify-center overflow-hidden relative">
                    {values.image ? (
                      <img
                        src={values.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) =>
                          (e.currentTarget.style.display = "none")
                        }
                      />
                    ) : null}
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50 pointer-events-none">
                      {!values.image && <ImageIcon className="w-12 h-12" />}
                    </div>
                  </div>
                  <div className="p-3 bg-background border-t">
                    <div className="text-xs text-muted-foreground uppercase mb-1 truncate">
                      {new URL(
                        values.url || "https://example.com"
                      ).hostname.toUpperCase()}
                    </div>
                    <div className="font-bold text-foreground truncate mb-1">
                      {values.title}
                    </div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {values.description}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="code" className="h-[500px]">
            <Card className="h-full flex flex-col bg-muted/30">
              <CardContent className="p-0 flex-1 relative overflow-hidden">
                <div className="absolute top-2 right-2 z-10">
                  <CopyButton text={metaCode} />
                </div>
                <Textarea
                  value={metaCode}
                  readOnly
                  className="w-full h-full resize-none border-0 bg-transparent p-4 font-mono text-sm leading-relaxed text-primary focus-visible:ring-0"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
