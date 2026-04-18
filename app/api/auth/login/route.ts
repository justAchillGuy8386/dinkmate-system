import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, password } = body;

    // Tìm người dùng trong Database theo số điện thoại
    const user = await prisma.user.findFirst({
      where: { phone: phone }
    });

    // So sánh mật khẩu (Thực tế sẽ dùng bcrypt để giải mã băm, ở đây so sánh chuỗi trực tiếp)
    if (!user || user.password_hash !== password) {
      return NextResponse.json({ error: 'Sai số điện thoại hoặc mật khẩu!' }, { status: 401 });
    }

    // Tách bỏ password_hash ra khỏi object trước khi gửi về điện thoại
    const { password_hash, ...userData } = user;

    return NextResponse.json({ message: 'Đăng nhập thành công', data: userData }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 });
  }
}