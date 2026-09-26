import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, phone, password_hash, password, elo_rating } = body;

    const rawPassword = password || password_hash;
    if (!phone || !rawPassword) {
      return NextResponse.json({ error: 'Vui lòng cung cấp số điện thoại và mật khẩu' }, { status: 400 });
    }

    // Kiểm tra số điện thoại đã tồn tại chưa
    const existingUser = await prisma.user.findUnique({
      where: { phone: phone }
    });
    if (existingUser) {
      return NextResponse.json({ error: 'Số điện thoại này đã được đăng ký tài khoản' }, { status: 409 });
    }

    // Mã hóa mật khẩu bằng bcryptjs
    const secureHashedPassword = hashPassword(rawPassword);

    // Tạo bản ghi mới trong Database
    const newUser = await prisma.user.create({
      data: {
        full_name: full_name || 'Người chơi mới',
        phone,
        password_hash: secureHashedPassword,
        elo_rating: elo_rating || 1000,
        is_provisional: true, // Gán mác "Đang định hạng"
      },
    });

    // Sinh JWT Token để người dùng đăng nhập luôn
    const token = generateToken({
      userId: newUser.id,
      phone: newUser.phone,
    });

    const { password_hash: _, ...safeUser } = newUser;

    return NextResponse.json(
      { 
        message: 'Tạo tài khoản thành công!', 
        token: token,
        data: safeUser 
      },
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
    const users = await prisma.user.findMany({
      select: {
        id: true,
        full_name: true,
        avatar_url: true,
        elo_rating: true,
        trust_score: true,
        total_matches: true,
        wins: true,
      },
      orderBy: {
        elo_rating: 'desc',
      },
    });

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
