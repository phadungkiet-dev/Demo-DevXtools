// --- 1. CONFIGURATION & TYPES ---

export type BaseConfig = {
  id: string;
  label: string;
  base: number;
  placeholder: string;
  regex: RegExp;
  description: string;
};

// ✅ ปรับแก้: เหลือแค่ 4 ฐานตามที่ต้องการ
export const BASES: BaseConfig[] = [
  {
    id: "binary",
    label: "Binary (2)",
    base: 2,
    placeholder: "e.g., 11111111",
    regex: /^[0-1]+$/,
    description: "Machine language (0s and 1s)",
  },
  {
    id: "octal",
    label: "Octal (8)",
    base: 8,
    placeholder: "e.g., 377",
    regex: /^[0-7]+$/,
    description: "Used in Unix file permissions",
  },
  {
    id: "decimal",
    label: "Decimal (10)",
    base: 10,
    placeholder: "e.g., 255",
    regex: /^[0-9]+$/,
    description: "Standard human counting system",
  },
  {
    id: "hex",
    label: "Hexadecimal (16)",
    base: 16,
    placeholder: "e.g., FF",
    regex: /^[0-9A-Fa-f]+$/,
    description: "Web colors and memory addresses",
  },
];

// --- 2. UTILITY FUNCTIONS (Simplified) ---

// แปลงจาก String ฐานใดๆ -> BigInt
export const toBigInt = (value: string, base: number): bigint => {
  // รองรับฐาน 2-36 ได้ด้วย Logic มาตรฐานนี้
  return [...value].reduce((acc, char) => {
    const val = parseInt(char, base);
    if (isNaN(val)) throw new Error("Invalid char");
    return acc * BigInt(base) + BigInt(val);
  }, BigInt(0));
};

// แปลงจาก BigInt -> String ฐานใดๆ
export const fromBigInt = (value: bigint, base: number): string => {
  if (value === BigInt(0)) return "0";
  // รองรับฐาน 2-36 ได้ด้วย Native toString()
  return value.toString(base).toUpperCase();
};
