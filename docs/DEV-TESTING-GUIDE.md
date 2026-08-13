# Hướng dẫn Dev: Setup & Test local (Dashboard + Backend + DB)

Tài liệu này ghi lại các bước đã verify chạy được trên môi trường dev local (2026-08-05). Xem `ARCHITECTURE.md` để hiểu schema/API mapping đầy đủ; tài liệu này chỉ tập trung vào **các bước chạy và test**.

## Quick start (1 lệnh)

```bash
npm run dev
```

Chạy từ **thư mục gốc repo**. Lệnh này (`scripts/dev.sh`) tự động: start Postgres qua Docker Compose → cài deps + `prisma generate` cho backend (nếu thiếu) → cài deps cho dashboard (nếu thiếu) → chạy song song backend (`localhost:3000`) và dashboard, log gộp chung terminal với prefix `[backend]` / `[dashboard]`. `Ctrl+C` để dừng cả 2. Postgres container không tự tắt theo (dùng `docker compose down` trong `database/` nếu muốn tắt hẳn).

Phần bên dưới là các bước thủ công tương ứng — dùng để debug khi quick start gặp lỗi.

## 0. Yêu cầu

- Node.js (đã test với v24.18.0) + npm
- Docker + Docker Compose (dùng để chạy Postgres local, không cần cài Postgres native)

## 1. Khởi động Database (Postgres qua Docker)

```bash
cd database
cp .env.example .env   # chỉ cần làm lần đầu
docker compose up -d
```

- Container `izone_postgres` (port `5432`) và `izone_pgadmin` (port `5050`, login `admin@izone.edu.vn` / `admin123`) sẽ được tạo.
- **Lần đầu tiên** container khởi tạo, nó tự động chạy toàn bộ file trong `migrations/` (`001_schema.sql` → `004_contact_logs.sql`) qua cơ chế `docker-entrypoint-initdb.d` của Postgres — nghĩa là **DB đã có sẵn seed data**, không cần chạy `backend/seed.js` thêm (chạy lại sẽ lỗi vì bảng/dữ liệu đã tồn tại).
- Toàn bộ bảng nằm trong schema **`izone`**, không phải `public`. Khi query bằng `psql`/pgAdmin nhớ prefix `izone.` (vd `select * from izone.students`) hoặc `SET search_path TO izone;`.

Kiểm tra nhanh DB đã sống và có data:

```bash
docker exec izone_postgres pg_isready -U postgres -d izone_dashboard
docker exec izone_postgres psql -U postgres -d izone_dashboard -t -c "
  select 'students', count(*) from izone.students
  union all select 'classes', count(*) from izone.classes
  union all select 'teachers', count(*) from izone.teachers;
"
```

Nếu cần khởi tạo lại DB từ đầu (xoá sạch data hiện tại): `docker compose down -v && docker compose up -d`.

## 2. Chạy Backend (NestJS + Prisma)

```bash
cd backend
npm install
npx prisma generate   # BẮT BUỘC sau mỗi lần npm install / clone mới — @prisma/client mặc định là stub rỗng
npm run start:dev
```

Server chạy ở `http://localhost:3000`, tất cả route dưới prefix `/api`. Watch mode nên sửa code trong `backend/src` sẽ tự reload — **nhưng nếu bạn chạy lại `prisma generate`, phải restart tiến trình thủ công** (tsc watch không detect thay đổi trong `node_modules`).

Kỳ vọng log khi start thành công: `Found 0 errors` rồi `Nest application successfully started`.

### Test API bằng tay (curl)

Login (field `password` trong body thực chất là **số điện thoại** giáo viên — đúng thiết kế login email+SĐT, không phải bug):

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"phuong.tm@izone.edu.vn","password":"0901234567"}'
```

Tài khoản seed sẵn để test (bảng `izone.teachers`):

| Email | SĐT | Role |
|---|---|---|
| phuong.tm@izone.edu.vn | 0901234567 | teacher |
| anh.nh@izone.edu.vn | 0912345678 | teacher |
| ha.lt@izone.edu.vn | 0923456789 | teacher |
| ha.nnb@izone.edu.vn | 0934567890 | lead |

Response trả `access_token` (JWT, hết hạn sau 7 ngày). Dùng token để gọi các route cần auth:

```bash
TOKEN="<access_token ở trên>"
curl http://localhost:3000/api/me -H "Authorization: Bearer $TOKEN"
curl http://localhost:3000/api/classes -H "Authorization: Bearer $TOKEN"
```

Gọi không kèm header `Authorization` sẽ trả `401 Không tìm thấy Access Token` — đây là hành vi đúng, không phải lỗi.

### Automated tests (backend)

```bash
cd backend
npm test        # jest unit tests
npm run test:e2e
```

## 3. Chạy Frontend (dashboard)

```bash
cd dashboard
npm run dev
```

Mặc định gọi API tại `http://localhost:3000/api` (hardcode trong `dashboard/src/api/client.ts`) — nên phải có backend chạy sẵn theo bước 2 trước, và **không đổi port backend** nếu không sửa file này.

Đăng nhập trên UI dùng đúng bộ email/SĐT ở bảng trên.

### 4 gate bắt buộc trước khi coi là "xong" (theo `CLAUDE.md`)

Chạy cả 4 lệnh sau trong `dashboard/`, tất cả phải sạch:

```bash
npx tsc -b       # typecheck, strict (noUnusedLocals/noUnusedParameters bật)
npm run lint     # oxlint
npm test         # vitest (node env, không có DOM/RTL)
npm run build    # tsc -b rồi vite build
```

## 5. Troubleshooting nhanh

| Triệu chứng | Nguyên nhân thường gặp | Cách fix |
|---|---|---|
| `npm run start:dev` chỉ in ra 2 dòng script rồi im lặng / không log gì thêm | `node_modules` chưa cài | `npm install` trong `backend/` |
| TS error `Module "@prisma/client" has no exported member 'PrismaClient'` | Chưa generate Prisma Client | `npx prisma generate` trong `backend/`, rồi **restart** `start:dev` |
| `pg_isready` báo connection refused / API 500 khi query DB | Container Postgres chưa chạy hoặc chưa healthy | `docker compose ps` trong `database/`, xem `docker logs izone_postgres` |
| Login trả `Thiếu email hoặc mật khẩu` dù đã điền | Đang gửi field `phone` thay vì `password` trong JSON body | Đổi tên field thành `password` (chứa giá trị SĐT) |
| Frontend không gọi được API dù backend chạy | Backend không chạy đúng port 3000, hoặc CORS | Kiểm tra `dashboard/src/api/client.ts` khớp `http://localhost:3000/api` |

## Lưu ý quan trọng

- DB này **chỉ chạy local** — VPS production (`160.187.146.127`) hiện **chưa** có Postgres/DB cho repo này (đã kiểm tra 2026-08-05, xem thêm ghi chú trong `database/DEPLOYMENT.md` cho kế hoạch deploy VPS).
- Data hiện tại là **seed data giả** (theo `ARCHITECTURE.md`), không phải data thật từ hệ thống.
- API client của frontend hiện hardcode một số field (`riskScore`, `healthScore`, `isAlarmTriggered`, ...) về `0`/`false` bất kể backend trả gì — xem bảng chi tiết ở `ARCHITECTURE.md` §4 trước khi assume field nào đó là live data.
