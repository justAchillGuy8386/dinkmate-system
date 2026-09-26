import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const authUser = getAuthenticatedUser(request);
    const body = await request.json();
    const { request_id, acceptor_id: bodyAcceptorId } = body;

    const acceptor_id = authUser ? authUser.userId : bodyAcceptorId;

    if (!request_id || !acceptor_id) {
      return NextResponse.json({ error: 'Thiếu thông tin request_id hoặc acceptor_id' }, { status: 400 });
    }

    const [matchRequest, acceptor] = await Promise.all([
      prisma.matchRequest.findUnique({
        where: { id: request_id },
        include: { creator: true }
      }),
      prisma.user.findUnique({
        where: { id: acceptor_id },
        select: { id: true, trust_score: true, full_name: true }
      })
    ]);

    if (!matchRequest) {
      return NextResponse.json({ error: 'Không tìm thấy kèo đấu này!' }, { status: 404 });
    }

    if (!acceptor) {
      return NextResponse.json({ error: 'Không tìm thấy thông tin người nhận kèo' }, { status: 404 });
    }

    // Chặn nếu người nhận kèo có trust_score < 60 khi nhận kèo ranked
    if (matchRequest.is_ranked && acceptor.trust_score < 60) {
      return NextResponse.json({
        error: `Điểm uy tín của bạn là ${acceptor.trust_score}/100. Bạn không đủ điều kiện nhận kèo Đấu Hạng.`
      }, { status: 403 });
    }

    if (matchRequest.status !== 'Open') {
      return NextResponse.json({ error: 'Trận đấu đã có người nhận hoặc đã bị hủy!' }, { status: 400 });
    }

    if (matchRequest.creator_id === acceptor_id) {
      return NextResponse.json({ error: 'Bạn không thể tự nhận trận đấu của chính mình!' }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const newMatch = await tx.match.create({
        data: {
          request_id: matchRequest.id,
          player_a_id: matchRequest.creator_id, 
          player_b_id: acceptor_id,            
          status: 'Pending',                     
        }
      });

      await tx.matchRequest.update({
        where: { id: matchRequest.id },
        data: { status: 'Matched' }
      });

      return newMatch;
    });

    return NextResponse.json({
      message: 'Nhận kèo thành công! Hãy chuẩn bị ra sân.',
      data: result
    }, { status: 200 });

  } catch (error: any) {
    console.error("Lỗi nhận kèo:", error);
    return NextResponse.json({ error: error.message || 'Lỗi hệ thống' }, { status: 500 });
  }
}
