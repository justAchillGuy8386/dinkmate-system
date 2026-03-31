import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { match_id, player_id, scanned_qr_code } = body;

    // Tìm trận đấu và gộp thông tin Court để lấy mã QR chuẩn
    const match = await prisma.match.findUnique({
      where: { id: match_id },
      include: { request: { include: { court: true } } }
    });

    if (!match) throw new Error("Không tìm thấy trận đấu này!");
    if (match.status !== "Pending") throw new Error("Trận đấu không ở trạng thái chờ Check-in!");

    // SO SÁNH MÃ QR (Anti-cheat)
    const realQrCode = match.request.court.qr_code_value;
    if (scanned_qr_code !== realQrCode) {
      throw new Error("Mã QR không hợp lệ! Bạn đang ở sai sân hoặc quét nhầm mã.");
    }

    // Xác định ai đang Check-in và cập nhật giờ
    let updateData: any = {};
    if (player_id === match.player_a_id) {
      if (match.check_in_time_a) throw new Error("Bạn đã check-in rồi, hãy chờ đối thủ!");
      updateData.check_in_time_a = new Date();
    } else if (player_id === match.player_b_id) {
      if (match.check_in_time_b) throw new Error("Bạn đã check-in rồi, hãy chờ đối thủ!");
      updateData.check_in_time_b = new Date();
    } else {
      throw new Error("Bạn không thuộc trận đấu này!");
    }

    // KIỂM TRA ĐIỀU KIỆN KÍCH HOẠT TRẬN ĐẤU
    // Nếu người kia đã check-in từ trước, và bây giờ người này check-in nốt -> Đổi sang In_Progress
    const hasA_CheckedIn = (player_id === match.player_a_id) ? true : !!match.check_in_time_a;
    const hasB_CheckedIn = (player_id === match.player_b_id) ? true : !!match.check_in_time_b;

    if (hasA_CheckedIn && hasB_CheckedIn) {
      updateData.status = "In_Progress";
    }

    // Lưu vào Database
    const updatedMatch = await prisma.match.update({
      where: { id: match_id },
      data: updateData
    });

    return NextResponse.json(
      { 
        message: updateData.status === "In_Progress" 
          ? 'Cả 2 đã có mặt. Trận đấu chính thức bắt đầu!' 
          : 'Check-in thành công! Đang chờ đối thủ...', 
        data: updatedMatch 
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Lỗi Check-in:", error);
    return NextResponse.json(
      { error: error.message || 'Lỗi hệ thống' },
      { status: 400 }
    );
  }
}