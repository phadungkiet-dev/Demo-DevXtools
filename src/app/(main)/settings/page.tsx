"use client";

// =============================================================================
// Imports
// =============================================================================
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner"; // Notification
// Hooks
import { useFavorites } from "@/hooks/useFavorites";
import { useRecentTools } from "@/hooks/useRecentTools";
// UI Components
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
// Icons
import {
  Trash2,
  Moon,
  Sun,
  Monitor,
  RotateCcw,
  Palette,
  Database,
} from "lucide-react";

// =============================================================================
// Main Component
// =============================================================================
export default function SettingsPage() {
  // --- Hooks & State ---
  const { theme, setTheme } = useTheme();
  const { favorites, clearFavorites } = useFavorites();
  const { recents, clearRecents } = useRecentTools();

  // Hydration Fix
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // --- Handlers ---

  const handleClearFavorites = () => {
    if (favorites.length === 0) return;

    // In a real app, prefer a Dialog component over window.confirm
    if (window.confirm("Are you sure you want to clear all favorite tools?")) {
      clearFavorites();
      toast.success("Favorites cleared successfully", {
        description: "All your saved tools have been removed.",
        icon: <Trash2 className="w-4 h-4 text-red-500" />,
      });
    }
  };

  const handleClearHistory = () => {
    if (recents.length === 0) return;

    if (window.confirm("Are you sure you want to clear your usage history?")) {
      clearRecents();
      toast.success("History cleared successfully", {
        description: "Your recent tools list is now empty.",
        icon: <RotateCcw className="w-4 h-4 text-blue-500" />,
      });
    }
  };

  // Prevent hydration mismatch for theme select
  if (!mounted) {
    return <div className="container max-w-4xl py-10 opacity-0" />; // Hide until mounted
  }

  return (
    <div className="container max-w-4xl py-10 space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-lg">
          Manage your application preferences and locally stored data.
        </p>
      </div>

      <Separator className="my-6" />

      {/* ================= SECTION 1: APPEARANCE ================= */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" /> Appearance
        </h2>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Interface Theme</CardTitle>
            <CardDescription>
              Select a theme that matches your preference or system settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <Label className="text-base font-medium">Color Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Current:{" "}
                  <span className="font-semibold capitalize text-foreground">
                    {theme}
                  </span>
                </p>
              </div>

              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4 text-amber-500" /> Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4 text-blue-500" /> Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-slate-500" /> System
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ================= SECTION 2: DATA MANAGEMENT ================= */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-red-600 dark:text-red-400">
          <Database className="w-5 h-5" /> Data Management
        </h2>

        <Card className="border-red-100 dark:border-red-900/30">
          <CardHeader>
            <CardTitle className="text-base">Local Data</CardTitle>
            <CardDescription>
              Manage data stored locally on your browser. These actions cannot
              be undone.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Row 1: Favorites */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="space-y-1">
                <Label className="text-base font-medium">Favorites List</Label>
                <p className="text-sm text-muted-foreground">
                  You have{" "}
                  <span className="font-mono font-bold text-foreground">
                    {favorites.length}
                  </span>{" "}
                  saved tools.
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearFavorites}
                disabled={favorites.length === 0}
                className="shrink-0 transition-all active:scale-95"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Favorites
              </Button>
            </div>

            {/* Row 2: History */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="space-y-1">
                <Label className="text-base font-medium">Usage History</Label>
                <p className="text-sm text-muted-foreground">
                  You have{" "}
                  <span className="font-mono font-bold text-foreground">
                    {recents.length}
                  </span>{" "}
                  items in recent history.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearHistory}
                disabled={recents.length === 0}
                className="shrink-0 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:hover:bg-red-950/20 dark:text-red-400 transition-all active:scale-95"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Clear History
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
