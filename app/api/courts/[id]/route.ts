import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const courtId = resolvedParams.id;

    const court = await prisma.court.findUnique({
      where: { id: courtId },
    });

    if (!court) {
      return NextResponse.json(
        { error: 'Không tìm thấy sân đấu!' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Lấy thông tin sân thành công!', data: court },
      { status: 200 }
    );
  } catch (error) {
    console.error('Lỗi lấy chi tiết sân:', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}
