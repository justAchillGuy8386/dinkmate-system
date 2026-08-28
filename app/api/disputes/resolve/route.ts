import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma'; 

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      match_id, 
      final_winner_id, 
      final_scores_data, 
      liar_id // ID của người chơi bị xác định gian lận
    } = body;

    if (!match_id || !final_winner_id) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc (match_id, final_winner_id)!' }, { status: 400 });
    }

    // 1. Lấy thông tin trận đấu
    const match = await prisma.match.findUnique({
      where: { id: match_id },
      include: { player_a: true, player_b: true }
    });

    if (!match) throw new Error("Không tìm thấy trận đấu!");
    if (match.status !== "Disputed") throw new Error("Trận đấu này không trong trạng thái tranh chấp!");

    const isPlayerA_Winner = match.player_a_id === final_winner_id;

    // 2. GỌI SANG PYTHON AI 
    const pythonResponse = await fetch('http://127.0.0.1:8000/api/calculate-elo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        player_a_elo: match.player_a.elo_rating,
        player_b_elo: match.player_b.elo_rating,
        is_player_a_winner: isPlayerA_Winner,
        scores_data: final_scores_data || match.scores_data, // Lấy điểm Admin chốt, nếu ko có thì lấy điểm tạm
        intensity_feedback: String(match.intensity_feedback || "Medium") // Mặc định Medium
      })
    });

    if (!pythonResponse.ok) {
      const errorDetail = await pythonResponse.text();
      console.error("CHI TIẾT LỖI TỪ PYTHON:", errorDetail);
      throw new Error("Lỗi khi kết nối với AI Python tính điểm!");
    }

    const aiResult = await pythonResponse.json();
    const newEloA = aiResult.new_elo_a;
    const newEloB = aiResult.new_elo_b;
    const eloChangeA = aiResult.elo_change_a;
    const eloChangeB = aiResult.elo_change_b;

    // 3. TRANSACTION: ĐÓNG TRANH CHẤP, CHỐT TRẬN ĐẤU
    const result = await prisma.$transaction(async (tx) => {
      
      // A. Cập nhật trạng thái trận đấu thành Completed
      const updatedMatch = await tx.match.update({
        where: { id: match_id },
        data: {
          status: "Completed",
          scores_data: final_scores_data,
          elo_change_a: eloChangeA,
          elo_change_b: eloChangeB,
        }
      });

      // B. Đóng TẤT CẢ các hồ sơ khiếu nại liên quan đến trận này
      await tx.dispute.updateMany({
        where: { match_id: match_id },
        data: { status: "Resolved" }
      });

      // C. Cập nhật Profile Người chơi A
      await tx.user.update({
        where: { id: match.player_a_id },
        data: {
          elo_rating: newEloA,
          total_matches: { increment: 1 },
          wins: isPlayerA_Winner ? { increment: 1 } : undefined,
          losses: !isPlayerA_Winner ? { increment: 1 } : undefined,
        }
      });

      // D. Cập nhật Profile Người chơi B
      await tx.user.update({
        where: { id: match.player_b_id },
        data: {
          elo_rating: newEloB,
          total_matches: { increment: 1 },
          wins: !isPlayerA_Winner ? { increment: 1 } : undefined,
          losses: isPlayerA_Winner ? { increment: 1 } : undefined,
        }
      });

      // E. Trừng phạt người chơi cheat (Trừ 20 Trust Score)
      if (liar_id) {
        await tx.user.update({
          where: { id: liar_id },
          data: {
            trust_score: { decrement: 20 }
          }
        });
      }

      return updatedMatch;
    });

    return NextResponse.json(
      { message: 'Đã phân xử thành công! Trận đấu đã khép lại.', data: result },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Lỗi Resolve Dispute:", error);
    return NextResponse.json(
      { error: error.message || 'Lỗi hệ thống khi phân xử' },
      { status: 400 }
    );
  }
}