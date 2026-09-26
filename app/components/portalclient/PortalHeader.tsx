'use client';

import React from 'react';
import { Button } from 'antd';

interface PortalHeaderProps {
  onOpenQrModal: () => void;
}

export default function PortalHeader({ onOpenQrModal }: PortalHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E5E5E7] h-12 flex items-center">
      <div className="max-w-6xl mx-auto w-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="#" className="text-base font-bold tracking-tight text-[#1D1D1F] hover:opacity-80 transition-opacity">
            DinkMate
          </a>
          <span className="text-xs text-[#86868B] px-2 py-0.5 bg-[#F5F5F7] rounded-[6px] border border-[#E5E5E7]">
            Portal
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="#podium" className="text-[#86868B] hover:text-[#1D1D1F] transition-colors">
            Vinh danh
          </a>
          <a href="#leaderboard" className="text-[#86868B] hover:text-[#1D1D1F] transition-colors">
            Bảng ELO
          </a>
          <a href="#fairplay" className="text-[#86868B] hover:text-[#1D1D1F] transition-colors">
            Bảo mật thực địa
          </a>
          <a href="#courts" className="text-[#86868B] hover:text-[#1D1D1F] transition-colors">
            Mạng lưới sân
          </a>
          <a href="#download" className="text-[#86868B] hover:text-[#1D1D1F] transition-colors">
            Ứng dụng Mobile
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button
            type="primary"
            onClick={onOpenQrModal}
            style={{
              height: 32,
              padding: '0 16px',
              borderRadius: 6,
              backgroundColor: '#1D1D1F',
              borderColor: '#1D1D1F',
              color: '#FFFFFF',
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            Mở Ứng Dụng
          </Button>
        </div>
      </div>
    </header>
  );
}
