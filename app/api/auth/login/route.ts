import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePassword, hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, password } = body;

    if (!phone || !password) {
      return NextResponse.json({ error: 'Vui lòng nhập số điện thoại và mật khẩu' }, { status: 400 });
    }

    // Tìm người dùng trong Database theo số điện thoại
    const user = await prisma.user.findFirst({
      where: { phone: phone }
    });

    if (!user) {
      return NextResponse.json({ error: 'Sai số điện thoại hoặc mật khẩu!' }, { status: 401 });
    }

    // So sánh mật khẩu bằng Bcrypt (tương thích cả hash lẫn plain text cũ)
    const isPasswordValid = comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Sai số điện thoại hoặc mật khẩu!' }, { status: 401 });
    }

    // Nếu mật khẩu trong DB chưa được băm bằng bcrypt, tự động nâng cấp mã hóa
    if (!user.password_hash.startsWith('$2a$') && !user.password_hash.startsWith('$2b$')) {
      const newHash = hashPassword(password);
      await prisma.user.update({
        where: { id: user.id },
        data: { password_hash: newHash }
      });
      console.log(`[AUTH] Đã tự động nâng cấp mật khẩu của user ${user.phone} sang Bcrypt hash`);
    }

    // Sinh JWT Token định danh an toàn
    const token = generateToken({
      userId: user.id,
      phone: user.phone,
    });

    // Tách bỏ password_hash ra khỏi object trước khi gửi về client
    const { password_hash, ...userData } = user;

    return NextResponse.json({
      message: 'Đăng nhập thành công',
      token: token,
      data: userData
    }, { status: 200 });

  } catch (error) {
    console.error("Lỗi Login API:", error);
    return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 });
  }
}
