import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, request_id } = body;

    if (!user_id && !request_id) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp user_id hoặc request_id!' },
        { status: 400 }
      );
    }

    // Tìm request phù hợp để hủy
    let targetRequest = null;
    if (request_id) {
      targetRequest = await prisma.matchRequest.findUnique({
        where: { id: request_id },
      });
    } else if (user_id) {
      // Tìm request đang tìm kiếm (Searching) hoặc đang mở (Open) của user này
      targetRequest = await prisma.matchRequest.findFirst({
        where: {
          creator_id: user_id,
          status: { in: ['Searching', 'Open'] },
        },
        orderBy: { created_at: 'desc' },
      });
    }

    if (!targetRequest) {
      return NextResponse.json(
        { message: 'Không tìm thấy yêu cầu ghép trận nào đang chờ hủy.' },
        { status: 200 }
      );
    }

    if (targetRequest.status === 'Matched') {
      return NextResponse.json(
        { error: 'Kèo đã được ghép cặp thành công, không thể hủy yêu cầu!' },
        { status: 400 }
      );
    }

    const updated = await prisma.matchRequest.update({
      where: { id: targetRequest.id },
      data: { status: 'Cancelled' },
    });

    return NextResponse.json(
      { message: 'Đã hủy yêu cầu ghép trận thành công!', data: updated },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Lỗi khi hủy yêu cầu ghép trận:', error);
    return NextResponse.json(
      { error: error.message || 'Lỗi hệ thống' },
      { status: 500 }
    );
  }
}
