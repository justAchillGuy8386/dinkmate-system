import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-be-vietnam-pro",
});

export const metadata: Metadata = {
  title: "DinkMate - Bảng Xếp Hạng & Đấu Kèo Pickleball Thông Minh",
  description: "Cổng thông tin & Bảng xếp hạng ELO người chơi Pickleball toàn quốc. Ghép trận đối thủ theo ELO tương đương và GPS thực tế tại cụm sân.",
  keywords: ["Pickleball", "DinkMate", "Bảng xếp hạng Pickleball", "Ghép kèo Pickleball", "ELO Pickleball Việt Nam"],
  openGraph: {
    title: "DinkMate - Bảng Xếp Hạng & Đấu Kèo Pickleball Thông Minh",
    description: "Hệ thống xếp hạng ELO và ghép trận bằng AI cho cộng đồng người chơi Pickleball Việt Nam.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} ${beVietnamPro.className} h-full dark`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${beVietnamPro.className} min-h-full flex flex-col bg-[#07090E] text-slate-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
