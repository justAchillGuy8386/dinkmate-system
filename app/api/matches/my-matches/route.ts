import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // Lấy userId từ URL
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Thiếu userId' }, { status: 400 });
    }

    // Lấy tất cả các trận đấu có sự tham gia của User này
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { player_a_id: userId },
          { player_b_id: userId }
        ]
      }
    });

    // Tự động tìm xem ai là đối thủ để app Flutter dễ dùng
    const enrichedMatches = await Promise.all(matches.map(async (match) => {
      const opponentId = match.player_a_id === userId ? match.player_b_id : match.player_a_id;
      
      // Kéo thông tin đối thủ từ bảng User
      const opponent = await prisma.user.findUnique({
        where: { id: opponentId },
        select: { full_name: true, elo_rating: true, avatar_url: true }
      });

      return {
        ...match,
        opponent_id: opponentId,
        opponent_name: opponent?.full_name ?? "Ẩn danh",
        opponent_elo: opponent?.elo_rating ?? 0,
        opponent_avatar: opponent?.avatar_url
      };
    }));

    // (Tùy chọn) Đảo ngược mảng để trận mới nhất lên đầu
    enrichedMatches.reverse();

    return NextResponse.json({ message: 'Thành công', data: enrichedMatches }, { status: 200 });

  } catch (error) {
    console.error("Lỗi lấy danh sách trận đấu:", error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}