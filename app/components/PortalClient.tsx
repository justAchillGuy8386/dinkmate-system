'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ConfigProvider, message } from 'antd';
import { UserItem, CourtItem, MatchHistoryItem } from './portalclient/types';
import PortalHeader from './portalclient/PortalHeader';
import HeroSection from './portalclient/HeroSection';
import MetricsSection from './portalclient/MetricsSection';
import PhilosophySection from './portalclient/PhilosophySection';
import PodiumSection from './portalclient/PodiumSection';
import LeaderboardSection from './portalclient/LeaderboardSection';
import FairplaySection from './portalclient/FairplaySection';
import CourtsSection from './portalclient/CourtsSection';
import MobileAppSection from './portalclient/MobileAppSection';
import PortalFooter from './portalclient/PortalFooter';
import PlayerDetailModal from './portalclient/PlayerDetailModal';
import QrAppModal from './portalclient/QrAppModal';
import LoginModal from './portalclient/LoginModal';

export type { UserItem, CourtItem, MatchHistoryItem };

interface PortalClientProps {
  initialUsers: UserItem[];
  courts: CourtItem[];
  recentMatches: MatchHistoryItem[];
  totalMatchesCount: number;
}

export default function PortalClient({
  initialUsers,
  courts,
  recentMatches,
  totalMatchesCount,
}: PortalClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserItem | null>(null);

  // Load existing session from localStorage if present
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('dinkmate_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch {
      // ignore parsing errors
    }
  }, []);

  const handleLoginSuccess = (user: UserItem, token: string) => {
    try {
      localStorage.setItem('dinkmate_token', token);
      localStorage.setItem('dinkmate_user', JSON.stringify(user));
    } catch {
      // ignore storage errors
    }
    setCurrentUser(user);
    setIsLoginModalOpen(false);
    message.success(`Đăng nhập thành công! Xin chào ${user.full_name}`);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('dinkmate_token');
      localStorage.removeItem('dinkmate_user');
    } catch {
      // ignore storage errors
    }
    setCurrentUser(null);
    message.success('Đã đăng xuất khỏi hệ thống');
  };

  // Top 3 for Podium
  const topThree = useMemo(() => {
    return initialUsers.slice(0, 3);
  }, [initialUsers]);

  // Filtered leaderboard table data
  const filteredUsers = useMemo(() => {
    return initialUsers.filter((user) => {
      const matchSearch =
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm);

      if (!matchSearch) return false;

      if (tierFilter === 'all') return true;
      if (tierFilter === 'master') return user.elo_rating >= 1700;
      if (tierFilter === 'contender') return user.elo_rating >= 1500 && user.elo_rating < 1700;
      if (tierFilter === 'rookie') return user.elo_rating < 1500;
      return true;
    });
  }, [initialUsers, searchTerm, tierFilter]);

  // Match history for selected user in modal
  const userMatches = useMemo(() => {
    if (!selectedUser) return [];
    return recentMatches.filter(
      (m) => m.player_a_id === selectedUser.id || m.player_b_id === selectedUser.id
    );
  }, [selectedUser, recentMatches]);

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          borderRadius: 6,
          colorPrimary: '#059669',
          colorText: '#1D1D1F',
          colorTextSecondary: '#86868B',
          colorBorder: '#E5E5E7',
          colorBgContainer: '#FFFFFF',
          colorBgLayout: '#F5F5F7',
          boxShadow: 'none',
          boxShadowSecondary: 'none',
          boxShadowTertiary: 'none',
        },
        components: {
          Button: {
            borderRadius: 6,
            boxShadow: 'none',
            primaryShadow: 'none',
            defaultShadow: 'none',
          },
          Table: {
            borderRadius: 6,
            headerBg: '#F5F5F7',
            headerColor: '#1D1D1F',
            rowHoverBg: '#FAFAFA',
            borderColor: '#E5E5E7',
          },
          Modal: {
            borderRadiusLG: 6,
            boxShadow: 'none',
          },
          Tag: {
            borderRadiusSM: 6,
          },
          Segmented: {
            borderRadius: 6,
            itemSelectedBg: '#1D1D1F',
            itemSelectedColor: '#FFFFFF',
            itemHoverColor: '#1D1D1F',
            trackBg: '#F5F5F7',
          },
          Input: {
            borderRadius: 6,
            activeBorderColor: '#059669',
            hoverBorderColor: '#86868B',
          },
        },
      }}
    >
      <div className="min-h-screen bg-white text-[#1D1D1F] flex flex-col">
        {/* Minimal Header */}
        <PortalHeader
          currentUser={currentUser}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
          onLogout={handleLogout}
          onOpenQrModal={() => setIsQrModalOpen(true)}
        />

        <main className="flex-1">
          {/* Chapter 1: Hero */}
          <HeroSection />

          {/* Chapter 2: System Metrics */}
          <MetricsSection
            userCount={initialUsers.length}
            matchesCount={totalMatchesCount}
            courtCount={courts.length}
          />

          {/* Chapter 3: Philosophy */}
          <PhilosophySection />

          {/* Chapter 4: Podium Top 3 */}
          <PodiumSection
            topThree={topThree}
            onSelectUser={setSelectedUser}
          />

          {/* Chapter 5: Leaderboard Table */}
          <LeaderboardSection
            initialUsers={initialUsers}
            filteredUsers={filteredUsers}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            tierFilter={tierFilter}
            onTierFilterChange={setTierFilter}
            onSelectUser={setSelectedUser}
          />

          {/* Chapter 6: Four Pillars of Fairplay */}
          <FairplaySection />

          {/* Chapter 7: Courts Network */}
          <CourtsSection courts={courts} />

          {/* Chapter 8: Mobile App & QR Download */}
          <MobileAppSection onOpenQrModal={() => setIsQrModalOpen(true)} />
        </main>

        {/* Minimal Footer */}
        <PortalFooter />

        {/* Modals */}
        <PlayerDetailModal
          user={selectedUser}
          userMatches={userMatches}
          onClose={() => setSelectedUser(null)}
          onOpenQrModal={() => setIsQrModalOpen(true)}
        />

        <QrAppModal
          open={isQrModalOpen}
          onClose={() => setIsQrModalOpen(false)}
        />

        <LoginModal
          open={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    </ConfigProvider>
  );
}
