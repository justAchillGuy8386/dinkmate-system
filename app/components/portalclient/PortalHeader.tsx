'use client';

import React from 'react';
import { Button, Avatar } from 'antd';
import { UserItem } from './types';

interface PortalHeaderProps {
  currentUser: UserItem | null;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  onOpenQrModal: () => void;
}

export default function PortalHeader({
  currentUser,
  onOpenLoginModal,
  onLogout,
  onOpenQrModal,
}: PortalHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E5E5E7] h-12 flex items-center w-full">
      <div className="w-full px-4 sm:px-6 md:px-8 flex items-center justify-between gap-4 md:gap-8 whitespace-nowrap">
        {/* Left: Brand */}
        <div className="flex items-center gap-2.5 flex-shrink-0 whitespace-nowrap">
          <a href="#" className="text-base font-bold tracking-tight text-[#1D1D1F] hover:opacity-80 transition-opacity">
            DinkMate
          </a>
          <span className="text-[11px] font-medium text-[#86868B] px-1.5 py-0.5 bg-[#F5F5F7] rounded-[6px] border border-[#E5E5E7]">
            Portal
          </span>
        </div>

        {/* Center: Nav Links strictly on 1 line */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8 text-sm whitespace-nowrap flex-shrink-0">
          <a href="#podium" className="text-[#86868B] hover:text-[#1D1D1F] transition-colors whitespace-nowrap">
            Vinh danh
          </a>
          <a href="#leaderboard" className="text-[#86868B] hover:text-[#1D1D1F] transition-colors whitespace-nowrap">
            Bảng ELO
          </a>
          <a href="#fairplay" className="text-[#86868B] hover:text-[#1D1D1F] transition-colors whitespace-nowrap">
            Bảo mật thực địa
          </a>
          <a href="#courts" className="text-[#86868B] hover:text-[#1D1D1F] transition-colors whitespace-nowrap">
            Mạng lưới sân
          </a>
          <a href="#download" className="text-[#86868B] hover:text-[#1D1D1F] transition-colors whitespace-nowrap">
            Ứng dụng Mobile
          </a>
        </nav>

        {/* Right: User + Auth + App Action - PUSHED COMPLETELY TO THE FAR RIGHT */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0 whitespace-nowrap ml-auto">
          {currentUser ? (
            <div className="flex items-center gap-2 sm:gap-3 whitespace-nowrap">
              <div className="flex items-center gap-2 px-2.5 py-1 bg-[#F5F5F7] border border-[#E5E5E7] rounded-[6px] whitespace-nowrap">
                <Avatar
                  size={20}
                  src={currentUser.avatar_url || undefined}
                  style={{
                    backgroundColor: '#1D1D1F',
                    color: '#FFFFFF',
                    fontSize: 10,
                    fontWeight: 600,
                    borderRadius: 4,
                  }}
                >
                  {currentUser.full_name.slice(0, 2).toUpperCase()}
                </Avatar>
                <span className="text-xs font-semibold text-[#1D1D1F] whitespace-nowrap">
                  {currentUser.full_name}
                </span>
                <span className="text-[11px] font-mono text-[#0071E3] font-bold whitespace-nowrap">
                  {currentUser.elo_rating} ELO
                </span>
              </div>
              <Button
                type="text"
                onClick={onLogout}
                style={{
                  height: 32,
                  padding: '0 8px',
                  borderRadius: 6,
                  color: '#86868B',
                  fontSize: 12,
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                }}
              >
                Đăng Xuất
              </Button>
            </div>
          ) : (
            <Button
              onClick={onOpenLoginModal}
              style={{
                height: 32,
                padding: '0 14px',
                borderRadius: 6,
                backgroundColor: '#FFFFFF',
                borderColor: '#E5E5E7',
                color: '#1D1D1F',
                fontSize: 13,
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}
            >
              Đăng Nhập
            </Button>
          )}

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
              whiteSpace: 'nowrap',
            }}
          >
            Mở Ứng Dụng
          </Button>
        </div>
      </div>
    </header>
  );
}
