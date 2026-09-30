'use client';

import React from 'react';
import { Table, Input, Segmented, Tag, Avatar, Button, Empty } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { UserItem, getEloTier, calculateWinrate } from './types';

interface LeaderboardSectionProps {
  initialUsers: UserItem[];
  filteredUsers: UserItem[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  tierFilter: string;
  onTierFilterChange: (value: string) => void;
  onSelectUser: (user: UserItem) => void;
}

export default function LeaderboardSection({
  initialUsers,
  filteredUsers,
  searchTerm,
  onSearchChange,
  tierFilter,
  onTierFilterChange,
  onSelectUser,
}: LeaderboardSectionProps) {
  const tableColumns: ColumnsType<UserItem> = [
    {
      title: 'HẠNG',
      key: 'rank',
      width: 80,
      align: 'center',
      render: (_, record) => {
        const actualRank = initialUsers.findIndex((u) => u.id === record.id) + 1;
        if (actualRank === 1) {
          return (
            <span className="inline-flex items-center justify-center w-7 h-7 bg-[#059669] text-white text-xs font-bold rounded-[6px]">
              1
            </span>
          );
        }
        if (actualRank === 2) {
          return (
            <span className="inline-flex items-center justify-center w-7 h-7 bg-[#86868B] text-white text-xs font-semibold rounded-[6px]">
              2
            </span>
          );
        }
        if (actualRank === 3) {
          return (
            <span className="inline-flex items-center justify-center w-7 h-7 bg-[#E5E5E7] text-[#1D1D1F] text-xs font-semibold rounded-[6px]">
              3
            </span>
          );
        }
        return <span className="text-sm font-medium text-[#86868B]">{actualRank}</span>;
      },
    },
    {
      title: 'VẬN ĐỘNG VIÊN',
      key: 'player',
      render: (_, record) => {
        const initials = record.full_name
          .split(' ')
          .map((n) => n[0])
          .slice(-2)
          .join('')
          .toUpperCase();

        return (
          <div className="flex items-center gap-3">
            <Avatar
              size={36}
              src={record.avatar_url || undefined}
              style={{
                backgroundColor: '#F5F5F7',
                color: '#1D1D1F',
                fontWeight: 600,
                fontSize: 13,
                borderRadius: 6,
                border: '1px solid #E5E5E7',
              }}
            >
              {initials}
            </Avatar>
            <div>
              <div className="font-medium text-[#1D1D1F] text-sm flex items-center gap-2">
                <span>{record.full_name}</span>
                {record.is_provisional ? (
                  <Tag
                    bordered={false}
                    style={{
                      borderRadius: 6,
                      background: '#F5F5F7',
                      color: '#86868B',
                      fontSize: 11,
                      padding: '0 6px',
                    }}
                  >
                    Tạm thời
                  </Tag>
                ) : (
                  <Tag
                    bordered={false}
                    style={{
                      borderRadius: 6,
                      background: '#ECFDF5',
                      color: '#059669',
                      fontSize: 11,
                      padding: '0 6px',
                    }}
                  >
                    Chính thức
                  </Tag>
                )}
              </div>
              <div className="text-xs text-[#86868B]">
                Gia nhập: {new Date(record.created_at).toLocaleDateString('vi-VN')}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: 'ĐIỂM ELO',
      dataIndex: 'elo_rating',
      key: 'elo_rating',
      sorter: (a, b) => a.elo_rating - b.elo_rating,
      defaultSortOrder: 'descend',
      render: (elo: number) => {
        const tier = getEloTier(elo);
        return (
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1D1D1F] text-base">{elo}</span>
            <Tag
              style={{
                borderRadius: 6,
                background: tier.tagBg,
                color: tier.tagColor,
                borderColor: tier.borderColor,
                fontSize: 11,
                fontWeight: 500,
              }}
            >
              {tier.name}
            </Tag>
          </div>
        );
      },
    },
    {
      title: 'THÀNH TÍCH',
      key: 'record',
      render: (_, record) => {
        const winrate = calculateWinrate(record.wins, record.total_matches);
        return (
          <div>
            <div className="text-sm text-[#1D1D1F] font-medium">
              {record.wins}T - {record.losses}B ({record.total_matches} trận)
            </div>
            <div className="text-xs text-[#86868B]">Tỉ lệ thắng: {winrate}%</div>
          </div>
        );
      },
    },
    {
      title: 'ĐIỂM UY TÍN',
      dataIndex: 'trust_score',
      key: 'trust_score',
      render: (score: number) => {
        const isHigh = score >= 90;
        return (
          <Tag
            bordered={false}
            style={{
              borderRadius: 6,
              background: isHigh ? '#E8F5E9' : '#FFF3E0',
              color: isHigh ? '#2E7D32' : '#E65100',
              fontWeight: 600,
              fontSize: 12,
            }}
          >
            {score}/100
          </Tag>
        );
      },
    },
    {
      title: '',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Button
          type="text"
          onClick={() => onSelectUser(record)}
          style={{
            borderRadius: 6,
            color: '#059669',
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          Hồ sơ <ArrowRightOutlined style={{ fontSize: 11 }} />
        </Button>
      ),
    },
  ];

  return (
    <section id="leaderboard" className="py-28 px-6 bg-white border-t border-[#E5E5E7]">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-semibold tracking-widest text-[#86868B] uppercase mb-2">
            Xếp hạng toàn hệ thống
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1D1D1F] mb-3">
            Bảng Xếp Hạng ELO Cộng Đồng
          </h2>
          <p className="text-sm text-[#86868B]">
            Dữ liệu tính điểm ELO theo tiêu chuẩn USAPA / DUPR. Tự động cập nhật ngay khi hai đấu thủ chốt tỉ số tại sân.
          </p>
        </div>

        {/* Controls Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#E5E5E7]">
          <div className="w-full md:w-80">
            <Input
              placeholder="Tìm theo tên hoặc số điện thoại..."
              prefix={<SearchOutlined style={{ color: '#86868B' }} />}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              allowClear
              style={{
                height: 40,
                borderRadius: 6,
                borderColor: '#E5E5E7',
                fontSize: 14,
              }}
            />
          </div>

          <div className="overflow-x-auto">
            <Segmented
              value={tierFilter}
              onChange={(val) => onTierFilterChange(val as string)}
              options={[
                { label: 'Tất cả phân hạng', value: 'all' },
                { label: 'Cao thủ (≥ 1700)', value: 'master' },
                { label: 'Tiềm năng (≥ 1500)', value: 'contender' },
                { label: 'Khởi đầu (< 1500)', value: 'rookie' },
              ]}
              style={{
                padding: 4,
                borderRadius: 6,
                backgroundColor: '#F5F5F7',
              }}
            />
          </div>
        </div>

        {/* Ant Design Table */}
        <div className="border border-[#E5E5E7] rounded-[6px] overflow-hidden">
          <Table
            dataSource={filteredUsers}
            columns={tableColumns}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              style: { padding: '16px 24px', margin: 0, borderTop: '1px solid #E5E5E7' },
            }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={<span className="text-[#86868B] text-sm">Không tìm thấy vận động viên phù hợp</span>}
                />
              ),
            }}
          />
        </div>
      </div>
    </section>
  );
}
