'use client';

import React from 'react';
import { Button } from 'antd';
import { QrcodeOutlined, CheckOutlined } from '@ant-design/icons';

interface MobileAppSectionProps {
  onOpenQrModal: () => void;
}

export default function MobileAppSection({ onOpenQrModal }: MobileAppSectionProps) {
  return (
    <section id="download" className="py-32 px-6 bg-[#F5F5F7] border-t border-[#E5E5E7]">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white border border-[#E5E5E7] rounded-[6px] p-8 md:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#ECFDF5] border border-[#A7F3D0] rounded-[6px] text-xs font-semibold tracking-wider text-[#059669] uppercase mb-4">
                <span className="w-2 h-2 rounded-full bg-[#84CC16]"></span>
                Ứng dụng di động DinkMate
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1D1D1F] tracking-tight mb-4">
                Trải nghiệm ghép kèo & thi đấu trực tiếp tại sân.
              </h2>
              <p className="text-sm text-[#86868B] leading-relaxed mb-8">
                Toàn bộ nghiệp vụ thể thao cốt lõi được bảo mật và tự động hóa trên điện thoại:
                từ tìm đối thủ có ELO tương đương, dẫn đường tới sân, quét mã QR check-in
                cho đến nhập tỉ số đối soát hai chiều.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-[#1D1D1F]">
                  <CheckOutlined style={{ color: '#059669' }} />
                  <span>Quét mã QR cột sân qua Camera trực tiếp</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#1D1D1F]">
                  <CheckOutlined style={{ color: '#059669' }} />
                  <span>Xác thực vị trí GPS thực địa thời gian thực</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#1D1D1F]">
                  <CheckOutlined style={{ color: '#059669' }} />
                  <span>Nhập tỉ số hai chiều bảo mật & nhận kết quả ELO tức thì</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#1D1D1F]">
                  <CheckOutlined style={{ color: '#059669' }} />
                  <span>Hệ thống AI gợi ý đối thủ ghép cặp chuẩn trình độ</span>
                </div>
              </div>

              <Button
                type="primary"
                onClick={onOpenQrModal}
                style={{
                  height: 44,
                  padding: '0 24px',
                  borderRadius: 6,
                  backgroundColor: '#059669',
                  borderColor: '#059669',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                <QrcodeOutlined /> Quét Mã QR Cài Đặt
              </Button>
            </div>

            <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 bg-[#F5F5F7] border border-[#E5E5E7] rounded-[6px]">
              <div className="w-44 h-44 bg-white border border-[#E5E5E7] rounded-[6px] p-3 flex flex-col items-center justify-center mb-4">
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#1D1D1F]" fill="currentColor">
                  <path d="M0,0 h30 v30 h-30 z M6,6 h18 v18 h-18 z M10,10 h10 v10 h-10 z" />
                  <path d="M70,0 h30 v30 h-30 z M76,6 h18 v18 h-18 z M80,10 h10 v10 h-10 z" />
                  <path d="M0,70 h30 v30 h-30 z M6,76 h18 v18 h-18 z M10,80 h10 v10 h-10 z" />
                  <rect x="36" y="8" width="8" height="8" />
                  <rect x="52" y="8" width="8" height="8" />
                  <rect x="36" y="20" width="12" height="6" />
                  <rect x="8" y="36" width="8" height="8" />
                  <rect x="22" y="36" width="12" height="6" />
                  <rect x="40" y="36" width="20" height="8" />
                  <rect x="68" y="36" width="8" height="16" />
                  <rect x="84" y="36" width="10" height="8" />
                  <rect x="8" y="50" width="16" height="8" />
                  <rect x="30" y="48" width="8" height="18" />
                  <rect x="44" y="50" width="16" height="8" />
                  <rect x="76" y="50" width="16" height="8" />
                  <rect x="36" y="72" width="8" height="20" />
                  <rect x="50" y="68" width="18" height="8" />
                  <rect x="76" y="68" width="16" height="8" />
                  <rect x="50" y="82" width="10" height="12" />
                  <rect x="68" y="82" width="14" height="12" />
                </svg>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1D1D1F] uppercase tracking-wider mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]"></span>
                DinkMate for iOS & Android
              </div>
              <div className="text-xs text-[#86868B] text-center">
                Quét camera trên điện thoại để tải bản thử nghiệm
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
