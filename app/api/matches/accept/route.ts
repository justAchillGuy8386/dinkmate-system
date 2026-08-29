import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { request_id, acceptor_id } = body;

    if (!request_id || !acceptor_id) {
      return NextResponse.json({ error: 'Thiếu thông tin request_id hoặc acceptor_id' }, { status: 400 });
    }

    const matchRequest = await prisma.matchRequest.findUnique({
      where: { id: request_id },
      include: { creator: true }
    });

    if (!matchRequest) {
      return NextResponse.json({ error: 'Không tìm thấy trận đấu này!' }, { status: 404 });
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