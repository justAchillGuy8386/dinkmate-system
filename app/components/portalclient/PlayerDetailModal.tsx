'use client';

import React from 'react';
import { Modal, Avatar, Tag, Button } from 'antd';
import { UserItem, MatchHistoryItem, maskPhone, calculateWinrate } from './types';

interface PlayerDetailModalProps {
  user: UserItem | null;
  userMatches: MatchHistoryItem[];
  onClose: () => void;
  onOpenQrModal: () => void;
}

export default function PlayerDetailModal({
  user,
  userMatches,
  onClose,
  onOpenQrModal,
}: PlayerDetailModalProps) {
  return (
    <Modal
      open={!!user}
      onCancel={onClose}
      footer={null}
      width={640}
      centered
      styles={{
        body: {
          padding: 24,
        },
      }}
    >
      {user && (
        <div>
          <div className="flex items-start justify-between pb-6 mb-6 border-b border-[#E5E5E7]">
            <div className="flex items-center gap-4">
              <Avatar
                size={56}
                src={user.avatar_url || undefined}
                style={{
                  backgroundColor: '#1D1D1F',
                  color: '#FFFFFF',
                  fontSize: 18,
                  fontWeight: 700,
                  borderRadius: 6,
                }}
              >
                {user.full_name.slice(0, 2).toUpperCase()}
              </Avatar>
              <div>
                <h3 className="text-xl font-bold text-[#1D1D1F] mb-1">
                  {user.full_name}
                </h3>
                <div className="text-xs text-[#86868B] flex items-center gap-2">
                  <span>Số điện thoại: {maskPhone(user.phone)}</span>
                  <span>·</span>
                  <span>Tham gia: {new Date(user.created_at).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>
            <Tag
              bordered={false}
              style={{
                borderRadius: 6,
                background: user.is_provisional ? '#F5F5F7' : '#ECFDF5',
                color: user.is_provisional ? '#86868B' : '#059669',
                fontSize: 12,
                fontWeight: 500,
                padding: '2px 8px',
              }}
            >
              {user.is_provisional ? 'Hạng Tạm thời' : 'Hạng Chính thức'}
            </Tag>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[#F5F5F7] border border-[#E5E5E7] rounded-[6px] mb-6 text-center">
            <div>
              <div className="text-xs text-[#86868B] mb-1">Điểm ELO</div>
              <div className="text-2xl font-bold text-[#1D1D1F]">{user.elo_rating}</div>
            </div>
            <div>
              <div className="text-xs text-[#86868B] mb-1">Trust Score</div>
              <div className="text-2xl font-bold text-[#2E7D32]">{user.trust_score}/100</div>
            </div>
            <div>
              <div className="text-xs text-[#86868B] mb-1">Tổng trận</div>
              <div className="text-2xl font-bold text-[#1D1D1F]">{user.total_matches}</div>
            </div>
            <div>
              <div className="text-xs text-[#86868B] mb-1">Tỉ lệ thắng</div>
              <div className="text-2xl font-bold text-[#1D1D1F]">
                {calculateWinrate(user.wins, user.total_matches)}%
              </div>
            </div>
          </div>

          {/* Match History */}
          <div className="mb-6">
            <div className="text-xs font-semibold tracking-wider text-[#86868B] uppercase mb-3">
              Lịch sử thi đấu gần nhất
            </div>
            {userMatches.length > 0 ? (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {userMatches.map((m) => {
                  const isPlayerA = m.player_a_id === user.id;
                  const opponentName = isPlayerA ? m.player_b_name : m.player_a_name;
                  const eloDelta = isPlayerA ? m.elo_change_a : m.elo_change_b;

                  return (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-3 border border-[#E5E5E7] rounded-[6px] text-xs bg-white"
                    >
                      <div>
                        <div className="font-medium text-[#1D1D1F]">
                          Đối đầu với <span className="font-semibold">{opponentName}</span>
                        </div>
                        <div className="text-[#86868B] text-[11px] mt-0.5">
                          {m.court_name} · {new Date(m.created_at).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                      <div className="text-right">
                        <Tag
                          bordered={false}
                          style={{
                            borderRadius: 6,
                            background: m.status === 'CONFIRMED' ? '#E8F5E9' : '#FFF3E0',
                            color: m.status === 'CONFIRMED' ? '#2E7D32' : '#E65100',
                            fontSize: 10,
                            fontWeight: 500,
                          }}
                        >
                          {m.status === 'CONFIRMED' ? 'Đã xác nhận' : m.status}
                        </Tag>
                        {eloDelta !== null && eloDelta !== undefined && (
                          <div
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              marginTop: 4,
                              color: eloDelta >= 0 ? '#34C759' : '#FF3B30'
                            }}
                          >
                            {eloDelta > 0 ? `+${eloDelta}` : eloDelta} ELO
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 border border-[#E5E5E7] rounded-[6px] text-center text-xs text-[#86868B]">
                Chưa có lịch sử trận đấu đối kháng nào.
              </div>
            )}
          </div>

          {/* Mobile Action Notice */}
          <div className="p-4 bg-[#F5F5F7] border border-[#E5E5E7] rounded-[6px] text-xs text-[#86868B] flex items-center justify-between">
            <span>Bạn muốn thách đấu {user.full_name}?</span>
            <Button
              size="small"
              type="primary"
              onClick={onOpenQrModal}
              style={{
                borderRadius: 6,
                backgroundColor: '#1D1D1F',
                borderColor: '#1D1D1F',
                color: '#FFFFFF',
                fontSize: 11,
              }}
            >
              Mở App để ghép kèo
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
