"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/shared/copy-button";
import { Trash2 } from "lucide-react";

export function NumberBaseConverter() {
  const [values, setValues] = useState({
    decimal: "",
    hex: "",
    binary: "",
    octal: "",
  });

  const [error, setError] = useState<string | null>(null);

  // Helper: ตรวจสอบอักขระที่อนุญาต
  const validateInput = (value: string, base: number): boolean => {
    if (!value) return true;
    const regexMap: Record<number, RegExp> = {
      2: /^[0-1]+$/,
      8: /^[0-7]+$/,
      10: /^[0-9]+$/,
      16: /^[0-9A-Fa-f]+$/,
    };
    return regexMap[base].test(value);
  };

  // Main Logic: แปลงค่าทั้งหมดเมื่อ Input เปลี่ยน
  const handleChange = (value: string, fromBase: number) => {
    // 1. ล้างค่าถ้าว่างเปล่า
    if (value.trim() === "") {
      setValues({ decimal: "", hex: "", binary: "", octal: "" });
      setError(null);
      return;
    }

    // 2. ตรวจสอบความถูกต้อง (Client-side validation)
    if (!validateInput(value, fromBase)) {
      // อัปเดตเฉพาะช่องที่พิมพ์เพื่อให้ User เห็นว่าพิมพ์อะไรผิด แต่ไม่แปลงค่าอื่น
      const key =
        fromBase === 10
          ? "decimal"
          : fromBase === 16
          ? "hex"
          : fromBase === 2
          ? "binary"
          : "octal";
      setValues((prev) => ({ ...prev, [key]: value }));
      setError(`Invalid character for Base ${fromBase}`);
      return;
    }

    setError(null);

    try {
      // 3. แปลงเป็น Decimal (ฐาน 10) ก่อน เพื่อใช้เป็นตัวกลาง
      const decimalValue = parseInt(value, fromBase);

      if (isNaN(decimalValue)) {
        throw new Error("Invalid number");
      }

      // 4. แปลงจาก Decimal ไปเป็นฐานอื่นๆ
      setValues({
        decimal: decimalValue.toString(10),
        hex: decimalValue.toString(16).toUpperCase(),
        binary: decimalValue.toString(2),
        octal: decimalValue.toString(8),
      });
    } catch (err) {
      console.error(err);
      // กรณี Error ให้คงค่าเดิมไว้ หรือจัดการตามความเหมาะสม
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleChange("", 10)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <BaseInput
              label="Decimal (Base 10)"
              value={values.decimal}
              placeholder="e.g., 255"
              onChange={(v) => handleChange(v, 10)}
            />
            <BaseInput
              label="Hexadecimal (Base 16)"
              value={values.hex}
              placeholder="e.g., FF"
              onChange={(v) => handleChange(v, 16)}
            />
            <BaseInput
              label="Binary (Base 2)"
              value={values.binary}
              placeholder="e.g., 11111111"
              onChange={(v) => handleChange(v, 2)}
            />
            <BaseInput
              label="Octal (Base 8)"
              value={values.octal}
              placeholder="e.g., 377"
              onChange={(v) => handleChange(v, 8)}
            />
          </div>

          {error && (
            <div className="text-sm text-destructive font-medium bg-destructive/10 p-3 rounded-md text-center animate-in fade-in slide-in-from-top-1">
              {error}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Sub-component เพื่อลด Code ซ้ำซ้อน
function BaseInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="font-mono text-lg"
        />
        <CopyButton text={value} />
      </div>
    </div>
  );
}
