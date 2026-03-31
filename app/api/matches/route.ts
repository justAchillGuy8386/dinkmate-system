import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { request_id, player_b_id } = body;

    // Dùng $transaction để đảm bảo tính toàn vẹn dữ liệu
    const result = await prisma.$transaction(async (tx) => {
      
      // Kiểm tra xem Kèo này có tồn tại và còn mở không?
      const matchReq = await tx.matchRequest.findUnique({
        where: { id: request_id }
      });

      if (!matchReq) {
        throw new Error("Không tìm thấy kèo đấu này!");
      }
      if (matchReq.status !== "Open") {
        throw new Error("Chậm chân rồi, kèo này đã có người nhận hoặc đã hủy!");
      }
      if (matchReq.creator_id === player_b_id) {
        throw new Error("Bạn không thể tự nhận kèo của chính mình!");
      }

      // Cập nhật trạng thái Kèo thành "Matched"
      await tx.matchRequest.update({
        where: { id: request_id },
        data: { status: "Matched" }
      });

      // Sinh ra Trận đấu chính thức
      const newMatch = await tx.match.create({
        data: {
          request_id: request_id,
          player_a_id: matchReq.creator_id,
          player_b_id: player_b_id,
          status: "Pending", // Trạng thái "Đang chờ đến sân Check-in"
        }
      });

      return newMatch;
    });

    return NextResponse.json(
      { message: 'Nhận kèo thành công! Hãy chuẩn bị ra sân.', data: result },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Lỗi nhận kèo:", error);
    return NextResponse.json(
      { error: error.message || 'Lỗi hệ thống khi nhận kèo' },
      { status: 400 } // Trả về lỗi 400 (Bad Request) nếu thao tác không hợp lệ
    );
  }
}