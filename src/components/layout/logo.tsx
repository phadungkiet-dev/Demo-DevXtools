import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface LogoProps extends HTMLAttributes<HTMLDivElement> {
  /** ขนาดของโลโก้ (pixel) - Default: 32 */
  size?: number;
}

export function Logo({ className, size = 32, ...props }: LogoProps) {
  // ---------------------------------------------------------------------------
  // Ratio Calculation Logic
  // ---------------------------------------------------------------------------
  const fontSize = Math.round(size * (11 / 32));
  const borderRadius = size * (6 / 32);

  return (
    <div
      role="img"
      aria-label="CodeXKit Logo"
      className={cn(
        // Layout
        "flex items-center justify-center shrink-0 select-none overflow-hidden",
        // Visual Style (Gradient Background: Blue -> Purple)
        "bg-gradient-to-br from-[#2563eb] to-[#7c3aed]",
        // Typography
        "text-white font-sans font-black leading-none",
        // Interaction / Animation
        "shadow-sm transition-all duration-300",
        "group-hover:shadow-md group-hover:scale-105 group-hover:brightness-110",
        className
      )}
      style={{
        width: size,
        height: size,
        borderRadius: borderRadius,
        fontSize: `${fontSize}px`,
        // Fine-tuning: บีบระยะห่างตัวอักษรเล็กน้อยเพื่อให้ดูกระชับขึ้นในกล่องสี่เหลี่ยม
        letterSpacing: "-0.5px",
      }}
      {...props}
    >
      {/* Optical Alignment: 
        ดันตัวอักษรลงมา 0.5px (หรือตามสัดส่วน) เพื่อให้ดูอยู่กึ่งกลางทางสายตา 
        เนื่องจาก Font ส่วนใหญ่มักจะลอยขึ้นด้านบนเล็กน้อยเมื่อเทียบกับ Line Height
      */}
      <span className="translate-y-[0.5px]">CXK</span>
    </div>
  );
}
