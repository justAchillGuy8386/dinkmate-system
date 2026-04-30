import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; 

export async function POST(request: Request) {
  try {
    // Lấy danh sách người chơi đang chờ tìm trận Xếp Hạng
    const openRequests = await prisma.matchRequest.findMany({
      where: { 
        status: 'Open', 
        is_ranked: true 
      },
      include: { 
        creator: true // Phải include để lấy được ELO của người tạo
      },
    });

    // Nếu có ít hơn 2 người thì không làm gì
    if (openRequests.length < 2) {
      return NextResponse.json({ 
        message: 'Chưa đủ người chơi trong hàng đợi, tiếp tục chờ...' 
      }, { status: 200 });
    }

    // Chuẩn bị dữ liệu đúng chuẩn Pydantic để gửi sang Python
    // Lọc trùng lặp (phòng trường hợp 1 người bấm tạo 2 request)
    const uniquePlayers = new Map();
    openRequests.forEach(req => {
      if (!uniquePlayers.has(req.creator_id)) {
        uniquePlayers.set(req.creator_id, {
          id: req.creator.id,
          elo_rating: req.creator.elo_rating
        });
      }
    });

    const availablePlayers = Array.from(uniquePlayers.values());

    if (availablePlayers.length < 2) {
       return NextResponse.json({ message: 'Chưa đủ người chơi hợp lệ' }, { status: 200 });
    }

    console.log(`Đang gửi ${availablePlayers.length} người chơi sang AI Python...`);

    //  GỌI API SANG MÁY CHỦ PYTHON AI (MICROSERVICE)
    const aiResponse = await fetch('http://127.0.0.1:8000/api/matchmake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ available_players: availablePlayers }),
    });

    const aiData = await aiResponse.json();

    if (aiData.status !== 'success') {
      return NextResponse.json({ error: aiData.message }, { status: 400 });
    }

    // Bóc tách kết quả AI nhả về
    const { player_a_id, player_b_id, ai_confidence_score } = aiData.data;

    // có thể nhúng đoạn code check Match Limit 24h vào ngay khúc này sau này)

    // LƯU KẾT QUẢ VÀO DATABASE BẰNG PRISMA
    // Tìm lại Request gốc của người A để làm mỏ neo tạo Match
    const requestA = openRequests.find(r => r.creator_id === player_a_id);
    const requestB = openRequests.find(r => r.creator_id === player_b_id);

    if (!requestA || !requestB) throw new Error("Mất dữ liệu request gốc");

    // Dùng Transaction để đảm bảo Tạo Match và Đóng Request diễn ra đồng thời
    const [newMatch, _] = await prisma.$transaction([
      // Tạo trận đấu mới
      prisma.match.create({
        data: {
          request_id: requestA.id, 
          player_a_id: player_a_id,
          player_b_id: player_b_id,
          status: 'Pending', // Đang chờ 2 người ra sân check-in
        }
      }),
      // Cập nhật trạng thái Request của 2 người này thành 'Matched' để lần quét sau AI không gọi tên nữa
      prisma.matchRequest.updateMany({
        where: { id: { in: [requestA.id, requestB.id] } },
        data: { status: 'Matched' }
      })
    ]);

    return NextResponse.json({
      message: 'AI đã chốt kèo và tạo trận đấu thành công!',
      match_id: newMatch.id,
      confidence: ai_confidence_score,
      players: `${player_a_id} vs ${player_b_id}`
    }, { status: 200 });

  } catch (error) {
    console.error("Lỗi luồng Matchmaking:", error);
    return NextResponse.json({ error: 'Lỗi hệ thống khi gọi AI' }, { status: 500 });
  }
}