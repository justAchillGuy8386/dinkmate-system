'use client';

import React from 'react';
import {
  CompassOutlined,
  QrcodeOutlined,
  LockOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';

export default function FairplaySection() {
  return (
    <section id="fairplay" className="py-32 px-6 bg-[#F5F5F7] border-t border-[#E5E5E7]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="text-xs font-semibold tracking-widest text-[#86868B] uppercase mb-2">
            Tiêu chuẩn công bằng
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1D1D1F] mb-3">
            4 Tầng Bảo Mật Chống Gian Lận
          </h2>
          <p className="text-sm text-[#86868B]">
            Cách DinkMate bảo vệ từng điểm ELO khỏi tạo trận ảo, khai sai kết quả hoặc cày điểm từ xa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pillar 1 */}
          <div className="bg-white border border-[#E5E5E7] rounded-[6px] p-8 flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold tracking-wider text-[#86868B] uppercase mb-3">
                TẦNG 1 · ĐỊA VỊ VẬT LÝ
              </div>
              <h3 className="text-xl font-bold text-[#1D1D1F] mb-3">
                Định Vị GPS Thực Địa Bán Kính 200m
              </h3>
              <p className="text-sm text-[#86868B] leading-relaxed mb-6">
                Ứng dụng di động kích hoạt cảm biến GPS thời gian thực. Cả hai đấu thủ bắt buộc phải có mặt
                trong phạm vi sân quy định thì phòng đấu mới cho phép khởi tạo. Ngăn chặn tuyệt đối việc
                ngồi nhà cày điểm ELO.
              </p>
            </div>
            <div className="text-xs font-medium text-[#1D1D1F] pt-4 border-t border-[#E5E5E7] flex items-center gap-2">
              <CompassOutlined /> Kiểm tra bán kính thực địa tự động
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white border border-[#E5E5E7] rounded-[6px] p-8 flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold tracking-wider text-[#86868B] uppercase mb-3">
                TẦNG 2 · XÁC THỰC CỘT SÂN
              </div>
              <h3 className="text-xl font-bold text-[#1D1D1F] mb-3">
                Check-in Mã QR Động Tại Sân
              </h3>
              <p className="text-sm text-[#86868B] leading-relaxed mb-6">
                Mỗi sân pickleball đối tác được định danh bằng một mã QR vật lý dán trực tiếp tại cột sân.
                Đấu thủ phải dùng camera trên ứng dụng quét mã QR này trước khi bước vào khởi động trận đấu.
              </p>
            </div>
            <div className="text-xs font-medium text-[#1D1D1F] pt-4 border-t border-[#E5E5E7] flex items-center gap-2">
              <QrcodeOutlined /> Quét QR trực tiếp qua Camera điện thoại
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white border border-[#E5E5E7] rounded-[6px] p-8 flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold tracking-wider text-[#86868B] uppercase mb-3">
                TẦNG 3 · ĐỐI SOÁT ĐỘC LẬP
              </div>
              <h3 className="text-xl font-bold text-[#1D1D1F] mb-3">
                Nhập Điểm Hai Chiều (Double-Blind)
              </h3>
              <p className="text-sm text-[#86868B] leading-relaxed mb-6">
                Mỗi bên tự nhập kết quả set đấu trên máy của mình mà không thấy bên kia khai gì. Hệ thống
                chỉ chốt kết quả và tính ELO khi cả hai bản khai trùng khớp hoàn toàn. Nếu có sai lệch,
                trận đấu chuyển sang Tranh chấp.
              </p>
            </div>
            <div className="text-xs font-medium text-[#1D1D1F] pt-4 border-t border-[#E5E5E7] flex items-center gap-2">
              <LockOutlined /> Bảo mật tỉ số hai chiều độc lập
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white border border-[#E5E5E7] rounded-[6px] p-8 flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold tracking-wider text-[#86868B] uppercase mb-3">
                TẦNG 4 · TOÀN VẸN HỆ THỐNG
              </div>
              <h3 className="text-xl font-bold text-[#1D1D1F] mb-3">
                Điểm Uy Tín Trust Score & Trọng Tài AI
              </h3>
              <p className="text-sm text-[#86868B] leading-relaxed mb-6">
                Mỗi người chơi bắt đầu với 100 điểm uy tín. Những hành vi như khai khống tỉ số, hủy trận
                phút chót hay gian lận địa điểm sẽ bị trừ điểm uy tín ngay lập tức và đình chỉ quyền thi đấu
                xếp hạng ELO.
              </p>
            </div>
            <div className="text-xs font-medium text-[#1D1D1F] pt-4 border-t border-[#E5E5E7] flex items-center gap-2">
              <SafetyCertificateOutlined /> Giám sát toàn vẹn thời gian thực
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
