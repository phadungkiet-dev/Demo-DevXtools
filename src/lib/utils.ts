import { clsx, type ClassValue } from "clsx" // นำเข้า clsx สำหรับจัดการ Logic ของ Class
import { twMerge } from "tailwind-merge" // นำเข้า tailwind-merge สำหรับแก้ Class ชนกัน

// สร้างฟังก์ชันรับ input ได้ไม่จำกัด (...inputs)
export function cn(...inputs: ClassValue[]) {
  // ทำงาน 2 ต่อ: clsx จัดการ array/condition -> twMerge จัดการ tailwind conflict
  return twMerge(clsx(inputs))
}
