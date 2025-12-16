import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Route segment config
export const runtime = "edge";

// =============================================================================
// Icon Generator
// =============================================================================
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        {/* 🎨 Style: "CXD" Gradient Box */}
        <div
          style={{
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // Gradient: สีน้ำเงินเข้ม -> ม่วง (ดู Tech และ Professional)
            background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
            borderRadius: "6px", // ลดความมนลงเล็กน้อยเพื่อให้เหลือพื้นที่มุมสำหรับตัวอักษร
            color: "white",
            // Typography ปรับจูนสำหรับ 3 ตัวอักษร
            fontSize: "11px", // ขนาด 11px กำลังดีสำหรับ 3 ตัวในกล่อง 32px
            fontWeight: 900, // หนาสุดเพื่อให้เห็นชัด
            fontFamily: "sans-serif",
            letterSpacing: "-0.5px", // บีบระยะห่างนิดนึงให้กระชับ
            paddingTop: "1px", // จัดกึ่งกลางทางสายตา
          }}
        >
          CXD
        </div>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
