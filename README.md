# DevXTools (CodeXKit) 🛠️

> **The All-in-One Developer Utility Suite** built with Next.js 16 and Tailwind CSS v4.

## 📖 About The Project

**DevXTools** คือ Web Application ที่รวบรวมเครื่องมือสารพัดประโยชน์สำหรับ Developers ไว้ในที่เดียว โดยเน้นความเร็ว (Performance), การใช้งานง่าย (UX), และความเป็นส่วนตัว (Privacy-focused: ประมวลผลบน Client-side เป็นหลัก)

โปรเจกต์นี้ถูกออกแบบด้วยสถาปัตยกรรมที่ยืดหยุ่น (Scalable Architecture) ทำให้สามารถเพิ่มหรือลดเครื่องมือใหม่ๆ ได้ง่ายผ่านระบบ Configuration และ Registry Pattern

### ✨ Key Features

* **⚡ Modern Tech Stack:** พัฒนาด้วย Next.js 16 (App Router) และ React 19
* **🎨 Beautiful UI:** ดีไซน์ทันสมัยด้วย Tailwind CSS v4 และ Radix UI
* **🔌 Pluggable Architecture:** เพิ่ม/ลด Tool ได้ง่ายๆ ผ่านไฟล์ Config (`src/config`)
* **🛠️ Utility Categories:**
    * **Text Studio:** จัดการข้อความ, ล้าง Format, และ String manipulation
    * **Converter Hub:** แปลงหน่วยข้อมูล, Encoding (Base64), และ Data format
    * *(Coming Soon)* **Dev & JSON:** Debugging tools และ Code formatters
    * *(Coming Soon)* **CSS & UI Lab:** เครื่องมือสร้าง CSS Generator และ UI Styles
    * *(Coming Soon)* **Security Vault:** สร้าง Hash, Token และ Password ที่ปลอดภัย

## 🏗️ Tech Stack

โปรเจกต์นี้ใช้เทคโนโลยีล่าสุดเพื่อให้มั่นใจในประสิทธิภาพและการรองรับอนาคต:

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/)
* **State Management:** [Zustand](https://github.com/pmndrs/zustand)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Core Libraries:**
    * `crypto-js` สำหรับ Security tools
    * `date-fns` สำหรับจัดการเวลา
    * `js-yaml`, `xml-js` สำหรับ Data conversion
    * `sonner` สำหรับ Toast notifications

## 🚀 Getting Started

ทำตามขั้นตอนด้านล่างเพื่อรันโปรเจกต์บนเครื่องของคุณ:

### Prerequisites
* Node.js (Version 20 หรือสูงกว่า)
* npm หรือ pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/demo-devxtools.git](https://github.com/your-username/demo-devxtools.git)
    cd demo-devxtools
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # หรือ
    pnpm install
    ```

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```

4.  เปิด Browser ไปที่ [http://localhost:3030](http://localhost:3030) (Port ตั้งค่าไว้ที่ 3030 ใน package.json)

## ⚙️ Configuration & Customization

โปรเจกต์นี้ใช้ระบบ **Centralized Configuration** ในการจัดการ Tools ต่างๆ

คุณสามารถ เปิด/ปิด หรือแก้ไขหมวดหมู่เครื่องมือได้ที่ไฟล์:
`src/config/tools.ts`

```typescript
// ตัวอย่างการเปิดใช้งานหมวดหมู่
{
  id: "css",
  label: "CSS & UI Lab",
  hidden: false, // เปลี่ยนเป็น true เพื่อซ่อน
  // ...
}