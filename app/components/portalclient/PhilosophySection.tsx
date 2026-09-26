'use client';

import React from 'react';

export default function PhilosophySection() {
  return (
    <section className="py-28 px-6 bg-white">
      <div className="max-w-3xl mx-auto text-center">
        <div className="text-xs font-semibold tracking-widest text-[#86868B] uppercase mb-4">
          Triết lý vận hành
        </div>
        <blockquote className="text-2xl md:text-3xl font-semibold text-[#1D1D1F] leading-snug mb-8">
          “Kỹ năng chỉ được chứng minh trên mặt sân thật. DinkMate loại bỏ hoàn toàn số liệu ảo bằng sự hiện diện vật lý.”
        </blockquote>
        <p className="text-base text-[#86868B] leading-relaxed">
          Cổng thông tin Web được sinh ra với vai trò minh bạch hóa toàn bộ bảng xếp hạng, điểm số ELO
          và thành tích thi đấu cho cộng đồng. Toàn bộ các thao tác tạo kèo, tìm đối thủ, quét QR check-in
          và đối soát điểm số hai chiều bắt buộc diễn ra trên ứng dụng di động DinkMate khi hai đấu thủ
          đang có mặt trực tiếp tại sân.
        </p>
      </div>
    </section>
  );
}
