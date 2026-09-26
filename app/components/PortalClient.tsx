'use client';

import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Search,
  Smartphone,
  QrCode,
  MapPin,
  ShieldCheck,
  Zap,
  Flame,
  Users,
  ChevronRight,
  Info,
  CheckCircle2,
  X,
  Crosshair,
  Activity,
  Sparkles,
  ArrowUpRight,
  HeartHandshake
} from 'lucide-react';

export interface UserItem {
  id: string;
  full_name: string;
  phone: string;
  avatar_url: string | null;
  elo_rating: number;
  trust_score: number;
  total_matches: number;
  wins: number;
  losses: number;
  is_provisional: boolean;
  created_at: string;
}

export interface CourtItem {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  qr_code_value: string;
}

export interface MatchHistoryItem {
  id: string;
  player_a_id: string;
  player_b_id: string;
  player_a_name: string;
  player_b_name: string;
  court_name: string;
  scores_data: string | null;
  status: string;
  created_at: string;
  elo_change_a: number | null;
  elo_change_b: number | null;
}

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
  totalMatchesCount
}: PortalClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState<'ALL' | 'PRO' | 'DIAMOND' | 'GOLD' | 'SILVER' | 'BRONZE'>('ALL');
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'LEADERBOARD' | 'HOW_IT_WORKS' | 'COURTS'>('LEADERBOARD');

  // Tính tier cho người chơi
  const getPlayerTier = (elo: number) => {
    if (elo >= 1400) return { name: 'PRO MASTER', badge: 'bg-purple-50 text-purple-700 border-purple-200' };
    if (elo >= 1250) return { name: 'DIAMOND', badge: 'bg-sky-50 text-sky-700 border-sky-200' };
    if (elo >= 1150) return { name: 'GOLD', badge: 'bg-amber-50 text-amber-700 border-amber-200' };
    if (elo >= 1050) return { name: 'SILVER', badge: 'bg-slate-100 text-slate-700 border-slate-300' };
    return { name: 'BRONZE', badge: 'bg-orange-50 text-orange-700 border-orange-200' };
  };

  // Lọc danh sách đấu thủ
  const filteredUsers = useMemo(() => {
    return initialUsers.filter((u) => {
      const matchesSearch =
        u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone.includes(searchTerm) ||
        u.id.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (tierFilter === 'ALL') return true;
      const tier = getPlayerTier(u.elo_rating).name;
      if (tierFilter === 'PRO') return tier === 'PRO MASTER';
      if (tierFilter === 'DIAMOND') return tier === 'DIAMOND';
      if (tierFilter === 'GOLD') return tier === 'GOLD';
      if (tierFilter === 'SILVER') return tier === 'SILVER';
      if (tierFilter === 'BRONZE') return tier === 'BRONZE';
      return true;
    });
  }, [initialUsers, searchTerm, tierFilter]);

  // Lịch sử trận đấu của người chơi được chọn
  const userMatches = useMemo(() => {
    if (!selectedUser) return [];
    return recentMatches.filter(
      (m) => m.player_a_id === selectedUser.id || m.player_b_id === selectedUser.id
    );
  }, [selectedUser, recentMatches]);

  const top3 = initialUsers.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* 1. TOP NAV BAR (LIGHT THEME) */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-lime-500 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white">
              <Zap className="w-6 h-6 fill-white text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black tracking-tight text-slate-900">DinkMate</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                  Cổng Thông Tin
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Cộng Đồng & Bảng Xếp Hạng Pickleball Thân Thiện
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-1 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('LEADERBOARD')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'LEADERBOARD'
                  ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              🏆 Bảng Xếp Hạng
            </button>
            <button
              onClick={() => setActiveTab('HOW_IT_WORKS')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'HOW_IT_WORKS'
                  ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              📱 Ứng Dụng Mobile
            </button>
            <button
              onClick={() => setActiveTab('COURTS')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'COURTS'
                  ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              🏟️ Sân Pickleball
            </button>
          </nav>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-md shadow-emerald-600/20 transform hover:-translate-y-0.5"
            >
              <Smartphone className="w-4 h-4" />
              <span>Tải App Ra Sân</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SHOWCASE (LIGHT & FRESH) */}
      <section className="relative overflow-hidden pt-12 pb-16 border-b border-slate-200/60 bg-gradient-to-b from-emerald-50/50 via-[#F8FAFC] to-[#F8FAFC]">
        {/* Soft background accents */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-lime-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-emerald-200 text-xs font-bold text-emerald-800 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Hệ Thống Xếp Hạng & Giao Lưu Pickleball Mọi Trình Độ</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">
              Giao Lưu & Nâng Hạng{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-lime-600">
                Pickleball Mỗi Ngày
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
              Dù bạn mới bắt đầu cầm vợt hay là tay vợt kỳ cựu, DinkMate giúp bạn dễ dàng theo dõi điểm ELO, tìm đối thủ ngang tài gần nhất và thỏa mãn niềm đam mê với trái bóng nhựa.
            </p>

            {/* Live Data Cards (Bright, Clean, Friendly) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-200 transition-colors">
                <div className="text-2xl sm:text-3xl font-black text-emerald-600">{initialUsers.length}</div>
                <div className="text-xs font-semibold text-slate-500 mt-1 flex items-center justify-center space-x-1">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Người Chơi</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-200 transition-colors">
                <div className="text-2xl sm:text-3xl font-black text-sky-600">{totalMatchesCount}</div>
                <div className="text-xs font-semibold text-slate-500 mt-1 flex items-center justify-center space-x-1">
                  <Flame className="w-3.5 h-3.5 text-sky-600" />
                  <span>Trận Giao Lưu</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-amber-200 transition-colors">
                <div className="text-2xl sm:text-3xl font-black text-amber-600">{courts.length}</div>
                <div className="text-xs font-semibold text-slate-500 mt-1 flex items-center justify-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>Sân Gần Bạn</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-200 transition-colors">
                <div className="text-2xl sm:text-3xl font-black text-emerald-600">100%</div>
                <div className="text-xs font-semibold text-slate-500 mt-1 flex items-center justify-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Chơi Thật - Điểm Thật</span>
                </div>
              </div>
            </div>

            {/* Friendly Notice Callout */}
            <div className="mt-4 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-left flex items-start space-x-3.5">
              <Info className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 leading-relaxed">
                <strong className="text-emerald-900 font-bold">Thân thiện với người mới:</strong> Bạn có thể tự do xem bảng thứ hạng và hồ sơ cá nhân ngay tại đây. Khi sẵn sàng ra sân giao lưu, hãy dùng <strong>ứng dụng DinkMate trên điện thoại</strong> để quét mã QR tại sân và ghi nhận điểm ELO của mình nhé!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NỘI DUNG CHÍNH (LIGHT THEME) */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* ================= TAB 1: LEADERBOARD ================= */}
        {activeTab === 'LEADERBOARD' && (
          <div className="space-y-10">
            {/* TOP 3 PODIUM (BRIGHT & ENERGETIC) */}
            {top3.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-6">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Top Đấu Thủ Tiêu Biểu</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {top3.map((user, idx) => {
                    const tier = getPlayerTier(user.elo_rating);
                    const isTop1 = idx === 0;
                    const isTop2 = idx === 1;
                    const isTop3 = idx === 2;

                    const medalBadge = isTop1 ? '🥇 Top 1 Vô Địch' : isTop2 ? '🥈 Top 2' : '🥉 Top 3';
                    const ringColor = isTop1
                      ? 'border-amber-300 bg-amber-50/30'
                      : isTop2
                      ? 'border-slate-300 bg-slate-50/60'
                      : 'border-orange-200 bg-orange-50/30';

                    return (
                      <div
                        key={user.id}
                        onClick={() => setSelectedUser(user)}
                        className={`relative cursor-pointer rounded-3xl p-6 bg-white border-2 ${ringColor} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-900 text-white">
                            {medalBadge}
                          </span>
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${tier.badge}`}>
                            {tier.name}
                          </span>
                        </div>

                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-lime-500 flex items-center justify-center text-2xl font-black text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                            {user.full_name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                              {user.full_name}
                            </h3>
                            <p className="text-xs text-slate-500 font-mono">
                              ĐT: {user.phone.slice(0, 4)}***{user.phone.slice(-3)}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                          <div>
                            <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Điểm ELO</span>
                            <span className="text-2xl font-black text-emerald-600 font-mono">{user.elo_rating}</span>
                          </div>
                          <div>
                            <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Tỉ Lệ Thắng</span>
                            <span className="text-2xl font-black text-slate-800 font-mono">
                              {user.total_matches > 0 ? Math.round((user.wins / user.total_matches) * 100) : 0}%
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                          <span>{user.total_matches} trận ({user.wins}T - {user.losses}B)</span>
                          <span className="text-emerald-600 font-bold group-hover:underline flex items-center">
                            Xem hồ sơ <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SEARCH & FILTERS */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm theo tên hoặc số điện thoại..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>

              {/* Tier Filters */}
              <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                {(['ALL', 'PRO', 'DIAMOND', 'GOLD', 'SILVER', 'BRONZE'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTierFilter(t)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      tierFilter === t
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    {t === 'ALL' ? 'TẤT CẢ' : t}
                  </button>
                ))}
              </div>
            </div>

            {/* FULL LEADERBOARD TABLE (CLEAN, HIGH CONTRAST) */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-4 px-6 text-center w-20">Hạng</th>
                      <th className="py-4 px-6">Đấu Thủ</th>
                      <th className="py-4 px-6">Phân Cấp (Tier)</th>
                      <th className="py-4 px-6 text-right">Điểm ELO</th>
                      <th className="py-4 px-6 text-center">Hiệu Suất (Win Rate)</th>
                      <th className="py-4 px-6 text-center">Tổng Trận</th>
                      <th className="py-4 px-6 text-center">Điểm Uy Tín</th>
                      <th className="py-4 px-6 text-center">Hành Động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-400">
                          Không tìm thấy đấu thủ nào khớp với điều kiện tìm kiếm.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user, index) => {
                        const tier = getPlayerTier(user.elo_rating);
                        const winRate = user.total_matches > 0 ? Math.round((user.wins / user.total_matches) * 100) : 0;
                        const rankNum = index + 1;

                        return (
                          <tr
                            key={user.id}
                            onClick={() => setSelectedUser(user)}
                            className="hover:bg-emerald-50/40 transition-colors cursor-pointer group"
                          >
                            <td className="py-4 px-6 text-center font-black">
                              {rankNum === 1 && <span className="text-xl">🥇</span>}
                              {rankNum === 2 && <span className="text-xl">🥈</span>}
                              {rankNum === 3 && <span className="text-xl">🥉</span>}
                              {rankNum > 3 && <span className="text-slate-500 font-mono">#{rankNum}</span>}
                            </td>

                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                  {user.full_name.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors flex items-center space-x-2">
                                    <span>{user.full_name}</span>
                                    {user.is_provisional && (
                                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                                        Tân thủ
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-slate-400 font-mono">
                                    {user.phone.slice(0, 4)}***{user.phone.slice(-3)}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-6">
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${tier.badge}`}>
                                {tier.name}
                              </span>
                            </td>

                            <td className="py-4 px-6 text-right font-black text-emerald-600 text-base font-mono">
                              {user.elo_rating}
                            </td>

                            <td className="py-4 px-6">
                              <div className="w-36 mx-auto">
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="font-bold text-slate-800">{winRate}%</span>
                                  <span className="text-slate-500 text-[11px]">{user.wins}T - {user.losses}B</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
                                  <div
                                    className="bg-emerald-500 h-2 rounded-full transition-all"
                                    style={{ width: `${winRate}%` }}
                                  />
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-6 text-center font-semibold text-slate-700 font-mono">
                              {user.total_matches}
                            </td>

                            <td className="py-4 px-6 text-center">
                              <span className={`inline-flex items-center space-x-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                                user.trust_score >= 80
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : user.trust_score >= 60
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-red-50 text-red-700 border border-red-200'
                              }`}>
                                <ShieldCheck className="w-3 h-3" />
                                <span>{user.trust_score}/100</span>
                              </span>
                            </td>

                            <td className="py-4 px-6 text-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedUser(user);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-xs font-bold text-slate-700 transition-all"
                              >
                                Xem Hồ Sơ
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: HOW IT WORKS (WARM, CLEAR & FRIENDLY) ================= */}
        {activeTab === 'HOW_IT_WORKS' && (
          <div className="space-y-12 py-4">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Vì Sao Nghiệp Vụ Cốt Lõi Thuộc Về Mobile App?
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Để đảm bảo mọi trận đấu đều diễn ra công bằng, lành mạnh và loại bỏ hoàn toàn các trận đấu ảo, DinkMate yêu cầu người chơi sử dụng ứng dụng di động khi ra sân thực tế.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                  <Crosshair className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">1. Ghép Sân & Vị Trí Gần</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ứng dụng dùng GPS để tìm các đối thủ ở gần bạn (dưới 25km) hoặc đang cùng mặt sân. Bạn không phải lo bị ghép với người ở quá xa không thể gặp nhau thi đấu.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center">
                  <QrCode className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">2. Quét QR Sân Đấu</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Khi đến sân, bạn chỉ cần mở camera trên app và quét mã QR dán tại sân. Trận đấu chỉ bắt đầu khi cả 2 bạn đều đã có mặt và quét mã xác nhận.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">3. Đối Soát Tỷ Số 2 Bên</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Đánh xong set đấu, cả hai người cùng nhập tỷ số trên máy của mình. Nếu điểm số khớp nhau, ELO sẽ tự nhảy ngay lập tức mà không cần ban tổ chức chấm tay!
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">4. Bảo Vệ Người Đúng Hẹn</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Nếu bạn ra sân đúng hẹn mà đối thủ vắng mặt (bùng kèo), app có nút báo đối thủ vắng mặt để bảo vệ quyền lợi cho bạn và trừ điểm uy tín của đối thủ.
                </p>
              </div>
            </div>

            {/* Mobile App Download Banner (Bright & Inviting) */}
            <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white">Cầm Vợt Ra Sân Ngay Hôm Nay!</h3>
                <p className="text-sm text-emerald-100">
                  Tải ứng dụng DinkMate Mobile để trải nghiệm radar ghép kèo thông minh trong 30 giây.
                </p>
              </div>
              <button
                onClick={() => setIsQrModalOpen(true)}
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-emerald-800 font-black text-sm transition-all transform hover:-translate-y-0.5 shadow-lg flex items-center space-x-2"
              >
                <Smartphone className="w-4 h-4 text-emerald-700" />
                <span>Xem Mã QR Tải App</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 3: COURTS NETWORK ================= */}
        {activeTab === 'COURTS' && (
          <div className="space-y-8 py-4">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Cụm Sân Pickleball Đang Kết Nối</h2>
              <p className="text-slate-600 text-sm">
                Danh sách các cụm sân tiêu chuẩn đã được gắn mã QR định danh và toạ độ thực tế trên hệ thống DinkMate.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courts.map((court) => (
                <div
                  key={court.id}
                  className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Sân Tiêu Chuẩn QR
                    </span>
                    <span className="text-xs font-mono text-slate-400">ID: {court.id.slice(0, 8)}...</span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{court.name}</h3>
                    <p className="text-xs text-slate-600 mt-1 flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{court.address}</span>
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div>
                      <span className="block text-[10px] uppercase text-slate-400 font-semibold">Tọa độ GPS</span>
                      <span className="font-mono text-slate-700 font-medium">
                        {court.latitude.toFixed(4)}, {court.longitude.toFixed(4)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] uppercase text-slate-400 font-semibold">Mã QR Check-in</span>
                      <span className="font-mono text-emerald-600 font-bold">Có sẵn tại sân</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 4. MODAL: PROFILE CHI TIẾT ĐẤU THỦ (LIGHT & CLEAN) */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-lime-500 flex items-center justify-center text-2xl font-black text-white shadow-md shadow-emerald-500/20">
                {selectedUser.full_name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-2xl font-black text-slate-900">{selectedUser.full_name}</h3>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getPlayerTier(selectedUser.elo_rating).badge}`}>
                    {getPlayerTier(selectedUser.elo_rating).name}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  Đấu thủ ID: {selectedUser.id}
                </p>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[11px] text-slate-500 font-medium block">Điểm ELO</span>
                <span className="text-2xl font-black text-emerald-600 font-mono">{selectedUser.elo_rating}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[11px] text-slate-500 font-medium block">Tỉ Lệ Thắng</span>
                <span className="text-2xl font-black text-slate-800 font-mono">
                  {selectedUser.total_matches > 0 ? Math.round((selectedUser.wins / selectedUser.total_matches) * 100) : 0}%
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[11px] text-slate-500 font-medium block">Thắng / Thua</span>
                <span className="text-2xl font-black text-slate-700 font-mono">
                  {selectedUser.wins} / {selectedUser.losses}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[11px] text-slate-500 font-medium block">Điểm Uy Tín</span>
                <span className="text-2xl font-black text-emerald-700 font-mono">{selectedUser.trust_score}</span>
              </div>
            </div>

            {/* Match History */}
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Lịch Sử Các Trận Gần Đây</span>
              </h4>

              {userMatches.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                  Chưa có dữ liệu trận đấu hoàn tất gần đây.
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {userMatches.map((m) => (
                    <div
                      key={m.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900">
                          {m.player_a_name} <span className="text-slate-400">vs</span> {m.player_b_name}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center space-x-2">
                          <span>Sân: {m.court_name}</span>
                          <span>•</span>
                          <span>Trạng thái: {m.status}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-mono font-bold text-sm text-emerald-600">
                          {m.scores_data || 'Chờ điểm'}
                        </span>
                        <span className="block text-[10px] text-slate-400">
                          {new Date(m.created_at).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Callout */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
              <span>Bạn muốn giao lưu cùng <strong>{selectedUser.full_name}</strong>?</span>
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setIsQrModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors ml-3 flex-shrink-0"
              >
                Mở App Mobile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL: QR CODE TẢI APP MOBILE (BRIGHT & CLEAN) */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
            <button
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <Smartphone className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900">Tải Ứng Dụng DinkMate Mobile</h3>
              <p className="text-xs text-slate-600 mt-2">
                Trải nghiệm trọn vẹn: Tạo kèo Đấu Hạng, radar AI ghép đối thủ gần nhau và camera quét mã QR ra sân.
              </p>
            </div>

            {/* Mockup QR Code */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-3xl mx-auto inline-block shadow-inner">
              <div className="w-48 h-48 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center p-4 text-center text-slate-800 space-y-2">
                <QrCode className="w-24 h-24 text-emerald-600" />
                <span className="text-[11px] font-mono font-bold text-slate-600">dinkmate.app/download</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <p className="flex items-center justify-center space-x-1.5 text-emerald-700 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Hỗ trợ cả Android & iOS (Flutter Engine)</span>
              </p>
              <p className="text-[11px] text-slate-500">
                Mở camera trên điện thoại và hướng vào mã QR trên để mở ứng dụng di động ngay lập tức.
              </p>
            </div>

            <button
              onClick={() => setIsQrModalOpen(false)}
              className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* 6. FOOTER */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">DinkMate System</span>
            <span>•</span>
            <span>Nền tảng Pickleball Thế hệ mới</span>
          </div>

          <div className="flex items-center space-x-6">
            <a href="/admin/disputes" className="hover:text-emerald-700 font-semibold transition-colors flex items-center space-x-1">
              <span>Hệ Thống Phân Xử Khiếu Nại</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <span className="text-slate-300">|</span>
            <span>© 2026 DinkMate Inc. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
