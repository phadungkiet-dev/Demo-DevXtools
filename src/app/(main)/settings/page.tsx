"use client";

import { useTheme } from "next-themes";
import { useFavorites } from "@/hooks/useFavorites";
import { useRecentTools } from "@/hooks/useRecentTools";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Trash2, Moon, Sun, Monitor, RotateCcw } from "lucide-react";
import { toast } from "sonner"; // ถ้าคุณมี toast library (ถ้าไม่มีให้ลบออกได้)

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { favorites, clearFavorites } = useFavorites();
  const { recents, clearRecents } = useRecentTools();

  // Handler: Clear Favorites
  const handleClearFavorites = () => {
    if (favorites.length === 0) return;
    if (confirm("Are you sure you want to clear all favorites?")) {
      clearFavorites();
      // toast.success("Favorites cleared"); // Uncomment ถ้าใช้ Toast
    }
  };

  // Handler: Clear History
  const handleClearHistory = () => {
    if (recents.length === 0) return;
    if (confirm("Are you sure you want to clear your usage history?")) {
      clearRecents();
      // toast.success("History cleared");
    }
  };

  return (
    <div className="container max-w-4xl py-10 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your preferences and data.
        </p>
      </div>

      <Separator />

      {/* --- Section 1: Appearance --- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5" /> Appearance
          </CardTitle>
          <CardDescription>
            Customize how DevToolX looks on your device.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Theme</Label>
              <div className="text-sm text-muted-foreground">
                Select your preferred theme.
              </div>
            </div>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" /> Light
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" /> Dark
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" /> System
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* --- Section 2: Data Management --- */}
      <Card className="border-red-200 dark:border-red-900/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <Trash2 className="h-5 w-5" /> Data Management
          </CardTitle>
          <CardDescription>
            Manage your locally stored data. This actions cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Clear Favorites */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Clear Favorites</Label>
              <div className="text-sm text-muted-foreground">
                Remove all {favorites.length} saved tools from your favorites
                list.
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearFavorites}
              disabled={favorites.length === 0}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Favorites
            </Button>
          </div>

          <Separator />

          {/* Clear History */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Clear History</Label>
              <div className="text-sm text-muted-foreground">
                Remove all {recents.length} items from your recently used
                history.
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200"
              onClick={handleClearHistory}
              disabled={recents.length === 0}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
