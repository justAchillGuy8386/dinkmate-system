import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 1. TẠO KÈO ĐẤU MỚI (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { creator_id, court_id, scheduled_time, is_ranked } = body;

    // Tính toán thời gian hết hạn của kèo 
    const matchTime = new Date(scheduled_time);
    const expiresTime = new Date(matchTime.getTime() + 30 * 60000); // Cộng thêm 30 phút

    const newRequest = await prisma.matchRequest.create({
      data: {
        creator_id,
        court_id,
        scheduled_time: matchTime,
        is_ranked: is_ranked ?? true,
        expires_at: expiresTime,
        status: "Open", // Mặc định mở
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
        status: "Open", // Chỉ lấy những kèo chưa có ai nhận
        expires_at: {
          gt: new Date(), // Chỉ lấy những kèo chưa hết hạn (thời gian hết hạn > hiện tại)
        }
      },
      orderBy: {
        scheduled_time: 'asc', // Sắp xếp kèo nào đánh sớm nhất lên đầu
      },
      // JOIN DỮ LIỆU
      include: {
        creator: {
          select: { full_name: true, elo_rating: true, avatar_url: true }
        },
        court: {
          select: { name: true, address: true }
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