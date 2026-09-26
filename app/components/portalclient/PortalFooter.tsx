'use client';

import React from 'react';

export default function PortalFooter() {
  return (
    <footer className="py-16 px-6 bg-white border-t border-[#E5E5E7] text-xs text-[#86868B]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="font-semibold text-[#1D1D1F] mb-1">DinkMate Pickleball System</div>
          <div>Bản quyền © 2026 DinkMate Inc. Bảo lưu mọi quyền.</div>
        </div>

        <div className="text-center md:text-right max-w-md">
          Điểm số ELO được tính toán theo tiêu chuẩn thích ứng USAPA / DUPR. Tất cả các trận đấu được xác thực thực địa bằng GPS và mã QR tại sân.
        </div>
      </div>
    </footer>
  );
}
