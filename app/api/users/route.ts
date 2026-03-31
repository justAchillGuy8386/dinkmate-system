import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Đường dẫn import file prisma.ts bạn vừa tạo

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, phone, password_hash, elo_rating } = body;

    // dùng Prisma ra lệnh cho Database tạo bản ghi mới
    const newUser = await prisma.user.create({
      data: {
        full_name,
        phone,
        password_hash, // bước này sẽ dùng thư viện bcrypt để mã hóa mật khẩu
        elo_rating: elo_rating || 1000, // Nếu không truyền elo, mặc định là 1000
        is_provisional: true, // Gắn mác "Đang định hạng"
      },
    });

    //Trả về kết quả thành công
    return NextResponse.json(
      { message: 'Tạo người chơi thành công!', data: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi API tạo user:", error);
    return NextResponse.json(
      { error: 'Lỗi hệ thống khi tạo người chơi' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Dùng Prisma để lấy danh sách người chơi
    const users = await prisma.user.findMany({
      // Chỉ lấy các trường cần thiết, không lấy password_hash ra ngoài
      select: {
        id: true,
        full_name: true,
        avatar_url: true,
        elo_rating: true,
        trust_score: true,
        total_matches: true,
        wins: true,
      },
      // SẮP XẾP: Lấy người có điểm ELO cao nhất lên đầu (Làm bảng xếp hạng)
      orderBy: {
        elo_rating: 'desc',
      },
    });

    // Trả dữ liệu về cho Client
    return NextResponse.json(
      { message: 'Lấy danh sách thành công!', data: users },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi API lấy danh sách user:", error);
    return NextResponse.json(
      { error: 'Lỗi hệ thống khi lấy dữ liệu' },
      { status: 500 }
    );
  }
}