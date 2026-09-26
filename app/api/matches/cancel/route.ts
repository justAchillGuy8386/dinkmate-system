import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { match_id, user_id, reason } = body;

    if (!match_id || !user_id) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp match_id và user_id!' },
        { status: 400 }
      );
    }

    const match = await prisma.match.findUnique({
      where: { id: match_id },
      include: {
        player_a: { select: { id: true, full_name: true, trust_score: true } },
        player_b: { select: { id: true, full_name: true, trust_score: true } },
      },
    });

    if (!match) {
      return NextResponse.json(
        { error: 'Không tìm thấy trận đấu!' },
        { status: 404 }
      );
    }

    const isPlayerA = match.player_a_id === user_id;
    const isPlayerB = match.player_b_id === user_id;

    if (!isPlayerA && !isPlayerB) {
      return NextResponse.json(
        { error: 'Bạn không phải là người chơi trong trận đấu này!' },
        { status: 403 }
      );
    }

    if (match.status !== 'Pending') {
      return NextResponse.json(
        {
          error:
            'Chỉ có thể hủy trận đấu ở trạng thái Sắp diễn ra (Pending) trước khi cả hai bên bắt đầu thi đấu!',
        },
        { status: 400 }
      );
    }

    // Kiểm tra xem ai đã check-in, ai vắng mặt (No-show)
    const myCheckIn = isPlayerA ? match.check_in_time_a : match.check_in_time_b;
    const opponentCheckIn = isPlayerA ? match.check_in_time_b : match.check_in_time_a;
    const opponentId = isPlayerA ? match.player_b_id : match.player_a_id;
    const opponentName = isPlayerA ? match.player_b.full_name : match.player_a.full_name;

    // Nếu người bấm hủy ĐÃ check-in ở sân, nhưng đối thủ KHÔNG check-in -> Đối thủ phạm lỗi No-show
    const isOpponentNoShow = myCheckIn != null && opponentCheckIn == null;

    const result = await prisma.$transaction(async (tx) => {
      // 1. Chuyển trạng thái trận đấu sang Cancelled
      const cancelledMatch = await tx.match.update({
        where: { id: match_id },
        data: {
          status: 'Cancelled',
        },
      });

      // 2. Nếu đối thủ bùng kèo không ra sân: Phạt trừ 10 điểm uy tín (trust_score)
      let penaltyMessage = '';
      if (isOpponentNoShow) {
        await tx.user.update({
          where: { id: opponentId },
          data: {
            trust_score: { decrement: 10 },
          },
        });
        penaltyMessage = `Đối thủ (${opponentName}) vắng mặt đã bị trừ 10 điểm uy tín (Trust Score).`;
      }

      return {
        match: cancelledMatch,
        penaltyMessage,
      };
    });

    return NextResponse.json(
      {
        message: result.penaltyMessage
          ? `Đã hủy trận đấu! ${result.penaltyMessage}`
          : 'Đã hủy trận đấu thành công!',
        data: result.match,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Lỗi khi hủy trận đấu:', error);
    return NextResponse.json(
      { error: error.message || 'Lỗi hệ thống' },
      { status: 500 }
    );
  }
}
