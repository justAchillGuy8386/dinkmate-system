# ⚡ DinkMate System - Nền Tảng Backend & Web Portal Pickleball Thông Minh

> **DinkMate System** là phân hệ máy chủ trung tâm và cổng thông tin web chính thức trong hệ sinh thái **DinkMate** — nền tảng công nghệ thể thao (SportTech) số 1 dành cho cộng đồng người chơi **Pickleball tại Việt Nam**. 
> Hệ thống kết hợp giữa **Backend API Next.js 16**, **Cơ sở dữ liệu đám mây PostgreSQL (Supabase)**, **Cổng Web Portal mở** cùng sự liên kết chặt chẽ với **Mobile App (Flutter)** và **Bộ não Trí tuệ Nhân tạo (Python AI Microservice)**.

---

## 🌟 1. Giới Thiệu Sản Phẩm: DinkMate Giải Quyết Vấn Đề Gì?

Pickleball đang là bộ môn thể thao phát triển với tốc độ nhanh nhất thế giới và bùng nổ mạnh mẽ tại Việt Nam. Tuy nhiên, người chơi phong trào và bán chuyên hiện nay vẫn gặp phải những rào cản lớn:
- ❌ **Khó tìm bạn chơi cùng trình độ**: Người mới chơi dễ bị "ngợp" khi gặp đối thủ quá mạnh, trong khi người chơi lâu năm lại thiếu thử thách khi gặp người mới.
- ❌ **Thiếu hệ thống xếp hạng chuẩn mực**: Không có thước đo trình độ khách quan (như ELO, DUPR) để người chơi theo dõi sự tiến bộ của bản thân.
- ❌ **Vấn nạn "bùng kèo" (No-show) & Gian lận điểm số**: Việc hẹn kèo qua tin nhắn mạng xã hội thường xuyên bị hủy giờ chót, khai gian kết quả, gây mất thời gian và ức chế.
- ❌ **Khó khăn trong việc tìm sân gần**: Người chơi không biết sân nào quanh khu vực mình đang có kèo đấu đang mở.

💡 **DinkMate ra đời để giải quyết triệt để những vấn đề trên** thông qua mô hình O2O (Online-to-Offline): Kết nối cộng đồng trực tuyến nhưng bắt buộc xác thực thực địa tại sân thi đấu.

---

## 💎 2. Lợi Ích Cốt Lõi Của Hệ Thống

### 🏃 Đối Với Người Chơi (Vận Động Viên):
- **Ghép Kèo Nhanh Trong 30 Giây**: Chỉ cần chọn sân hoặc bật chế độ Đấu Hạng, hệ thống sẽ tự động ghép với đối thủ ở gần bạn nhất (bán kính $le 25	ext{km}$ hoặc cùng sân).
- **Trận Đấu Cân Sức**: Nhờ mô hình AI đo lường trình độ ELO, mỗi trận đấu đều kịch tính và vừa sức, giúp bạn tiến bộ nhanh chóng.
- **Không Lo Bị Bùng Kèo**: Cơ chế **Điểm Uy Tín (Trust Score)** tự động trừ 10 điểm người vắng mặt và cấm đấu hạng những ai có hành vi phi thể thao (Trust Score $< 60$).
- **Minh Bạch & Tự Hào Thành Tích**: Bảng xếp hạng ELO toàn quốc công khai, hồ sơ cá nhân lưu trữ toàn bộ lịch sử đấu và tỷ lệ thắng/thua.

### 🏟️ Đối Với Chủ Cụm Sân Pickleball:
- **Tăng Trưởng Lượt Đặt Sân Tự Nhiên**: Sân đấu được hiển thị trên bản đồ hệ thống, người chơi tự động đổ về sân để quét mã QR thi đấu.
- **Số Hóa Quy Trình Quản Lý**: Mỗi cụm sân được cấp mã QR định danh vật lý duy nhất, hỗ trợ quản lý lượt khách check-in minh bạch.
- **Quảng Bá Miễn Phí**: Cụm sân xuất hiện trên cả Web Portal và Mobile App của cộng đồng hàng nghìn người chơi.

### 🏆 Đối Với Cộng Đồng & Ban Tổ Chức:
- **Dữ Liệu Xếp Hạng Thực Tế**: Cung cấp nền tảng dữ liệu ELO chuẩn xác, khách quan để phục vụ việc chia bảng hạt giống trong các giải đấu phong trào.
- **Cơ Chế Phân Xử Minh Bạch**: Hệ thống khiếu nại (Dispute) bảo vệ tính công bằng, loại bỏ các hành vi gian lận điểm số.

---

## 🧩 3. Kiến Trúc 3 Phân Hệ & Cách Chúng Bổ Trợ Nhau

Hệ thống DinkMate hoạt động mượt mà nhờ sự phối hợp nhịp nhàng giữa **Backend**, **Frontend** và **AI Engine**:

```mermaid
flowchart TB
    subgraph Frontend_Group ["📱 TẦNG GIAO DIỆN (Frontend Layer)"]
        MobileApp["📱 DinkMate Mobile App (Flutter)\n• Người bạn đồng hành ra sân thực tế\n• Radar AI quét tìm đối thủ xung quanh\n• Camera quét mã QR check-in tại sân\n• Nộp điểm đối soát 2 chiều bảo mật"]
        WebPortal["💻 DinkMate Web Portal (Next.js 16)\n• Cổng thông tin sáng sủa, thân thiện\n• Bảng xếp hạng ELO thời gian thực\n• Tra cứu hồ sơ & lịch sử đấu mọi lúc\n• Hướng dẫn & Tải ứng dụng Mobile"]
    end

    subgraph Backend_Group ["⚡ TẦNG ĐIỀU PHỐI TRUNG TÂM (Backend Layer - Phân hệ này)"]
        CoreAPI["⚡ DinkMate Core System (Next.js App Router)\n• Xác thực bảo mật Bcrypt + JWT Token (7 ngày)\n• Quản lý vòng đời trận: Pending -> In_Progress -> Completed\n• Quản lý Điểm Uy Tín (Trust Score) & Chặn bùng kèo\n• Cổng Admin phân xử khiếu nại (Disputes Resolution)\n• Tương tác DB qua Prisma ORM 6"]
        SupabaseDB[("🐘 Cơ Sở Dữ Liệu PostgreSQL (Supabase)\n• Lưu trữ Users, Courts, MatchRequests, Matches, Disputes")]
    end

    subgraph AI_Group ["🤖 TẦNG TRÍ TUỆ NHÂN TẠO (AI Microservice Layer)"]
        AIEngine["🤖 DinkMate AI Engine (Python FastAPI)\n• Mô hình Học Tăng Cường SAC (Stable-Baselines3)\n• Tính khoảng cách GPS Haversine (bán kính <= 25km)\n• Ưu tiên tối đa cùng sân đấu (Distance = 0km)\n• Hiệu chuẩn ELO Tân thủ Provisional (K = 50.0)\n• Điều chỉnh ELO theo độ khốc liệt & cách biệt tỷ số"]
    end

    MobileApp -- "REST API / Bearer Token" --> CoreAPI
    WebPortal -- "Server Components / SSR Data" --> SupabaseDB
    CoreAPI -- "Prisma Client" --> SupabaseDB
    CoreAPI -- "HTTP REST (JSON Payload)" --> AIEngine
```

### 1. Phân Hệ Backend (`dinkmate-system` - Thư mục này)
- Đóng vai trò là **"trái tim và trung tâm điều phối toàn hệ thống"**:
  - Quản lý phiên đăng nhập an toàn bằng mã hóa mật khẩu **Bcrypt** và cấp phát **JWT Bearer Token**.
  - Kiểm soát luồng trạng thái trận đấu: từ lúc tìm kiếm (`Searching`), ghép thành công (`Pending`), vào trận (`In_Progress`), hoàn tất (`Completed`) hoặc khiếu nại (`Disputed`).
  - Quản lý **Điểm Uy Tín (Trust Score)**: Tự động trừ 10 điểm kẻ bùng kèo, trừ 20 điểm người gian lận, cấm đấu hạng người chơi có Trust Score $< 60$.
  - Cung cấp cổng **Admin Disputes** (`/admin/disputes`) để ban trọng tài xem xét bằng chứng và phân xử khi 2 bên nộp điểm sai lệch.
  - Tích hợp sẵn **Cổng Web Portal** (`/`) giao diện sáng sủa, thân thiện, tải dữ liệu SSR trực tiếp từ PostgreSQL Supabase.

### 2. Phân Hệ Frontend (Mobile App Flutter & Web Portal)
- **Mobile App (`dinkmate_flutter`)**: Đóng vai trò là **"thiết bị ra sân"**. Vì cần xác thực vị trí GPS thực tế và dùng camera quét mã QR dán trên lưới, các thao tác thi đấu cốt lõi (tạo kèo, tìm đối thủ, check-in, nộp điểm) được thiết kế chuyên biệt trên Mobile để đảm bảo tính trung thực.
- **Web Portal (`dinkmate-system/app`)**: Đóng vai trò là **"cổng thông tin đại chúng"**. Được thiết kế với giao diện Light Theme tươi sáng, thân thiện cho mọi người dùng (ngay cả khi chưa tải app) có thể xem bảng xếp hạng ELO, tra cứu hồ sơ bạn bè, xem danh sách cụm sân và quét mã QR tải app.

### 3. Phân Hệ AI Microservice (`dinkmate-ai`)
- Đóng vai trò là **"bộ não tính toán thông minh"**:
  - Sử dụng mô hình Học Tăng Cường **SAC (Soft Actor-Critic)** đã được huấn luyện sẵn để tìm ra cặp đấu có độ chênh lệch trình độ nhỏ nhất.
  - Tích hợp công thức khoảng cách mặt cầu Trái Đất **Haversine**: Tự động loại bỏ các cặp đấu cách nhau $> 25	ext{km}$ và ưu tiên tối đa cho người chơi chọn cùng một sân đấu (`distance = 0km`).
  - Thuật toán **Biến Động ELO Thích Ứng**: Đánh giá độ khốc liệt của trận đấu (`Intensity`), cách biệt tỷ số (thắng đậm $2-0$ hay thắng sát nút $2-1$) và kích hoạt hệ số **$K = 50.0$** cho tài khoản tân thủ (`Provisional`) để điểm số nhanh chóng hội tụ về thực lực thật.

---

## 🔄 4. Chi Tiết Các Nghiệp Vụ Cốt Lõi (Core Workflows)

```mermaid
sequenceDiagram
    autonumber
    actor PlayerA as 🏃 Đấu Thủ A
    actor PlayerB as 🏃 Đấu Thủ B
    participant Mobile as 📱 Mobile App (Flutter)
    participant Backend as ⚡ Backend (dinkmate-system)
    participant AI as 🤖 AI Engine (FastAPI)
    participant Admin as 🛡️ Admin Portal

    Note over PlayerA, Mobile: BƯỚC 1: TẠO KÈO & TÌM TRẬN
    PlayerA->>Mobile: Chọn sân & Bật tìm trận Đấu Hạng (Ranked)
    Mobile->>Backend: POST /api/match-requests (kèm toạ độ GPS sân & Trust Score >= 60)
    Backend->>AI: POST /api/matchmake (danh sách người chơi + GPS)
    AI->>AI: Lọc bán kính <= 25km + Dự đoán cặp đấu tối ưu (SAC Model)
    AI-->>Backend: Trả về cặp đấu (Player A vs Player B, Distance, Court)
    Backend-->>Mobile: Ghép trận thành công! Tạo Match trạng thái "Pending"

    Note over PlayerA, PlayerB: BƯỚC 2: RA SÂN & CHECK-IN QR THỰC ĐỊA
    PlayerA->>Mobile: Quét mã QR vật lý tại sân
    PlayerB->>Mobile: Quét mã QR vật lý tại sân
    Mobile->>Backend: POST /api/matches/check-in (scanned_qr_code)
    Backend-->>Mobile: Cả 2 đã có mặt! Chuyển trạng thái "In_Progress" & Đếm giờ

    Note over PlayerA, PlayerB: BƯỚC 3: THI ĐẤU & NỘP ĐIỂM ĐỐI SOÁT
    PlayerA->>Mobile: Nộp điểm trận đấu (VD: Thắng 2-1, Căng thẳng)
    PlayerB->>Mobile: Nộp điểm trận đấu (VD: Thua 1-2, Căng thẳng)
    Mobile->>Backend: POST /api/matches/submit-score

    alt Điểm số 2 bên KHỚP NHAU (Đồng thuận)
        Backend->>AI: POST /api/calculate-elo (scores, intensity, provisional)
        AI-->>Backend: Trả về biến động ELO (new_elo_a, new_elo_b)
        Backend-->>Mobile: Hoàn thành trận đấu! ELO cập nhật tức thì.
    else Điểm số 2 bên LỆCH NHAU (Bất đồng)
        Backend-->>Backend: Chuyển trận sang "Disputed", mở hồ sơ khiếu nại
        Backend-->>Admin: Báo cáo khiếu nại lên trang Admin Disputes (/admin/disputes)
        Admin->>Backend: POST /api/disputes/resolve (chốt kết quả & phạt -20 Trust Score kẻ gian)
        Backend-->>Mobile: Trận đấu đã được trọng tài phân xử!
    end
```

---

## 📁 5. Cấu Trúc Thư Mục `dinkmate-system`

```
dinkmate-system/
├── app/
│   ├── admin/
│   │   └── disputes/              # Trang Quản trị viên phân xử khiếu nại (Admin Portal)
│   ├── api/
│   │   ├── ai-matchmake/          # API kích hoạt quét & gọi AI ghép kèo (kèm GPS)
│   │   ├── auth/login/            # API Đăng nhập, kiểm tra mật khẩu Bcrypt & cấp JWT Token
│   │   ├── courts/                # API Quản lý cụm sân (GET danh sách kèm GPS, POST tạo sân)
│   │   │   └── [id]/              # API Chi tiết cụm sân
│   │   ├── disputes/              # API Danh sách khiếu nại
│   │   │   └── resolve/           # API Phân xử khiếu nại, chốt ELO & phạt điểm uy tín
│   │   ├── match-requests/        # API Tạo & lấy danh sách kèo đang mở (chặn Trust Score < 60)
│   │   │   ├── cancel/            # API Hủy yêu cầu tìm kiếm
│   │   │   └── check-status/      # API Kiểm tra trạng thái ghép kèo
│   │   ├── matches/               # API Trận đấu
│   │   │   ├── accept/            # API Nhận kèo giao lưu (chặn Trust Score < 60)
│   │   │   ├── cancel/            # API Hủy trận & phạt trừ 10 điểm vắng mặt No-show
│   │   │   ├── check-in/          # API Quét mã QR check-in tại sân
│   │   │   ├── my-matches/        # API Lịch sử trận đấu của người chơi
│   │   │   └── submit-score/      # API Nộp điểm đối soát & gọi AI tính ELO (tính giờ thực tế)
│   │   └── users/                 # API Đăng ký tài khoản mới & danh sách người chơi
│   │       ├── leaderboard/       # API Bảng xếp hạng ELO
│   │       └── [id]/stats/        # API Thống kê chỉ số cá nhân (Win rate, số trận)
│   ├── components/
│   │   └── PortalClient.tsx       # Giao diện Web Portal tươi sáng, thân thiện (Light Theme)
│   ├── globals.css                # Cấu hình Tailwind CSS v4 & Google Font Be Vietnam Pro
│   ├── layout.tsx                 # Root layout & SEO Metadata
│   └── page.tsx                   # Server Component tải dữ liệu SSR thời gian thực cho Web Portal
├── lib/
│   ├── auth.ts                    # Thư viện tiện ích Bcrypt (Salt 10), JWT Token & Bearer Auth
│   └── prisma.ts                  # Khởi tạo Prisma Client Singleton
├── prisma/
│   └── schema.prisma              # Định nghĩa mô hình dữ liệu PostgreSQL (Supabase)
├── .env                           # Biến môi trường kết nối DB & JWT Secret
└── package.json
```

---

## 📡 6. Danh Sách REST API Endpoints Chi Tiết

### 🔐 A. Xác Thực & Người Dùng (`/api/auth`, `/api/users`)
- `POST /api/auth/login`: Đăng nhập bằng SĐT & Mật khẩu. Hỗ trợ đối soát Bcrypt và tự động nâng cấp mã hóa cho tài khoản cũ. Trả về JWT Token (7 ngày) + Thông tin người dùng.
- `POST /api/users`: Đăng ký tài khoản mới (tự động băm mật khẩu bằng Bcrypt Salt 10).
- `GET /api/users`: Lấy danh sách toàn bộ người chơi.
- `GET /api/users/leaderboard`: Bảng xếp hạng ELO người chơi toàn quốc (sắp xếp giảm dần).
- `GET /api/users/[id]/stats`: Thống kê tỷ lệ thắng (Win rate %), điểm ELO, tổng trận của 1 người chơi.

### 🏟️ B. Cụm Sân Thi Đấu (`/api/courts`)
- `GET /api/courts?lat={lat}&lng={lng}&radius={km}`: Lấy danh sách sân, tự động tính khoảng cách đường chim bay Haversine và sắp xếp sân gần nhất lên đầu.
- `POST /api/courts`: Tạo cụm sân mới (tự động sinh mã QR duy nhất nếu không truyền).
- `GET /api/courts/[id]`: Xem thông tin chi tiết một cụm sân theo ID.

### 🎯 C. Kèo Đấu (`/api/match-requests`)
- `POST /api/match-requests`: Tạo kèo mới (Giao lưu hoặc Đấu Hạng). **Tự động chặn nếu Trust Score < 60**.
- `GET /api/match-requests`: Lấy danh sách kèo giao lưu đang mở (`Open`) và chưa quá hạn.
- `POST /api/match-requests/cancel`: Hủy kèo đang tìm kiếm, dọn dẹp hàng đợi.

### ⚔️ D. Trận Đấu (`/api/matches`)
- `POST /api/matches/accept`: Nhận kèo giao lưu của người khác. **Tự động chặn nếu Trust Score < 60**.
- `POST /api/matches/check-in`: Quét mã QR tại sân. Khi cả 2 quét thành công $\rightarrow$ Chuyển `In_Progress` và bắt đầu tính thời lượng thực tế.
- `POST /api/matches/submit-score`: Nộp tỷ số trận đấu. Khi 2 bên khớp điểm $\rightarrow$ Gọi AI tính biến động ELO (hệ số $K=50$ cho tân thủ).
- `POST /api/matches/cancel`: Hủy trận đấu trạng thái `Pending`. Tự động phạt trừ 10 điểm uy tín nếu đối thủ vắng mặt (No-show).
- `GET /api/matches/my-matches?userId={id}`: Lấy danh sách trận đấu đang chờ và đã hoàn thành của một người chơi.

### 🛡️ E. Phân Xử Khiếu Nại (`/api/disputes`)
- `GET /api/disputes`: Lấy danh sách hồ sơ khiếu nại (sắp xếp theo `created_at: 'desc'`).
- `POST /api/disputes/resolve`: Admin chốt kết quả chung cuộc, cập nhật ELO và phạt trừ 20 điểm uy tín người gian lận.

### 🤖 F. Ghép Kèo AI (`/api/ai-matchmake`)
- `POST /api/ai-matchmake`: Kích hoạt vòng quét tự động dọn kèo hết hạn, gửi danh sách người chơi kèm toạ độ sân sang AI Microservice để ghép cặp.

---

## 💻 7. Hướng Dẫn Cài Đặt & Khởi Chạy

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

Sau khi khởi chạy thành công:
- **Web Portal công khai**: Truy cập [http://localhost:3000](http://localhost:3000) trên trình duyệt.
- **Trang Quản trị Khiếu nại**: Truy cập [http://localhost:3000/admin/disputes](http://localhost:3000/admin/disputes).

---

## ⚙️ 8. Cấu Hình Biến Môi Trường (`.env`)

Tạo file `.env` tại thư mục gốc của `dinkmate-system`:

```env
# Kết nối PostgreSQL Supabase (qua pgBouncer Pooler)
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Kết nối trực tiếp để chạy lệnh Prisma db push / migrations
DIRECT_URL="postgresql://postgres.[YOUR-PROJECT]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# JWT Secret Key dùng để ký và xác thực token (7 ngày)
JWT_SECRET="dinkmate_super_secret_jwt_key_2026"
```

---

## 📜 9. Bản Quyền & Phát Triển
Hệ thống được thiết kế, tối ưu và phát triển độc quyền bởi đội ngũ **DinkMate Việt Nam © 2026**.
