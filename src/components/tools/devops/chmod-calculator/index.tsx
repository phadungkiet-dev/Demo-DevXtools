"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/shared/buttons/copy-button";

type PermissionGroup = "owner" | "group" | "public";
type PermissionType = "read" | "write" | "execute";

interface Permissions {
  owner: { read: boolean; write: boolean; execute: boolean };
  group: { read: boolean; write: boolean; execute: boolean };
  public: { read: boolean; write: boolean; execute: boolean };
}

export function ChmodCalculator() {
  const [permissions, setPermissions] = useState<Permissions>({
    owner: { read: true, write: true, execute: true }, // 7
    group: { read: true, write: false, execute: true }, // 5
    public: { read: true, write: false, execute: true }, // 5
  });

  // Calculate Octal (e.g., "755")
  const calculateOctal = (p: {
    read: boolean;
    write: boolean;
    execute: boolean;
  }) => {
    let score = 0;
    if (p.read) score += 4;
    if (p.write) score += 2;
    if (p.execute) score += 1;
    return score;
  };

  const octalValue = `${calculateOctal(permissions.owner)}${calculateOctal(
    permissions.group
  )}${calculateOctal(permissions.public)}`;

  // Calculate Symbolic (e.g., "-rwxr-xr-x")
  const calculateSymbol = (p: {
    read: boolean;
    write: boolean;
    execute: boolean;
  }) => {
    return `${p.read ? "r" : "-"}${p.write ? "w" : "-"}${
      p.execute ? "x" : "-"
    }`;
  };

  const symbolicValue = `-${calculateSymbol(
    permissions.owner
  )}${calculateSymbol(permissions.group)}${calculateSymbol(
    permissions.public
  )}`;

  const togglePermission = (group: PermissionGroup, type: PermissionType) => {
    setPermissions((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [type]: !prev[group][type],
      },
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Result Display */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 flex flex-col items-center justify-center space-y-2">
            <span className="text-sm text-muted-foreground uppercase font-bold tracking-widest">
              Octal
            </span>
            <div className="flex items-center gap-2">
              <span className="text-5xl font-mono font-bold text-primary">
                {octalValue}
              </span>
              <CopyButton text={octalValue} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/30">
          <CardContent className="p-6 flex flex-col items-center justify-center space-y-2">
            <span className="text-sm text-muted-foreground uppercase font-bold tracking-widest">
              Symbolic
            </span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-mono text-foreground">
                {symbolicValue}
              </span>
              <CopyButton text={symbolicValue} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Permission Grid */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PermissionColumn
              label="Owner"
              data={permissions.owner}
              onChange={(type) => togglePermission("owner", type)}
            />
            <PermissionColumn
              label="Group"
              data={permissions.group}
              onChange={(type) => togglePermission("group", type)}
            />
            <PermissionColumn
              label="Public"
              data={permissions.public}
              onChange={(type) => togglePermission("public", type)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PermissionColumn({
  label,
  data,
  onChange,
}: {
  label: string;
  data: { read: boolean; write: boolean; execute: boolean };
  onChange: (type: PermissionType) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="pb-2 border-b text-center font-semibold text-lg text-primary">
        {label}
      </div>
      <div className="space-y-4 px-4">
        <div
          className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
          onClick={() => onChange("read")}
        >
          <Label className="cursor-pointer">Read (4)</Label>
          <Checkbox
            checked={data.read}
            onCheckedChange={() => onChange("read")}
          />
        </div>
        <div
          className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
          onClick={() => onChange("write")}
        >
          <Label className="cursor-pointer">Write (2)</Label>
          <Checkbox
            checked={data.write}
            onCheckedChange={() => onChange("write")}
          />
        </div>
        <div
          className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
          onClick={() => onChange("execute")}
        >
          <Label className="cursor-pointer">Execute (1)</Label>
          <Checkbox
            checked={data.execute}
            onCheckedChange={() => onChange("execute")}
          />
        </div>
      </div>
    </div>
  );
}
