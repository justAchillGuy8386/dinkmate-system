import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Kéo danh sách người chơi từ Database, sắp xếp theo ELO giảm dần
    const topPlayers = await prisma.user.findMany({
      where: {
        // Tùy chọn: lọc những người đã hoàn thành định hạng
        // is_provisional: false
      },
      orderBy: {
        elo_rating: 'desc', // Sắp xếp giảm dần (cao nhất đứng đầu)
      },
      take: 50, // Lấy top 50 người chơi
      select: {
        id: true,
        full_name: true,
        elo_rating: true,
        avatar_url: true,
      }
    });

    return NextResponse.json({
      message: 'Lấy bảng xếp hạng thành công',
      data: topPlayers
    }, { status: 200 });

  } catch (error) {
    console.error("Lỗi khi lấy Bảng xếp hạng:", error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}