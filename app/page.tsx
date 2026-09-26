import prisma from '@/lib/prisma';
import PortalClient, { UserItem, CourtItem, MatchHistoryItem } from './components/PortalClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // 1. Tải danh sách người chơi xếp hạng ELO
  const rawUsers = await prisma.user.findMany({
    orderBy: { elo_rating: 'desc' },
    select: {
      id: true,
      full_name: true,
      phone: true,
      avatar_url: true,
      elo_rating: true,
      trust_score: true,
      total_matches: true,
      wins: true,
      losses: true,
      is_provisional: true,
      created_at: true,
    }
  });

  const users: UserItem[] = rawUsers.map((u) => ({
    ...u,
    created_at: u.created_at.toISOString(),
  }));

  // 2. Tải danh sách các sân đấu
  const rawCourts = await prisma.court.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      address: true,
      latitude: true,
      longitude: true,
      qr_code_value: true,
    }
  });

  const courts: CourtItem[] = rawCourts.map((c) => ({
    ...c,
  }));

  // 3. Tải các trận đấu gần đây
  const rawMatches = await prisma.match.findMany({
    take: 15,
    orderBy: { created_at: 'desc' },
    include: {
      player_a: { select: { full_name: true } },
      player_b: { select: { full_name: true } },
      request: {
        include: {
          court: { select: { name: true } }
        }
      }
    }
  });

  const recentMatches: MatchHistoryItem[] = rawMatches.map((m) => ({
    id: m.id,
    player_a_id: m.player_a_id,
    player_b_id: m.player_b_id,
    player_a_name: m.player_a?.full_name || 'Đấu thủ A',
    player_b_name: m.player_b?.full_name || 'Đấu thủ B',
    court_name: m.request?.court?.name || 'Sân chưa xác định',
    scores_data: typeof m.scores_data === 'string' ? m.scores_data : (m.scores_data ? JSON.stringify(m.scores_data) : null),
    status: m.status,
    created_at: m.created_at.toISOString(),
    elo_change_a: m.elo_change_a,
    elo_change_b: m.elo_change_b,
  }));

  const totalMatchesCount = await prisma.match.count();

  return (
    <PortalClient
      initialUsers={users}
      courts={courts}
      recentMatches={recentMatches}
      totalMatchesCount={totalMatchesCount}
    />
  );
}
