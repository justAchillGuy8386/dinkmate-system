import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// 1. TẠO KÈO ĐẤU MỚI (POST)
export async function POST(request: Request) {
  try {
    const authUser = getAuthenticatedUser(request);
    const body = await request.json();
    const { creator_id: bodyCreatorId, court_id, scheduled_time, is_ranked } = body;

    // Ưu tiên dùng userId từ JWT token xác thực để chống mạo danh
    const creator_id = authUser ? authUser.userId : bodyCreatorId;

    if (!creator_id) {
      return NextResponse.json({ error: 'Yêu cầu không hợp lệ hoặc chưa đăng nhập' }, { status: 401 });
    }

    // Kiểm tra người chơi và điểm uy tín (Trust Score)
    const user = await prisma.user.findUnique({
      where: { id: creator_id },
      select: { id: true, trust_score: true, full_name: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'Không tìm thấy thông tin người chơi' }, { status: 404 });
    }

    const booleanRanked = is_ranked === undefined ? true : (is_ranked === true || is_ranked === 'true');

    // Chặn người chơi có Trust Score < 60 tham gia Đấu Hạng (Ranked)
    if (booleanRanked && user.trust_score < 60) {
      return NextResponse.json({
        error: `Điểm uy tín của bạn là ${user.trust_score}/100 (dưới 60 điểm). Bạn bị cấm tham gia Đấu Hạng do có hành vi vi phạm trước đó! Hãy tạo/tham gia các trận giao lưu để phục hồi điểm uy tín.`,
        trust_score: user.trust_score
      }, { status: 403 });
    }

    // Tính toán thời gian hết hạn của kèo
    const matchTime = scheduled_time ? new Date(scheduled_time) : new Date();
    const expiresTime = new Date(matchTime.getTime() + 30 * 60000); // Hết hạn sau 30 phút

    const newRequest = await prisma.matchRequest.create({
      data: {
        creator_id,
        court_id,
        scheduled_time: matchTime,
        is_ranked: booleanRanked,
        expires_at: expiresTime,
        status: booleanRanked ? "Searching" : "Open",
      },
    });

    return NextResponse.json(
      { message: 'Tạo kèo đấu thành công!', data: newRequest },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi tạo kèo:", error);
    return NextResponse.json(
      { error: 'Lỗi hệ thống khi tạo kèo đấu' },
      { status: 500 }
    );
  }
}

// 2. LẤY DANH SÁCH KÈO ĐANG MỞ (GET)
export async function GET() {
  try {
    const openRequests = await prisma.matchRequest.findMany({
      where: {
        status: "Open",
        expires_at: {
          gt: new Date(),
        }
      },
      orderBy: {
        scheduled_time: 'asc',
      },
      include: {
        creator: {
          select: { full_name: true, elo_rating: true, avatar_url: true, trust_score: true }
        },
        court: {
          select: { name: true, address: true, latitude: true, longitude: true }
        }
      }
    });

    return NextResponse.json(
      { message: 'Lấy danh sách bảng tin thành công!', data: openRequests },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi lấy danh sách kèo:", error);
    return NextResponse.json(
      { error: 'Lỗi hệ thống khi tải bảng tin' },
      { status: 500 }
    );
  }
}
