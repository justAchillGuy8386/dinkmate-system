import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-be-vietnam-pro",
});

export const metadata: Metadata = {
  title: "DinkMate — Nền Tảng Xếp Hạng & Ghép Kèo Pickleball",
  description: "Chuẩn ELO USAPA/DUPR. Trí tuệ nhân tạo ghép cặp thực địa. Check-in mã QR tại sân.",
  keywords: ["Pickleball", "DinkMate", "Bảng xếp hạng Pickleball", "Ghép kèo Pickleball", "ELO Pickleball Việt Nam"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} ${beVietnamPro.className} h-full`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${beVietnamPro.className} min-h-full flex flex-col bg-white text-[#1D1D1F] antialiased`}>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
