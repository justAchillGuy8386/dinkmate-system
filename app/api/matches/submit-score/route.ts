import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { match_id, user_id, winner_id, scores_data, intensity_feedback } = body;

    // Lấy thông tin trận đấu
    const match = await prisma.match.findUnique({
      where: { id: match_id },
      include: { player_a: true, player_b: true }
    });

    if (!match) throw new Error("Không tìm thấy trận đấu!");
    if (match.status !== "In_Progress" && match.status !== "Waiting_For_Opponent") {
       throw new Error("Trận đấu đang ở trạng thái không thể nhận điểm!");
    }

    const isPlayerA = match.player_a_id === user_id;
    const isPlayerB = match.player_b_id === user_id;

    if (!isPlayerA && !isPlayerB) {
      return NextResponse.json({ error: 'Bạn không có quyền can thiệp trận này' }, { status: 403 });
    }

    // KỊCH BẢN 1: CHƯA CÓ AI NHẬP ĐIỂM TRƯỚC ĐÓ
    if (!match.submitted_by_a && !match.submitted_by_b) {
      await prisma.match.update({
        where: { id: match_id },
        data: {
          scores_data: scores_data, // Tạm lưu kết quả của người đầu tiên
          submitted_by_a: isPlayerA,
          submitted_by_b: isPlayerB,
          status: "Waiting_For_Opponent" // Đổi trạng thái để biết đang chờ
        }
      });
      return NextResponse.json({ 
        message: 'Đã lưu điểm. Đang chờ đối thủ nộp điểm để đối chiếu!', 
        status: 'Waiting' 
      }, { status: 200 });
    }

    // KỊCH BẢN 2: ĐỐI THỦ ĐÃ NHẬP ĐIỂM -> SO SÁNH
    const isScoreMatched = (match.scores_data === scores_data);

    if (isScoreMatched) {
      // 🟢 ĐỒNG THUẬN -> GỌI AI VÀ KẾT THÚC TRẬN (Giữ nguyên logic cũ của bạn)
      const isPlayerA_Winner = match.player_a_id === winner_id;

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
      const newEloA = aiResult.new_elo_a;
      const newEloB = aiResult.new_elo_b;
      const eloChangeA = aiResult.elo_change_a;
      const eloChangeB = aiResult.elo_change_b;

      let intensityInt = 2;
      if (intensity_feedback === "Low") intensityInt = 1;
      if (intensity_feedback === "High") intensityInt = 3;

      const result = await prisma.$transaction(async (tx) => {
        const updatedMatch = await tx.match.update({
          where: { id: match_id },
          data: {
            status: "Completed",
            submitted_by_a: true,
            submitted_by_b: true,
            intensity_feedback: intensityInt,
            match_duration_minutes: 60, 
            elo_change_a: eloChangeA,
            elo_change_b: eloChangeB,
          }
        });

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

      return NextResponse.json({ 
        message: 'Điểm số khớp nhau! Trận đấu đã hoàn tất.', 
        data: result,
        status: 'Completed' 
      }, { status: 200 });

    } else {
      // 🔴 LỆCH ĐIỂM -> GÂY TRANH CHẤP
      await prisma.match.update({
        where: { id: match_id },
        data: {
          status: 'Disputed',
          submitted_by_a: true,
          submitted_by_b: true,
        }
      });

      await prisma.dispute.create({
        data: {
          // 1. Prisma đòi relation 'match', cho nó 'match'
          match: { connect: { id: match_id } },
          
          // 2. Prisma đòi relation 'reporter', cho nó 'reporter'
          reporter: { connect: { id: user_id } },
          
          // 3. Prisma CŨNG đòi cột vật lý 'created_by' (mà bạn vừa tạo lúc nãy)
          created_by: user_id, 
          
          reason: `Sai lệch điểm. Đối thủ báo: ${match.scores_data}. Bạn báo: ${scores_data}`,
          status: 'Open'
        }
      });

      return NextResponse.json({ 
        message: 'Điểm của bạn khác với đối thủ! Trận đấu đã bị tạm đình chỉ để Admin xử lý.', 
        status: 'Disputed' 
      }, { status: 200 });
    }

  } catch (error: any) {
    console.error("Lỗi Submit Score:", error);
    return NextResponse.json(
      { error: error.message || 'Lỗi hệ thống' },
      { status: 400 }
    );
  }
}