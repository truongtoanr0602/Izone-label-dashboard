# Lead Dashboard clarity fixes + desktop sidebar toggle

**Ngày**: 2026-08-03
**Phạm vi**: `src/components/dashboard/{LeadDashboard,TrendChart,KpiCard,KpiRow}.tsx`, một component mới `src/components/common/InfoTooltip.tsx`, `src/App.tsx`, `src/components/common/Header.tsx`.

## Bối cảnh

Bốn vấn đề UX được phát hiện khi rà lại Lead Khối Dashboard:

1. Biểu đồ trend ("Chất lượng vận hành", "Kết quả") vẫn hiện dữ liệu của các tháng trước khi Lead lọc theo một kỳ cụ thể (vd Tháng 07/2026) — gây cảm giác bộ lọc kỳ không hoạt động.
2. Thẻ KPI "Điểm danh (TB)", "Pass chuẩn", "Pass mềm" hiện hai dòng chú thích mẫu số chồng lên nhau, không phân biệt được dòng nào nói về giá trị lớn và dòng nào nói về delta.
3. Không có nơi nào trong UI giải thích công thức tính Pass chuẩn / Pass mềm cho người đọc.
4. Sidebar (`aside`) chưa có cách thu gọn trên desktop (`≥ xl`) — luôn chiếm cố định 256px.

Bốn phần độc lập nhau về code, gộp chung một spec vì cùng một đợt rà soát UI và cùng nhánh làm việc.

---

## Phần 1 — Ghi rõ cửa sổ 13 tuần của biểu đồ trend

### Vấn đề

`LeadDashboard.tsx:106-136` xây `khoiSeries` bằng cách lấy **13 tuần gần nhất tính lùi từ ngày cuối kỳ đã chọn** (`periodEnd`), không phải chỉ các tuần nằm trong kỳ đó. Đây là quyết định thiết kế có chủ đích (đã ghi chú trong code — cho Lead thấy xu hướng dẫn tới kỳ đang xem), **không đổi**. Nhưng subtitle của `TrendChart` hiện tại (`LeadDashboard.tsx:223`, `:231`) không nói gì về cửa sổ trượt này, nên khi Lead chọn "Tháng 07/2026" từ dropdown kỳ báo cáo — vốn lọc đúng phạm vi ở mọi chỗ khác (KPI cards, ContextBar) — họ kỳ vọng biểu đồ cũng chỉ hiện tháng 7, và thấy các điểm của tháng 4-6 là bất thường.

### Thay đổi

Giữ nguyên toàn bộ logic tính `khoiSeries`. Chỉ đổi 2 chuỗi `subtitle` truyền vào `TrendChart` trong `LeadDashboard.tsx` từ hardcode sang template string chèn `periodLabel(selectedPeriod)` (hàm đã có sẵn, import từ `../../data/selectors`):

```tsx
<TrendChart
  title="Chất lượng vận hành"
  subtitle={`Tỷ lệ điểm danh và BTVN toàn khối, 13 tuần gần nhất tính đến hết ${periodLabel(selectedPeriod)}. Vạch dọc là mốc bài test.`}
  ...
/>
<TrendChart
  title="Kết quả"
  subtitle={`Tỷ lệ pass chuẩn và pass mềm toàn khối, 13 tuần gần nhất tính đến hết ${periodLabel(selectedPeriod)}, chỉ tính trên lớp đã có bài test. Đường ngắt là tuần chưa lớp nào thi.`}
  ...
/>
```

Không đổi props/API của `TrendChart` — nó vẫn chỉ nhận một `subtitle: string` đã build sẵn.

### Testing

Không có logic mới cần unit test (chuỗi hiển thị thuần tuý, không rẽ nhánh). Kiểm chứng bằng mắt: đổi kỳ báo cáo trong dropdown, subtitle của cả 2 chart phải đổi theo.

---

## Phần 2 — Tách 2 dòng chú thích trên KPI card bằng visual

### Vấn đề

`KpiCard.tsx:70-81` render `note` (mẫu số của giá trị lớn) và `formatComparisonNote(delta)` (mẫu số của delta) thành hai `<p>` liên tiếp, cùng cỡ chữ `text-[10px]`, cùng màu, chỉ cách nhau bằng margin nhỏ. Với các thẻ có cả hai (Điểm danh, Pass chuẩn, Pass mềm, Chuyển dịch nhãn, Bỏ học), hai câu na ná nhau về hình thức khiến người đọc phải đọc hết cả hai mới phân biệt được câu nào nói về gì.

### Thay đổi

Giữ nguyên câu chữ (đã cố ý bắt đầu bằng "thay đổi" để tự phân biệt — `kpiFormat.ts:62-68`). Thêm đường kẻ phân cách mảnh phía trên dòng delta, dùng đúng token border đã dùng ở nơi khác trong codebase (`border-[#f3f4f6] dark:border-[#3f3f46]`, cùng cách `TopRibbon.tsx` phân tách nội dung khỏi hàng hành động):

```tsx
{note !== undefined && (
  <p className="text-[10px] text-[#404040]/50 dark:text-[#71717a] mt-1.5">
    {note}
  </p>
)}
<p
  className={`text-[10px] text-[#404040]/50 dark:text-[#71717a] ${
    note !== undefined
      ? 'mt-1.5 pt-1.5 border-t border-[#f3f4f6] dark:border-[#3f3f46]'
      : 'mt-1.5'
  }`}
>
  {formatComparisonNote(delta)}
</p>
```

Khi không có `note` (thẻ "Làm BTVN (TB)" không truyền `note`), không hiện border — chỉ một dòng, không có gì để tách.

### Testing

Thuần CSS, không cần unit test. Kiểm chứng bằng mắt ở cả light/dark mode trên các thẻ có `note`: Điểm danh, Pass chuẩn, Pass mềm, Chuyển dịch nhãn, Bỏ học.

---

## Phần 3 — Tooltip giải thích Pass chuẩn / Pass mềm

### Vấn đề

Không có nơi nào trong UI giải thích công thức Pass chuẩn / Pass mềm. Công thức thật (đã verify trên dữ liệu, xem `ARCHITECTURE.md` §4):

- **Pass chuẩn**: `attendance_pct ≥ 90 VÀ homework_pct ≥ 90 VÀ test_average ≥ 60` — ba điều kiện tách rời, tất cả phải đạt.
- **Pass mềm** — 3 nhóm ngoại lệ:
  - Nhóm 1: `50 ≤ test_average < 55`, ĐH = 100%, BTVN = 100% — cần GV duyệt.
  - Nhóm 2: `55 ≤ test_average < 60`, ĐH ≥ 90%, BTVN ≥ 90% — cần GV duyệt.
  - Nhóm 3: `test_average ≥ 60` — tự động đạt, không phụ thuộc ĐH/BTVN.

### Component mới: `src/components/common/InfoTooltip.tsx`

Codebase chưa có component tooltip nào cho nội dung nhiều dòng (chỉ có `title=""` native cho hint 1 dòng, và `<Tooltip>` của recharts riêng cho biểu đồ). Dùng `<details>/<summary>` gốc của HTML thay vì tự quản `useState` + click-outside — nhẹ, có sẵn hỗ trợ bàn phím (Enter/Space khi `summary` focus) và screen reader, và quan trọng nhất: **mở bằng bấm/chạm, không phải hover** — vì dashboard có cả chế độ mobile drawer nơi hover không tồn tại.

```tsx
import React from 'react';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  /** aria-label cho icon — mô tả tooltip nói về cái gì, vd "Cách tính Pass chuẩn". */
  label: string;
  children: React.ReactNode;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ label, children }) => (
  <details className="relative inline-block">
    <summary
      aria-label={label}
      className="list-none cursor-help inline-flex items-center align-middle [&::-webkit-details-marker]:hidden"
    >
      <Info className="w-3 h-3 text-[#404040]/40 dark:text-[#71717a] hover:text-[#404040] dark:hover:text-[#e4e4e7] transition-colors" />
    </summary>
    <div className="absolute z-20 top-full left-1/2 -translate-x-1/2 mt-2 w-60 rounded-[8px] border border-[#f3f4f6] dark:border-[#3f3f46] bg-white dark:bg-[#27272a] p-3 text-[11px] font-normal normal-case leading-relaxed text-[#404040] dark:text-[#e4e4e7] shadow-[0px_3px_5px_0px_rgba(0,0,0,0.2)]">
      {children}
    </div>
  </details>
);
```

`normal-case` + `font-normal` bắt buộc vì nơi gắn icon (`KpiCard` label) đang là `text-xs font-bold uppercase` — nội dung tooltip phải reset lại, không kế thừa.

### Nối vào `KpiCard` / `KpiRow`

Thêm prop tuỳ chọn `infoTooltip?: React.ReactNode` vào `KpiCardProps` (`KpiCard.tsx`), render ngay sau label:

```tsx
<span className="text-xs font-bold text-[#404040]/50 dark:text-[#71717a] uppercase">
  {label}
</span>
{infoTooltip}
```

Trong `KpiRow.tsx`, truyền vào 2 thẻ Pass:

```tsx
<KpiCard
  ...
  label="Pass chuẩn"
  infoTooltip={
    <InfoTooltip label="Cách tính Pass chuẩn">
      Điểm danh ≥90% <b>VÀ</b> BTVN ≥90% <b>VÀ</b> TB test ≥60 — cả 3 điều kiện.
    </InfoTooltip>
  }
/>
<KpiCard
  ...
  label="Pass mềm"
  infoTooltip={
    <InfoTooltip label="Cách tính Pass mềm">
      <b>Nhóm 1</b>: TB test 50–&lt;55, ĐH &amp; BTVN = 100% (cần GV duyệt)<br />
      <b>Nhóm 2</b>: TB test 55–&lt;60, ĐH &amp; BTVN ≥90% (cần GV duyệt)<br />
      <b>Nhóm 3</b>: TB test ≥60 (tự động đạt)
    </InfoTooltip>
  }
/>
```

Các thẻ khác không truyền `infoTooltip` — prop optional, mặc định không render gì thêm.

### Testing

Không có logic thuần tuý mới để unit test (nội dung tĩnh, không rẽ nhánh). Kiểm chứng bằng mắt: bấm icon mở popover đúng vị trí, không bị cắt bởi overflow của thẻ cha, đóng lại khi bấm icon lần nữa; kiểm tra cả light/dark mode.

---

## Phần 4 — Nút hide/unhide sidebar trên desktop

### Vấn đề

`aside` trong `App.tsx:59` đã có cơ chế ẩn/hiện **dưới `xl`** (mobile/tablet): `isMobileMenuOpen` state, nút hamburger (`Menu` icon, `xl:hidden`) trong `Header.tsx:51-58` mở ra, nút `X` trong `aside` đóng lại. Từ `xl` trở lên, `aside` chuyển sang `xl:relative xl:translate-x-0` — luôn hiển thị, chưa có cách thu gọn.

### Thay đổi

**State mới** (`App.tsx`): `isSidebarCollapsed` (mặc định `false`), **độc lập** với `isMobileMenuOpen` — hai cơ chế CSS khác nhau cho hai breakpoint (mobile: drawer đè lên nội dung bằng `fixed` + transform; desktop: đẩy nội dung bằng co giãn `width`), không dùng chung một cờ.

**Vì sao cần co cả `width`, không chỉ transform**: ở `xl` trở lên `aside` là `xl:relative` — nằm trong flex layout cùng `<div className="flex-1 ...">` main content. Nếu chỉ ẩn bằng `translate-x-full` (như cách mobile đang làm), nó vẫn chiếm 256px trong luồng flex, main content sẽ không nới rộng ra lấp khoảng trống. Phải co `xl:w-64` → `xl:w-0` (kèm `xl:p-0 xl:overflow-hidden` để padding và nội dung bên trong không tràn ra ngoài trong lúc animate), giữ nguyên `transition-all duration-300` đã có sẵn trên `aside` để chuyển động mượt.

```tsx
<aside
  className={`fixed inset-y-0 left-0 w-64 h-full flex-shrink-0 flex flex-col z-[60] xl:z-20 border-r border-[#f3f4f6] dark:border-[#3f3f46] bg-white dark:bg-[#27272a] text-[#404040] dark:text-[#e4e4e7] p-5 space-y-6 transform transition-all duration-300 xl:relative xl:translate-x-0
    ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
    ${isSidebarCollapsed ? 'xl:w-0 xl:p-0 xl:border-0 xl:overflow-hidden' : ''}
  `}
>
```

Base classes (`w-64 p-5`, không có prefix `xl:`) giữ nguyên như code gốc — chúng quyết định kích thước dưới `xl` (mobile/tablet drawer, không đổi). Khi `isSidebarCollapsed`, các lớp `xl:*` thêm vào ghi đè base classes **chỉ từ `xl` trở lên**, đúng theo cách Tailwind resolve specificity theo thứ tự breakpoint — dưới `xl` không bị ảnh hưởng.

**Nút bấm** (`Header.tsx`): thêm cạnh nút hamburger hiện có, cùng vị trí góc trái, nhưng chỉ hiện ở `xl` trở lên (`hidden xl:flex` — ngược lại với hamburger `xl:hidden`), giữ đúng vị trí quen thuộc thay vì thêm khu vực UI mới. Icon đổi theo trạng thái: `PanelLeftClose` khi sidebar đang mở, `PanelLeftOpen` khi đã thu gọn (cả hai đã có sẵn trong `lucide-react` đã cài).

Prop mới cho `HeaderProps`:

```tsx
interface HeaderProps {
  ...
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}
```

```tsx
<button
  onClick={onToggleSidebar}
  className="hidden xl:flex p-2 -ml-2 rounded-[8px] text-[#404040]/60 dark:text-[#a1a1aa] hover:text-[#404040] dark:hover:text-[#e4e4e7] hover:bg-[#f3f4f6] dark:hover:bg-[#3f3f46] transition-colors"
  title={isSidebarCollapsed ? 'Hiện sidebar' : 'Ẩn sidebar'}
>
  {isSidebarCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
</button>
```

`App.tsx` truyền `isSidebarCollapsed` và `onToggleSidebar={() => setIsSidebarCollapsed((v) => !v)}` xuống `Header`.

### Testing

Không có logic thuần tuý mới. Kiểm chứng bằng mắt ở `≥ xl`: bấm nút, sidebar co về 0 mượt mà, main content nới rộng lấp khoảng trống, icon đổi trạng thái đúng; bấm lại để mở ra; xác nhận hành vi mobile (`< xl`, drawer + overlay + nút X) không đổi.

---

## Rủi ro / việc KHÔNG làm trong spec này

- Không đổi logic tính `khoiSeries` (13 tuần trailing) — chỉ đổi câu chữ mô tả nó.
- Không thêm cơ chế "nhớ" trạng thái `isSidebarCollapsed` qua localStorage/URL — reset về `false` mỗi lần load lại trang, giống hành vi mặc định của mọi state khác trong `App.tsx` (không có persistence layer nào trong app hiện tại).
- Không đổi `KpiCardProps.label` từ `string` sang `React.ReactNode` — giữ nguyên kiểu, thêm prop `infoTooltip` riêng để không phá các chỗ gọi `KpiCard` khác.
