import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 1. NGƯỜI CHƠI GỬI KHIẾU NẠI (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { match_id, reporter_id, reason, proof_image_url } = body;

    // Dùng Transaction để đảm bảo vừa tạo đơn, vừa khóa trận đấu cùng lúc
    const result = await prisma.$transaction(async (tx) => {
      
      // Kiểm tra xem trận đấu có tồn tại không
      const match = await tx.match.findUnique({
        where: { id: match_id }
      });

      if (!match) throw new Error("Không tìm thấy trận đấu!");
      if (match.status === "Disputed") throw new Error("Trận đấu này đang được xử lý khiếu nại rồi!");

      // Tạo tranh chấp trong bảng Dispute
      const newDispute = await tx.dispute.create({
        data: {
          match_id,
          reporter_id,
          reason,
          proof_image_url,
          status: "Pending" // Trạng thái: Chờ Admin xử lý
        }
      });

      // Khóa trạng thái trận đấu thành "Disputed"
      await tx.match.update({
        where: { id: match_id },
        data: { status: "Disputed" }
      });

      return newDispute;
    });

    return NextResponse.json(
      { message: 'Gửi khiếu nại thành công! Hệ thống đã ghi nhận và chờ Admin xử lý.', data: result },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Lỗi tạo Dispute:", error);
    return NextResponse.json(
      { error: error.message || 'Lỗi hệ thống khi gửi khiếu nại' },
      { status: 400 }
    );
  }
}

// 2. ADMIN LẤY DANH SÁCH KHIẾU NẠI ĐỂ XỬ LÝ (GET)
export async function GET() {
  try {
    const disputes = await prisma.dispute.findMany({
      where: { status: "Pending" }, // Chỉ lấy những ca chưa xử lý
      orderBy: { created_at: 'desc' },
      include: {
        reporter: { select: { full_name: true, phone: true } }, // Lấy tên và SĐT người kiện để Admin gọi điện
        match: {
          include: {
            player_a: { select: { full_name: true } },
            player_b: { select: { full_name: true } }
          }
        }
      }
    });

    return NextResponse.json(
      { message: 'Lấy danh sách khiếu nại thành công!', data: disputes },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi lấy danh sách Dispute:", error);
    return NextResponse.json(
      { error: 'Lỗi hệ thống' },
      { status: 500 }
    );
  }
}