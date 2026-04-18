import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const userId = resolvedParams.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        elo_rating: true,
        total_matches: true,
        wins: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Không tìm thấy người dùng' }, { status: 404 });
    }

    const winRate = user.total_matches > 0 
      ? Math.round((user.wins / user.total_matches) * 100) 
      : 0;

    return NextResponse.json({
      elo: user.elo_rating,
      total_matches: user.total_matches,
      wins: user.wins,
      win_rate: winRate
    }, { status: 200 });

  } catch (error) {
    console.error("Lỗi lấy thống kê User:", error);
    return NextResponse.json({ error: 'Lỗi hệ thống khi lấy dữ liệu' }, { status: 500 });
  }
}