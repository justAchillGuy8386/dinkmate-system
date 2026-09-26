'use client';

import React from 'react';
import { Button, Avatar } from 'antd';
import { UserItem, calculateWinrate } from './types';

interface PodiumSectionProps {
  topThree: UserItem[];
  onSelectUser: (user: UserItem) => void;
}

export default function PodiumSection({ topThree, onSelectUser }: PodiumSectionProps) {
  return (
    <section id="podium" className="py-24 px-6 bg-[#F5F5F7] border-t border-[#E5E5E7]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-semibold tracking-widest text-[#86868B] uppercase mb-2">
            Bảng Vinh Danh
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1D1D1F] mb-3">
            Top 3 Vận Động Viên Dẫn Đầu
          </h2>
          <p className="text-sm text-[#86868B]">
            Những tay vợt xuất sắc nhất với điểm số ELO cao nhất và phong độ ổn định.
          </p>
        </div>

        {topThree.length >= 3 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {/* Rank 2 */}
            <div className="bg-white border border-[#E5E5E7] rounded-[6px] p-8 text-center flex flex-col items-center">
              <span className="w-8 h-8 rounded-[6px] bg-[#86868B] text-white font-bold text-sm flex items-center justify-center mb-6">
                2
              </span>
              <Avatar
                size={64}
                src={topThree[1].avatar_url || undefined}
                style={{
                  backgroundColor: '#F5F5F7',
                  color: '#1D1D1F',
                  fontSize: 20,
                  fontWeight: 700,
                  borderRadius: 6,
                  border: '1px solid #E5E5E7',
                  marginBottom: 16,
                }}
              >
                {topThree[1].full_name.slice(0, 2).toUpperCase()}
              </Avatar>
              <div className="text-lg font-bold text-[#1D1D1F] mb-1">{topThree[1].full_name}</div>
              <div className="text-xs text-[#86868B] mb-4">Thành viên chính thức</div>
              <div className="text-4xl font-extrabold text-[#1D1D1F] mb-1">
                {topThree[1].elo_rating}
              </div>
              <div className="text-xs text-[#86868B] mb-6">Điểm ELO</div>
              <div className="text-xs font-medium text-[#1D1D1F] pb-6 mb-6 border-b border-[#E5E5E7] w-full">
                {topThree[1].wins} Thắng · {topThree[1].losses} Thua ({calculateWinrate(topThree[1].wins, topThree[1].total_matches)}%)
              </div>
              <Button
                onClick={() => onSelectUser(topThree[1])}
                style={{
                  width: '100%',
                  height: 40,
                  borderRadius: 6,
                  borderColor: '#E5E5E7',
                  color: '#1D1D1F',
                  fontWeight: 500,
                }}
              >
                Xem hồ sơ
              </Button>
            </div>

            {/* Rank 1 */}
            <div className="bg-white border-2 border-[#1D1D1F] rounded-[6px] p-8 text-center flex flex-col items-center relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1D1D1F] text-white text-[11px] font-semibold px-3 py-0.5 rounded-[6px] uppercase tracking-wider">
                TOP 1
              </div>
              <span className="w-9 h-9 rounded-[6px] bg-[#1D1D1F] text-white font-bold text-base flex items-center justify-center mb-6 mt-2">
                1
              </span>
              <Avatar
                size={72}
                src={topThree[0].avatar_url || undefined}
                style={{
                  backgroundColor: '#1D1D1F',
                  color: '#FFFFFF',
                  fontSize: 24,
                  fontWeight: 700,
                  borderRadius: 6,
                  marginBottom: 16,
                }}
              >
                {topThree[0].full_name.slice(0, 2).toUpperCase()}
              </Avatar>
              <div className="text-xl font-bold text-[#1D1D1F] mb-1">{topThree[0].full_name}</div>
              <div className="text-xs text-[#0071E3] font-medium mb-4">ELO cao nhất </div>
              <div className="text-5xl font-extrabold text-[#1D1D1F] mb-1">
                {topThree[0].elo_rating}
              </div>
              <div className="text-xs text-[#86868B] mb-6">Điểm ELO</div>
              <div className="text-xs font-medium text-[#1D1D1F] pb-6 mb-6 border-b border-[#E5E5E7] w-full">
                {topThree[0].wins} Thắng · {topThree[0].losses} Thua ({calculateWinrate(topThree[0].wins, topThree[0].total_matches)}%)
              </div>
              <Button
                type="primary"
                onClick={() => onSelectUser(topThree[0])}
                style={{
                  width: '100%',
                  height: 40,
                  borderRadius: 6,
                  backgroundColor: '#1D1D1F',
                  borderColor: '#1D1D1F',
                  color: '#FFFFFF',
                  fontWeight: 500,
                }}
              >
                Xem hồ sơ người chơi Top 1
              </Button>
            </div>

            {/* Rank 3 */}
            <div className="bg-white border border-[#E5E5E7] rounded-[6px] p-8 text-center flex flex-col items-center">
              <span className="w-8 h-8 rounded-[6px] bg-[#E5E5E7] text-[#1D1D1F] font-bold text-sm flex items-center justify-center mb-6">
                3
              </span>
              <Avatar
                size={64}
                src={topThree[2].avatar_url || undefined}
                style={{
                  backgroundColor: '#F5F5F7',
                  color: '#1D1D1F',
                  fontSize: 20,
                  fontWeight: 700,
                  borderRadius: 6,
                  border: '1px solid #E5E5E7',
                  marginBottom: 16,
                }}
              >
                {topThree[2].full_name.slice(0, 2).toUpperCase()}
              </Avatar>
              <div className="text-lg font-bold text-[#1D1D1F] mb-1">{topThree[2].full_name}</div>
              <div className="text-xs text-[#86868B] mb-4">Thành viên chính thức</div>
              <div className="text-4xl font-extrabold text-[#1D1D1F] mb-1">
                {topThree[2].elo_rating}
              </div>
              <div className="text-xs text-[#86868B] mb-6">Điểm ELO</div>
              <div className="text-xs font-medium text-[#1D1D1F] pb-6 mb-6 border-b border-[#E5E5E7] w-full">
                {topThree[2].wins} Thắng · {topThree[2].losses} Thua ({calculateWinrate(topThree[2].wins, topThree[2].total_matches)}%)
              </div>
              <Button
                onClick={() => onSelectUser(topThree[2])}
                style={{
                  width: '100%',
                  height: 40,
                  borderRadius: 6,
                  borderColor: '#E5E5E7',
                  color: '#1D1D1F',
                  fontWeight: 500,
                }}
              >
                Xem hồ sơ
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-[#E5E5E7] rounded-[6px] p-12 text-center text-[#86868B]">
            Đang cập nhật danh sách vinh danh sau các trận đấu mới.
          </div>
        )}
      </div>
    </section>
  );
}
