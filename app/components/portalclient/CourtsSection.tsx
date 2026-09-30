'use client';

import React from 'react';
import { EnvironmentOutlined } from '@ant-design/icons';
import { CourtItem } from './types';

interface CourtsSectionProps {
  courts: CourtItem[];
}

export default function CourtsSection({ courts }: CourtsSectionProps) {
  return (
    <section id="courts" className="py-24 px-6 bg-white border-t border-[#E5E5E7]">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#ECFDF5] border border-[#A7F3D0] rounded-[6px] text-xs font-semibold tracking-wider text-[#059669] uppercase mb-2">
            Mạng lưới đối tác
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1D1D1F] mb-3">
            Cụm Sân Thi Đấu Chuẩn Hóa
          </h2>
          <p className="text-sm text-[#86868B]">
            Danh sách các sân pickleball đã được đo đạc tọa độ GPS và gắn mã QR định danh phục vụ tính điểm ELO.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courts.map((court) => (
            <div
              key={court.id}
              className="bg-[#F5F5F7] border border-[#E5E5E7] rounded-[6px] p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#86868B]">
                    Sân thi đấu ELO
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#059669]">
                    <span className="w-2 h-2 rounded-full bg-[#059669]"></span> Sẵn sàng
                  </span>
                </div>
                <h4 className="text-base font-bold text-[#1D1D1F] mb-2">{court.name}</h4>
                <p className="text-xs text-[#86868B] leading-relaxed mb-4 flex items-start gap-1.5">
                  <EnvironmentOutlined style={{ marginTop: 2, color: '#059669' }} />
                  <span>{court.address}</span>
                </p>
              </div>

              <div className="pt-4 border-t border-[#E5E5E7] flex items-center justify-between text-xs text-[#86868B]">
                <span>Tọa độ GPS:</span>
                <span className="font-mono text-[#1D1D1F]">
                  {court.latitude.toFixed(4)}, {court.longitude.toFixed(4)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
