import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { match_id, winner_id, scores_data, intensity_feedback } = body;

    // Lấy thông tin trận đấu trước (không dùng transaction ở bước này vì cần gọi API ngoài)
    const match = await prisma.match.findUnique({
      where: { id: match_id },
      include: { player_a: true, player_b: true }
    });

    if (!match) throw new Error("Không tìm thấy trận đấu!");
    if (match.status !== "In_Progress") throw new Error("Trận đấu chưa diễn ra hoặc đã kết thúc!");

    const isPlayerA_Winner = match.player_a_id === winner_id;

    // GỌI SANG PYTHON AI ĐỂ LẤY KẾT QUẢ ELO MỚI
    const pythonResponse = await fetch('http://127.0.0.1:8000/api/calculate-elo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        player_a_elo: match.player_a.elo_rating,
        player_b_elo: match.player_b.elo_rating,
        is_player_a_winner: isPlayerA_Winner,
        scores_data: scores_data,
        intensity_feedback: intensity_feedback
      })
    });

    if (!pythonResponse.ok) {
      throw new Error("Lỗi khi kết nối với AI Python tính điểm!");
    }

    const aiResult = await pythonResponse.json();
    // Giả sử Python trả về: { new_elo_a: 1180, new_elo_b: 2666, elo_change_a: +14, elo_change_b: -14 }
    const newEloA = aiResult.new_elo_a;
    const newEloB = aiResult.new_elo_b;
    const eloChangeA = aiResult.elo_change_a;
    const eloChangeB = aiResult.elo_change_b;

    // TRANSACTION: LƯU TOÀN BỘ VÀO DATABASE
    const result = await prisma.$transaction(async (tx) => {
      // Cập nhật trạng thái Trận đấu
      const updatedMatch = await tx.match.update({
        where: { id: match_id },
        data: {
          status: "Completed",
          scores_data: scores_data,
          intensity_feedback: intensity_feedback,
          match_duration_minutes: 60, 
          elo_change_a: eloChangeA,
          elo_change_b: eloChangeB,
        }
      });

      // Cập nhật Profile Người chơi A
      await tx.user.update({
        where: { id: match.player_a_id },
        data: {
          elo_rating: newEloA,
          total_matches: { increment: 1 },
          wins: isPlayerA_Winner ? { increment: 1 } : undefined,
          losses: !isPlayerA_Winner ? { increment: 1 } : undefined,
          is_provisional: false, 
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