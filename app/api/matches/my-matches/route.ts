import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Thiếu userId' }, { status: 400 });
    }

    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { player_a_id: userId },
          { player_b_id: userId }
        ]
      },
      include: {
        request: {
          select: {
            is_ranked: true
          }
        }
      }
    });

    const enrichedMatches = await Promise.all(matches.map(async (match) => {
      const opponentId = match.player_a_id === userId ? match.player_b_id : match.player_a_id;
      
      const opponent = await prisma.user.findUnique({
        where: { id: opponentId },
        select: { full_name: true, elo_rating: true, avatar_url: true }
      });

      const isPlayerA = match.player_a_id === userId;
      const eloChangeA = match.elo_change_a ?? 0;
      const eloChangeB = match.elo_change_b ?? 0;
      let winnerId = "";
      if (eloChangeA > 0) winnerId = match.player_a_id;
      else if (eloChangeB > 0) winnerId = match.player_b_id;

      const myEloChange = isPlayerA ? eloChangeA : eloChangeB;
      const isWinner = winnerId ? winnerId === userId : myEloChange > 0;
      const isRanked = match.request?.is_ranked ?? false;

      return {
        ...match,
        is_ranked: isRanked,
        winner_id: winnerId,
        is_winner: isWinner,
        elo_change: isRanked ? Math.abs(myEloChange) : 0,
        opponent_id: opponentId,
        opponent_name: opponent?.full_name ?? "Ẩn danh",
        opponent_elo: opponent?.elo_rating ?? 0,
        opponent_avatar: opponent?.avatar_url
      };
    }));

    enrichedMatches.reverse();

    return NextResponse.json({ message: 'Thành công', data: enrichedMatches }, { status: 200 });

  } catch (error) {
    console.error("Lỗi lấy danh sách trận đấu:", error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}