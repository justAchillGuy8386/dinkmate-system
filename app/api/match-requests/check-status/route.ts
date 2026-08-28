import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ error: 'Thiếu thông tin user_id' }, { status: 400 });
    }

    // 1. Kiểm tra xem AI đã tạo trận đấu (Match) nào cho người này chưa
    const newMatch = await prisma.match.findFirst({
      where: {
        OR: [{ player_a_id: userId }, { player_b_id: userId }],
        status: 'Pending', // Trạng thái trận đấu vừa được AI tạo ra
      },
      include: {
        player_a: { select: { id: true, full_name: true, elo_rating: true } },
        player_b: { select: { id: true, full_name: true, elo_rating: true } },
      }
    });

    // TÌM THẤY TRẬN
    if (newMatch) {
      const isPlayerA = newMatch.player_a_id === userId;
      const opponent = isPlayerA ? newMatch.player_b : newMatch.player_a;

      return NextResponse.json({
        status: 'Matched',
        match_id: newMatch.id,
        opponent_id: opponent.id,
        opponent_name: opponent.full_name,
        opponent_elo: opponent.elo_rating,
      }, { status: 200 });
    }

    // 2. Nếu chưa có trận, kiểm tra xem vé chờ vẫn còn đang quay không
    const pendingRequest = await prisma.matchRequest.findFirst({
      where: { creator_id: userId, status: 'Searching' } 
    });

    if (pendingRequest) {
      return NextResponse.json({ status: 'Searching' }, { status: 200 });
    }

    // 3. Không có trận cũng không có vé
    return NextResponse.json({ status: 'None' }, { status: 200 });

  } catch (error) {
    console.error("Lỗi API Check Status:", error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}