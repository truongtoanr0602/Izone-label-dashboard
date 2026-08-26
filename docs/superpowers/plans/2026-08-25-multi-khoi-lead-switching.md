# Multi-Khoi Lead Switching Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cho phép một tài khoản Lead được cấp quyền nhiều khối và chuyển khối đang xem ngay trên Lead Dashboard mà không đăng nhập lại.

**Architecture:** Thay quan hệ quyền một-một `teachers.khoi_id` bằng bảng phân quyền nhiều-nhiều `teacher_khoi_assignments`, nhưng giữ cột cũ làm fallback trong giai đoạn chuyển tiếp. Mỗi request vẫn xác thực JWT hiện tại, tải lại danh sách quyền từ database, rồi backend tự kiểm tra `khoiId` được yêu cầu trước khi query theo `classes.course_id`; frontend chỉ hiển thị các scope do `/api/me` trả về.

**Tech Stack:** PostgreSQL 16, Prisma 7, NestJS 11/Jest, React 19/TypeScript, Vitest, Tailwind CSS v4.

**Spec:** Thiết kế database/backend và vị trí bộ chọn khối đã được người dùng duyệt trong hội thoại ngày 2026-08-25.

## Global Constraints

- Không tin `khoiId` do frontend gửi lên nếu nó không nằm trong quyền của Lead.
- JWT không đổi khi chọn khối; quyền được đọc lại từ database trong `validateToken`.
- `classes.course_id` là nguồn scope dữ liệu; không lọc dữ liệu lớp bằng khối của giáo viên chủ nhiệm.
- Giữ `teachers.khoi_id` trong giai đoạn chuyển tiếp và backfill sang bảng mới.
- Không sửa hoặc ghi đè migration `011`/`012` và các thay đổi database hiện hữu của người dùng.
- UI copy bằng tiếng Việt, identifier bằng tiếng Anh, button phẳng và ít visual heat theo `Design.md`.

---

### Task 1: Database access model

**Files:**
- Create: `database/migrations/013_lead_khoi_assignments.sql`
- Modify: `backend/prisma/schema.prisma`

**Interfaces:**
- Produces: bảng `teacher_khoi_assignments(teacher_id, khoi_id, is_primary, granted_at)` với khóa chính kép và tối đa một assignment chính mỗi tài khoản.
- Backfill: mỗi `teachers.khoi_id` hiện tại trở thành một assignment `is_primary = true`.

- [ ] **Step 1: Add the idempotent SQL migration**

Tạo bảng, hai foreign key, partial unique index cho `is_primary`, index theo `khoi_id`, rồi `INSERT ... SELECT ... ON CONFLICT DO NOTHING` để backfill.

- [ ] **Step 2: Add the Prisma model and relations**

Thêm model `teacher_khoi_assignments`, relation arrays tại `teachers` và `khoi`; giữ nguyên relation legacy `teachers.khoi`.

- [ ] **Step 3: Validate and regenerate Prisma client**

Run trong `backend/`: `npx prisma validate` và `npx prisma generate`.
Expected: cả hai exit 0 và client nhận model mới.

### Task 2: Centralized lead-scope authorization

**Files:**
- Create: `backend/src/auth/lead-scope.ts`
- Create: `backend/src/auth/lead-scope.spec.ts`
- Modify: `backend/src/auth/auth.service.ts`
- Modify: `backend/src/auth/auth.service.spec.ts`

**Interfaces:**
- Produces: `AuthUser.khoiIds: number[]`, `AuthUser.defaultKhoiId?: number`, giữ `khoiId?: number` làm alias tương thích.
- Produces: `resolveLeadKhoiId(user, requestedKhoiId): number` trả scope hợp lệ hoặc ném `ForbiddenException`.
- `/api/me` tự động trả `khoiIds`, `defaultKhoiId` và `khoiScopes` có id/name.

- [ ] **Step 1: Write failing scope resolver tests**

Kiểm tra Lead được chọn khối nằm trong `[2,3]`, dùng default khi thiếu request, và bị `403` khi chọn khối `1`.

- [ ] **Step 2: Run tests and verify RED**

Run: `npm test -- lead-scope.spec.ts --runInBand`.
Expected: FAIL vì module chưa tồn tại.

- [ ] **Step 3: Implement the resolver**

Resolver chỉ áp dụng giới hạn danh sách cho role `lead`; admin dùng requested scope và teacher không được gọi Lead Dashboard.

- [ ] **Step 4: Write failing AuthService tests**

Mock Lead có hai assignment và khẳng định `validateToken` trả `[2,3]`, default `2`, cùng `khoiScopes` đúng tên; fixture không có assignment phải fallback về `teachers.khoi_id`.

- [ ] **Step 5: Implement AuthService multi-scope loading**

`teachers.findUnique` include assignments + `khoi`; sắp xếp primary trước, deduplicate id và dựng response `/me` từ cùng một nguồn.

- [ ] **Step 6: Run auth tests and verify GREEN**

Run: `npm test -- lead-scope.spec.ts auth.service.spec.ts --runInBand`.
Expected: PASS.

### Task 3: Apply selected scope to backend reads

**Files:**
- Modify: `backend/src/dashboards/dashboards.service.ts`
- Modify: `backend/src/dashboards/dashboards.service.spec.ts`
- Modify: `backend/src/classes/classes.controller.ts`
- Modify: `backend/src/classes/classes.service.ts`
- Modify: `backend/src/classes/classes.service.spec.ts`
- Modify: `backend/src/contact-logs/contact-logs.service.ts`
- Modify: `backend/src/label-changes/label-changes.service.ts`
- Modify: `backend/src/snapshots/snapshots.service.ts`

**Interfaces:**
- `GET /api/v1/lead-dashboard?khoiId=<id>` và `GET /api/classes?khoiId=<id>` nhận scope đã chọn.
- Các query Lead lọc bằng `c.course_id = selectedKhoiId`; teacher access tiếp tục dùng `classIds`.

- [ ] **Step 1: Update failing dashboard and class-service tests**

Thêm Lead fixture `[2,3]`; khẳng định request khối `3` thực sự bind `course_id = 3`, request khối `1` ném `ForbiddenException`, và SQL không còn `t.khoi_id`.

- [ ] **Step 2: Run affected backend tests and verify RED**

Run: `npm test -- dashboards.service.spec.ts classes.service.spec.ts --runInBand`.
Expected: FAIL vì service vẫn khóa vào `user.khoiId`.

- [ ] **Step 3: Implement selected-scope reads**

Dùng `resolveLeadKhoiId` trong Dashboard/Classes/Snapshots/ContactLogs/LabelChanges; thay relation filter qua teacher bằng `classes.course_id`; Teacher Dashboard của Lead kiểm tra class thuộc một trong `khoiIds`.

- [ ] **Step 4: Run backend tests and verify GREEN**

Run: `npm test -- dashboards.service.spec.ts classes.service.spec.ts lead-scope.spec.ts auth.service.spec.ts --runInBand`.
Expected: PASS.

### Task 4: Frontend scope state and selector

**Files:**
- Modify: `dashboard/src/api/courseScope.ts`
- Modify: `dashboard/src/api/courseScope.test.ts`
- Modify: `dashboard/src/api/client.ts`
- Modify: `dashboard/src/App.tsx`
- Modify: `dashboard/src/components/dashboard/LeadDashboard.tsx`

**Interfaces:**
- Produces: `KhoiScope { khoiId: number; name: string }` và `selectInitialKhoiId(scopes, defaultKhoiId)`.
- `api.getClasses(period, khoiId)` truyền cả kỳ và scope.
- `LeadDashboard` nhận `khoiScopes`, `selectedKhoiId`, `onSelectKhoi`; chỉ hiện segmented buttons khi có hơn một scope.

- [ ] **Step 1: Write failing frontend scope tests**

Khẳng định helper chọn default hợp lệ, fallback scope đầu tiên khi default không còn quyền, và trả `null` nếu danh sách rỗng.

- [ ] **Step 2: Run test and verify RED**

Run: `npm test -- src/api/courseScope.test.ts`.
Expected: FAIL vì helper chưa tồn tại.

- [ ] **Step 3: Implement scope state and API propagation**

Sau `/me`, App chọn `defaultKhoiId`; khi đổi khối thì reset lớp đang chọn, gọi lại `/classes` với `khoiId`, và truyền id đó cho Lead Dashboard.

- [ ] **Step 4: Add the selector under the Lead heading**

Render button group ngay dưới subtitle “Giám sát chất lượng...”; active button dùng border/text đỏ IZONE nhẹ, inactive dùng border trung tính. Không render group nếu Lead chỉ có một scope.

- [ ] **Step 5: Run frontend tests and typecheck**

Run: `npm test -- src/api/courseScope.test.ts` và `npx tsc -b`.
Expected: PASS.

### Task 5: Verification and documentation sync

**Files:**
- Modify: `ARCHITECTURE.md`

- [ ] **Step 1: Document the access model**

Ghi bảng assignment mới, `teachers.khoi_id` là fallback chuyển tiếp, contract `/api/me`, và quy tắc authorize-then-query bằng `classes.course_id`.

- [ ] **Step 2: Run backend gates**

Run trong `backend/`: `npm test -- --runInBand`, `npm run build`.
Expected: exit 0.

- [ ] **Step 3: Run dashboard gates**

Run trong `dashboard/`: `npx tsc -b`, `npm run lint`, `npm test`, `npm run build`.
Expected: exit 0; nếu ba lỗi `kpiFormat.test.ts` có sẵn vẫn xuất hiện, báo riêng và không sửa ngoài phạm vi.

- [ ] **Step 4: Smoke-test locally**

Login bằng Lead fixture có `[2,3]`; đổi qua lại hai button và xác nhận `/classes` cùng `/v1/lead-dashboard` đều gửi khối tương ứng, không phát sinh request login mới.
