import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

// Hàm tính ELO cơ bản (K-factor = 32)
function calculateElo(rating1: number, rating2: number, isWin: boolean) {
  const K = 32;
  const expectedScore = 1 / (1 + Math.pow(10, (rating2 - rating1) / 400));
  const actualScore = isWin ? 1 : 0;
  return Math.round(rating1 + K * (actualScore - expectedScore));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { match_id, winner_id, scores_data, intensity_feedback } = body;

    const result = await prisma.$transaction(async (tx) => {
      // Lấy thông tin trận đấu và 2 người chơi
      const match = await tx.match.findUnique({
        where: { id: match_id },
        include: { player_a: true, player_b: true }
      });

      if (!match) throw new Error("Không tìm thấy trận đấu!");
      if (match.status !== "In_Progress") throw new Error("Trận đấu chưa diễn ra hoặc đã kết thúc!");

      // Xác định ai thắng, ai thua để tính ELO
      const isPlayerA_Winner = match.player_a_id === winner_id;
      
      const newEloA = calculateElo(match.player_a.elo_rating, match.player_b.elo_rating, isPlayerA_Winner);
      const newEloB = calculateElo(match.player_b.elo_rating, match.player_a.elo_rating, !isPlayerA_Winner);

      const eloChangeA = newEloA - match.player_a.elo_rating;
      const eloChangeB = newEloB - match.player_b.elo_rating;

      // Cập nhật trạng thái Trận đấu
      const updatedMatch = await tx.match.update({
        where: { id: match_id },
        data: {
          status: "Completed",
          scores_data: scores_data,
          intensity_feedback: intensity_feedback,
          match_duration_minutes: 60, // Giả sử đánh 1 tiếng, thực tế có thể tính từ check_in_time
          elo_change_a: eloChangeA,
          elo_change_b: eloChangeB,
        }
      });

      // Cập nhật Profile Người chơi A (Điểm số & Thống kê)
      await tx.user.update({
        where: { id: match.player_a_id },
        data: {
          elo_rating: newEloA,
          total_matches: { increment: 1 },
          wins: isPlayerA_Winner ? { increment: 1 } : undefined,
          losses: !isPlayerA_Winner ? { increment: 1 } : undefined,
          is_provisional: false, // Đã đánh xong trận đầu, bỏ mác "Đang định hạng"
        }
      });

      // Cập nhật Profile Người chơi B
      await tx.user.update({
        where: { id: match.player_b_id },
        data: {
          elo_rating: newEloB,
          total_matches: { increment: 1 },
          wins: !isPlayerA_Winner ? { increment: 1 } : undefined,
          losses: isPlayerA_Winner ? { increment: 1 } : undefined,
          is_provisional: false,
        }
      });

      return updatedMatch;
    });

    return NextResponse.json(
      { message: 'Cập nhật kết quả thành công!', data: result },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Lỗi Submit Score:", error);
    return NextResponse.json(
      { error: error.message || 'Lỗi hệ thống' },
      { status: 400 }
    );
  }
}