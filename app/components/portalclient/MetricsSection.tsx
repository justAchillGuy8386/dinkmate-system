'use client';

import React from 'react';
import { Row, Col } from 'antd';

interface MetricsSectionProps {
  userCount: number;
  matchesCount: number;
  courtCount: number;
}

export default function MetricsSection({
  userCount,
  matchesCount,
  courtCount,
}: MetricsSectionProps) {
  return (
    <section className="py-20 bg-[#F5F5F7] border-y border-[#E5E5E7]">
      <div className="max-w-6xl mx-auto px-6">
        <Row gutter={[32, 32]} justify="center">
          <Col xs={12} md={6} className="text-center md:border-r md:border-[#E5E5E7]">
            <div className="text-4xl md:text-5xl font-bold tracking-tight text-[#1D1D1F] mb-2">
              {userCount}
            </div>
            <div className="text-xs font-semibold tracking-wider text-[#86868B] uppercase">
              Vận động viên
            </div>
          </Col>
          <Col xs={12} md={6} className="text-center md:border-r md:border-[#E5E5E7]">
            <div className="text-4xl md:text-5xl font-bold tracking-tight text-[#1D1D1F] mb-2">
              {matchesCount}
            </div>
            <div className="text-xs font-semibold tracking-wider text-[#86868B] uppercase">
              Trận đấu đã tính ELO
            </div>
          </Col>
          <Col xs={12} md={6} className="text-center md:border-r md:border-[#E5E5E7]">
            <div className="text-4xl md:text-5xl font-bold tracking-tight text-[#1D1D1F] mb-2">
              100%
            </div>
            <div className="text-xs font-semibold tracking-wider text-[#86868B] uppercase">
              Đối soát hai chiều tại sân
            </div>
          </Col>
          <Col xs={12} md={6} className="text-center">
            <div className="text-4xl md:text-5xl font-bold tracking-tight text-[#1D1D1F] mb-2">
              {courtCount}
            </div>
            <div className="text-xs font-semibold tracking-wider text-[#86868B] uppercase">
              Cụm sân chuẩn hóa
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
}
