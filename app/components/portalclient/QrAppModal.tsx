'use client';

import React from 'react';
import { Modal, Button } from 'antd';

interface QrAppModalProps {
  open: boolean;
  onClose: () => void;
}

export default function QrAppModal({ open, onClose }: QrAppModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={440}
      centered
      styles={{
        body: {
          padding: 24,
          textAlign: 'center',
        },
      }}
    >
      <div className="text-xs font-semibold tracking-widest text-[#86868B] uppercase mb-2">
        Tải Ứng Dụng DinkMate
      </div>
      <h3 className="text-xl font-bold text-[#1D1D1F] mb-2">
        Trải Nghiệm Thể Thao Tại Sân
      </h3>
      <p className="text-xs text-[#86868B] leading-relaxed mb-6">
        Quét mã QR bằng Camera điện thoại hoặc truy cập ứng dụng di động để kích hoạt GPS và tạo kèo đấu.
      </p>

      <div className="w-48 h-48 mx-auto bg-white border border-[#E5E5E7] rounded-[6px] p-3 flex flex-col items-center justify-center mb-6">
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

      <div className="text-xs text-[#86868B] mb-4">
        Hỗ trợ nền tảng iOS & Android · Yêu cầu quyền truy cập GPS & Camera
      </div>

      <Button
        onClick={onClose}
        style={{
          width: '100%',
          height: 40,
          borderRadius: 6,
          borderColor: '#E5E5E7',
          color: '#1D1D1F',
          fontWeight: 500,
        }}
      >
        Đóng
      </Button>
    </Modal>
  );
}
