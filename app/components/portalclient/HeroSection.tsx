'use client';

import React from 'react';
import { Button } from 'antd';

export default function HeroSection() {
  return (
    <section className="pt-32 pb-24 px-6 text-center max-w-4xl mx-auto">
      <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 bg-[#ECFDF5] border border-[#A7F3D0] rounded-[6px] text-xs font-semibold tracking-wider text-[#059669] uppercase">
        <span className="w-2 h-2 rounded-full bg-[#84CC16]"></span>
        Hệ thống xếp hạng & Ghép kèo Pickleball
      </div>
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-[#1D1D1F] leading-[1.1] mb-6">
        DinkMate.
        <br />
        Công bằng tuyệt đối.
        <br />
        Tranh tài thực tế.
      </h1>
      <p className="text-lg md:text-xl text-[#86868B] font-normal leading-relaxed max-w-2xl mx-auto mb-10">
        DinkMate chuẩn hóa điểm ELO cho Pickleball Việt Nam. Kết hợp đối soát độc lập hai chiều,
        định vị GPS khuôn viên sân và mã QR vật lý gắn tại cột lưới. Không có chỗ cho số liệu ảo.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button
          type="primary"
          href="#leaderboard"
          style={{
            height: 48,
            padding: '0 32px',
            borderRadius: 6,
            backgroundColor: '#059669',
            borderColor: '#059669',
            color: '#FFFFFF',
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          Xem Bảng Xếp Hạng ELO
        </Button>
        <Button
          href="#fairplay"
          style={{
            height: 48,
            padding: '0 32px',
            borderRadius: 6,
            backgroundColor: '#FFFFFF',
            borderColor: '#E5E5E7',
            color: '#1D1D1F',
            fontSize: 15,
            fontWeight: 500,
          }}
        >
          Tìm Hiểu Chuẩn Bảo Mật
        </Button>
      </div>
      <div className="mt-8 text-xs text-[#86868B]">
        * Mọi thao tác tìm đối thủ, quét QR tại sân và ghi nhận tỉ số được thực hiện trực tiếp trên ứng dụng di động.
      </div>
    </section>
  );
}
