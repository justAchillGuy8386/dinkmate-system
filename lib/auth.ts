import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'dinkmate_super_secret_jwt_key_2026';

export interface TokenPayload {
  userId: string;
  phone: string;
}

/**
 * Sinh chuỗi JWT Token có thời hạn 7 ngày
 */
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Xác thực chuỗi JWT Token và giải mã payload
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Băm mật khẩu bằng bcryptjs với salt rounds = 10
 */
export function hashPassword(plainText: string): string {
  return bcrypt.hashSync(plainText, 10);
}

/**
 * So sánh mật khẩu (Hỗ trợ cả bcrypt hash lẫn plain text của user cũ tạo trước đó)
 */
export function comparePassword(plainText: string, hashedOrPlain: string): boolean {
  if (hashedOrPlain.startsWith('$2a$') || hashedOrPlain.startsWith('$2b$')) {
    return bcrypt.compareSync(plainText, hashedOrPlain);
  }
  return plainText === hashedOrPlain;
}

/**
 * Trích xuất người dùng từ Authorization header (Bearer token)
 * Nếu không có token, trả về null hoặc fallback userId được truyền vào
 */
export function getAuthenticatedUser(request: Request): TokenPayload | null {
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7).trim();
  return verifyToken(token);
}
