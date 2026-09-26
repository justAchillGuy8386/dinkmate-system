# ⚡ DinkMate System - Backend & Web Portal

> **DinkMate System** là phân hệ máy chủ trung tâm và cổng thông tin web được xây dựng trên nền tảng **Next.js 16 (App Router)**, **TypeScript**, **Prisma ORM 6** và cơ sở dữ liệu đám mây **PostgreSQL (Supabase)**.

---

## 🚀 1. Tính Năng Chính (Core Features)

1. **Bảo Mật Xác Thực Chuẩn Công Nghiệp**:
   - Mã hóa mật khẩu bằng **Bcrypt** (Salt rounds = 10), tương thích ngược và tự động nâng cấp hash cho tài khoản cũ.
   - Định danh phiên làm việc bằng **JSON Web Token (JWT)** có thời hạn 7 ngày.
   - Chống mạo danh (Anti-Impersonation) qua HTTP Header `Authorization: Bearer <token>`.
2. **Hệ Thống Quản Lý Sân Đấu (Courts Network)**:
   - Tra cứu danh sách cụm sân kèm tính khoảng cách đường chim bay **Haversine GPS** (`lat`, `lng`).
   - Tự động sinh mã QR định danh duy nhất cho mỗi cụm sân (`qr_code_value`).
3. **Cơ Chế Khớp Kèo Thông Minh (AI Matchmaking Bridge)**:
   - Tự động quét và dọn dẹp các kèo quá hạn (`expires_at`).
   - Tổng hợp danh sách người chơi trong hàng đợi xếp hạng (`Searching`), tích hợp toạ độ sân gửi sang **DinkMate AI Microservice**.
4. **Vòng Đời Trận Đấu & Chống Gian Lận (Fairplay Engine)**:
   - Check-in thực địa tại sân qua mã QR camera.
   - Nộp điểm đối soát 2 chiều (Double-blind score submission).
   - Tự động tính thời lượng trận đấu thực tế dựa trên mốc thời gian check-in.
   - Tự động kích hoạt hồ sơ tranh chấp (`Disputed`) khi có bất đồng điểm số.
5. **Cơ Chế Điểm Uy Tín (Trust Score)**:
   - Phạt trừ **10 điểm** nếu bùng kèo (No-show); trừ **20 điểm** nếu khai báo điểm gian lận.
   - Chặn người chơi có **Trust Score < 60** tham gia tạo hoặc nhận kèo Đấu Hạng (Ranked).
6. **Public Web Portal (Giao diện Sáng & Thân thiện)**:
   - Bảng xếp hạng ELO toàn quốc, tra cứu hồ sơ cá nhân và lịch sử đấu ngay trên trình duyệt mà không cần cài app.

---

## 📁 2. Cấu Trúc Thư Mục (Directory Structure)

```
dinkmate-system/
├── app/
│   ├── admin/
│   │   └── disputes/              # Trang Quản trị viên phân xử khiếu nại (Admin Portal)
│   ├── api/
│   │   ├── ai-matchmake/          # API kích hoạt quét & gọi AI ghép kèo
│   │   ├── auth/login/            # API Đăng nhập & sinh JWT Token
│   │   ├── courts/                # API Quản lý cụm sân (GET danh sách, POST tạo sân)
│   │   │   └── [id]/              # API Chi tiết cụm sân
│   │   ├── disputes/              # API Danh sách khiếu nại
│   │   │   └── resolve/           # API Phân xử khiếu nại & phạt điểm uy tín
│   │   ├── match-requests/        # API Tạo & lấy danh sách kèo đang mở
│   │   │   ├── cancel/            # API Hủy yêu cầu tìm kiếm
│   │   │   └── check-status/      # API Kiểm tra trạng thái ghép kèo
│   │   ├── matches/               # API Trận đấu
│   │   │   ├── accept/            # API Nhận kèo giao lưu
│   │   │   ├── cancel/            # API Hủy trận & phạt vắng mặt No-show
│   │   │   ├── check-in/          # API Quét mã QR check-in tại sân
│   │   │   ├── my-matches/        # API Lịch sử trận đấu của người chơi
│   │   │   └── submit-score/      # API Nộp điểm & gọi AI tính biến động ELO
│   │   └── users/                 # API Đăng ký & danh sách người chơi
│   │       ├── leaderboard/       # API Bảng xếp hạng ELO
│   │       └── [id]/stats/        # API Thống kê chỉ số cá nhân
│   ├── components/
│   │   └── PortalClient.tsx       # Giao diện Web Portal thân thiện (Light Theme)
│   ├── globals.css                # Cấu hình Tailwind CSS v4 & Google Font Be Vietnam Pro
│   ├── layout.tsx                 # Root layout & SEO Metadata
│   └── page.tsx                   # Server Component tải dữ liệu SSR cho Web Portal
├── lib/
│   ├── auth.ts                    # Thư viện tiện ích Bcrypt, JWT & Bearer Auth
│   └── prisma.ts                  # Khởi tạo Prisma Client Singleton
├── prisma/
│   └── schema.prisma              # Định nghĩa mô hình dữ liệu PostgreSQL
├── .env                           # Biến môi trường kết nối DB & JWT
└── package.json
```

---

## 📡 3. Danh Sách REST API Endpoints

### 🔐 A. Xác Thực & Người Dùng (`/api/auth`, `/api/users`)
- `POST /api/auth/login`: Đăng nhập bằng SĐT & Mật khẩu. Trả về JWT Token + thông tin người dùng.
- `POST /api/users`: Đăng ký tài khoản mới (tự động mã hóa Bcrypt).
- `GET /api/users`: Danh sách người chơi.
- `GET /api/users/leaderboard`: Bảng xếp hạng ELO người chơi toàn quốc.
- `GET /api/users/[id]/stats`: Thống kê tỷ lệ thắng, ELO, tổng trận của 1 người chơi.

### 🏟️ B. Cụm Sân Thi Đấu (`/api/courts`)
- `GET /api/courts?lat={lat}&lng={lng}&radius={km}`: Lấy danh sách sân, tự động tính khoảng cách Haversine và sắp xếp sân gần nhất lên đầu.
- `POST /api/courts`: Tạo sân mới (tự động sinh mã QR nếu không truyền).
- `GET /api/courts/[id]`: Xem thông tin chi tiết một sân.

### 🎯 C. Kèo Đấu (`/api/match-requests`)
- `POST /api/match-requests`: Tạo kèo mới (Giao lưu hoặc Đấu Hạng). *Chặn nếu Trust Score < 60*.
- `GET /api/match-requests`: Lấy danh sách kèo giao lưu đang mở (`Open`).
- `POST /api/match-requests/cancel`: Hủy kèo đang tìm kiếm.

### ⚔️ D. Trận Đấu (`/api/matches`)
- `POST /api/matches/accept`: Nhận kèo giao lưu của người khác. *Chặn nếu Trust Score < 60*.
- `POST /api/matches/check-in`: Quét mã QR tại sân. Khi cả 2 quét thành công $\rightarrow$ Chuyển `In_Progress`.
- `POST /api/matches/submit-score`: Nộp tỷ số trận đấu. Khi 2 bên khớp điểm $\rightarrow$ Gọi AI tính ELO.
- `POST /api/matches/cancel`: Hủy trận đấu trạng thái `Pending`. Tự động phạt trừ 10 điểm uy tín nếu đối thủ không có mặt.
- `GET /api/matches/my-matches?userId={id}`: Lấy danh sách trận đấu của một người chơi.

### 🛡️ E. Phân Xử Khiếu Nại (`/api/disputes`)
- `GET /api/disputes`: Lấy danh sách hồ sơ khiếu nại (sắp xếp theo `created_at: 'desc'`).
- `POST /api/disputes/resolve`: Admin chốt kết quả chung cuộc, cập nhật ELO và phạt trừ 20 điểm uy tín người gian lận.

### 🤖 F. Ghép Kèo AI (`/api/ai-matchmake`)
- `POST /api/ai-matchmake`: Kích hoạt vòng quét AI ghép cặp các yêu cầu tìm trận xếp hạng dựa trên ELO và GPS.

---

## 💻 4. Hướng Dẫn Cài Đặt & Khởi Chạy

```bash
# 1. Cài đặt các gói phụ thuộc
npm install

# 2. Đồng bộ Schema Prisma với Supabase PostgreSQL
npx prisma db push

# 3. Khởi chạy Server ở chế độ Development (Port 3000)
npm run dev

# 4. (Tùy chọn) Mở giao diện xem Database trực quan
npx prisma studio
```

---

## ⚙️ 5. Cấu Hình Biến Môi Trường (`.env`)

```env
# Kết nối PostgreSQL Supabase (qua pgBouncer Pooler)
DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Kết nối trực tiếp để chạy lệnh Prisma db push
DIRECT_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# JWT Secret Key
JWT_SECRET="dinkmate_super_secret_jwt_key_2026"
```
