import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Cập nhật lại đường dẫn cho đúng nếu cần

// 1. NGƯỜI CHƠI GỬI KHIẾU NẠI (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Chấp nhận cả user_id (từ Flutter gửi lên) hoặc reporter_id
    const reporterId = body.user_id || body.reporter_id;
    const { match_id, reason, proof_image_url } = body;

    // Dùng Transaction để đảm bảo tính toàn vẹn
    const result = await prisma.$transaction(async (tx) => {
      
      const match = await tx.match.findUnique({
        where: { id: match_id }
      });

      if (!match) throw new Error("Không tìm thấy trận đấu!");

      // 1. Tìm xem người NÀY đã nộp bằng chứng chưa
      const existingDispute = await tx.dispute.findFirst({
        where: {
          match_id: match_id,
          reporter_id: reporterId,
        }
      });

      let disputeRecord;

      if (existingDispute) {
        // Đã có -> Bổ sung thêm ảnh và lý do
        disputeRecord = await tx.dispute.update({
          where: { id: existingDispute.id },
          data: {
            reason: `${existingDispute.reason} | App bổ sung: ${reason}`,
            proof_image_url: proof_image_url || existingDispute.proof_image_url,
            status: "Pending" 
          }
        });
      } else {
        // Chưa có -> Tạo mới hoàn toàn đúng chuẩn Prisma strict
        disputeRecord = await tx.dispute.create({
          data: {
            match: { connect: { id: match_id } },
            reporter: { connect: { id: reporterId } },
            created_by: reporterId,
            reason: reason,
            proof_image_url: proof_image_url,
            status: "Pending"
          }
        });
      }

      // 2. Chốt khóa trạng thái trận đấu thành "Disputed" (nếu nó chưa bị khóa)
      if (match.status !== "Disputed") {
        await tx.match.update({
          where: { id: match_id },
          data: { status: "Disputed" }
        });
      }

      return disputeRecord;
    });

    return NextResponse.json(
      { message: 'Gửi khiếu nại thành công! Hệ thống đã ghi nhận và chờ Admin xử lý.', data: result },
      { status: 200 }
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
      where: { status: "Pending" }, 
      // ĐÃ TẠM XÓA `orderBy: { created_at: 'desc' }` VÌ BẢNG DISPUTE CHƯA CÓ CỘT NÀY
      include: {
        reporter: { select: { full_name: true, phone: true } }, 
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