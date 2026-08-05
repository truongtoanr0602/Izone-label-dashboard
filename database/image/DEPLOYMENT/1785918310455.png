**IZONE LABEL DASHBOARD**

Thiết kế API

*Bề mặt API tối thiểu cho việc chuyển dữ liệu mock sang backend
PostgreSQL*

Chuẩn bị cho: Lead Khối và đội kỹ thuật IZONE

Ngày: 05/08/2026

Phạm vi: bám sát đúng schema (types.ts) và các màn hình đang chạy trong
repo, không phải một kiến trúc API tổng quát

*Nội dung chính: xác thực & phân quyền · 5 API đọc · 2 API ghi · phần cố
tình chưa triển khai (YAGNI)*

Mục lục

[Bối cảnh [2](#bối-cảnh)](#bối-cảnh)

[Nguyên tắc thiết kế chung
[2](#nguyên-tắc-thiết-kế-chung)](#nguyên-tắc-thiết-kế-chung)

[Xác thực & Phân quyền [2](#xác-thực-phân-quyền)](#xác-thực-phân-quyền)

[GET /me [2](#get-me)](#get-me)

[Nhóm API Đọc (GET) [3](#nhóm-api-đọc-get)](#nhóm-api-đọc-get)

[GET /classes [3](#get-classes)](#get-classes)

[GET /classes/{classId}/students
[3](#get-classesclassidstudents)](#get-classesclassidstudents)

[GET /snapshots [3](#get-snapshots)](#get-snapshots)

[GET /label-events [4](#get-label-events)](#get-label-events)

[GET /contact-logs [4](#get-contact-logs)](#get-contact-logs)

[Nhóm API Ghi (POST) [5](#nhóm-api-ghi-post)](#nhóm-api-ghi-post)

[POST /contact-logs [5](#post-contact-logs)](#post-contact-logs)

[POST /contact-logs/undo
[5](#post-contact-logsundo)](#post-contact-logsundo)

[Cố tình chưa viết (YAGNI)
[6](#cố-tình-chưa-viết-yagni)](#cố-tình-chưa-viết-yagni)

[Bảng tổng hợp endpoint
[7](#bảng-tổng-hợp-endpoint)](#bảng-tổng-hợp-endpoint)

[Bước tiếp theo [8](#bước-tiếp-theo)](#bước-tiếp-theo)

# Bối cảnh

Dashboard hiện tại là một prototype frontend-only, đọc toàn bộ dữ liệu
từ src/data/mockData.ts --- không có API client, không có fetch, không
có persistence thật. Sau khi tham vấn kiến trúc (Oracle, 05/08/2026),
team đã chốt hướng chuyển sang PostgreSQL làm source of truth, có một
tầng API/backend đứng giữa frontend tĩnh (GitHub Pages) và database,
thay vì tiếp tục coi Google Sheets/mock data là nguồn dữ liệu chính.

Tài liệu này KHÔNG lặp lại kiến trúc tổng quát đó. Mục tiêu ở đây hẹp
hơn và cụ thể hơn: liệt kê chính xác những endpoint cần có, dựa trên
việc đọc trực tiếp các component đang chạy (App.tsx, StudentTable,
LeadDashboard, ZaloRemindModal...) và các interface đã có sẵn trong
src/data/types.ts --- vốn đã được coi là hợp đồng schema chính thức của
dự án.

# Nguyên tắc thiết kế chung

Ba nguyên tắc dưới đây áp dụng cho toàn bộ endpoint trong tài liệu,
không nhắc lại ở từng mục.

-   Response giữ nguyên interface trong src/data/types.ts, không tạo DTO
    mới. Các interface đó vốn đã là schema chính thức của dự án --- đổi
    shape ở tầng API tức là phá luôn StudentTable, LeadDashboard và
    ZaloRemindModal cùng lúc.

-   Tầng tổng hợp (aggregation) ở lại phía frontend.
    src/data/selectors/{aggregates,deltas,labelFlow,periods}.ts đã cài
    đúng các quy tắc nghiệp vụ tinh vi (trung bình có trọng số, trả null
    khi không có mẫu, pass rate chỉ tính trên lớp đã thi...) và đã có
    test bao phủ. Viết lại logic đó ở backend là trùng công và tạo rủi
    ro hai nơi tính ra hai con số khác nhau.

-   Phân quyền thực hiện ở server, không lọc ở React. Mọi endpoint bên
    dưới đều phải tự giới hạn theo classIds của người gọi (rút ra từ GET
    /me) --- không trả toàn bộ dữ liệu rồi để component tự filter.

# Xác thực & Phân quyền

## GET /me

**Mục tiêu --- nền tảng cho mọi authorization phía sau. Không endpoint
dữ liệu nào ở dưới được phép tự quyết ai xem được gì; tất cả phải tra
ngược lại kết quả của endpoint này.**

-   Auth --- Bearer token (OIDC ID token từ IdP tổ chức).

-   Response --- { userId, email, displayName, role: teacher \| lead \|
    admin, teacherId?, khoiId?, classIds\[\] }. classIds là danh sách
    lớp được quyền xem: với GV là lớp mình chủ nhiệm, với Lead là mọi
    lớp trong khoiId.

-   Quy tắc nghiệp vụ --- role suy ra từ bảng mapping email →
    teacher/user phía server, không suy từ domain email hay bất kỳ giá
    trị nào frontend tự gửi lên.

-   Lỗi --- 401 token không hợp lệ hoặc hết hạn. 403 email hợp lệ nhưng
    chưa được map vào hệ thống (GV mới chưa được Admin thêm) --- đây là
    lỗi vận hành thật sẽ gặp, không phải trường hợp hiếm.

# Nhóm API Đọc (GET)

## GET /classes

**Mục tiêu --- nuôi 3 chỗ cùng lúc: class-switcher trong Header, widget
Tổng quan lớp ở sidebar, và toàn bộ Lead Dashboard (Master Table + biểu
đồ phân bố nhãn).**

-   Tham số --- ?status=on_going (mặc định). 15 lớp đang chạy là đủ cho
    mọi UI hiện có; 20 lớp đã kết thúc (MOCK_HISTORICAL_CLASSES) không
    component nào đọc, nên chỉ trả kèm khi client tự truyền
    ?status=completed.

-   Scope --- GV chỉ thấy lớp có classId nằm trong classIds của mình;
    Lead thấy mọi lớp cùng khoiId. Lọc ở server, không trả hết rồi để
    LeadDashboard tự filter bằng JS như hiện tại.

-   Response --- ClassSummary\[\], nguyên trạng interface trong
    types.ts.

-   Quy tắc nghiệp vụ --- healthMetrics.isAlarmTriggered (cờ
    moc_bao_dong) phải tính sẵn ở server theo công thức đã verify trong
    ARCHITECTURE.md (pct Xám + pct Đỏ \>= 40%), không để frontend tự
    cộng lại.

## GET /classes/{classId}/students

**Mục tiêu --- roster đầy đủ của một lớp: nguồn duy nhất cho
StudentTable, ZaloRemindModal, và 3 chỉ số ĐH/BTVN/Pass ở sidebar khi
lớp đó đang được chọn.**

-   Tham số --- classId (path).

-   Scope --- GV gọi cho classId ngoài classIds của mình → 403. Lead gọi
    được cho bất kỳ lớp nào trong khối mình.

-   Response --- StudentDetail\[\], toàn bộ 6 nhóm field lồng nhau:
    attendance, homework, testPerformance, labeling, evaluation,
    portalEvidence.

-   Cần chốt trước khi implement --- roster có gồm cả HV on_hold,
    dropped, transferred hay chỉ active? Docstring của mockData.ts ghi
    \"\~270 học viên đang học\", gợi ý dữ liệu mock đã lọc sẵn theo
    active, nhưng registrationStatus vẫn có 4 giá trị --- chỗ này mơ hồ
    thật, không suy đoán được từ code frontend, phải hỏi lại nghiệp vụ.

## GET /snapshots

**Mục tiêu --- nguồn duy nhất cho toàn bộ tầng phân tích xu hướng của
Lead Dashboard: ContextBar (chọn kỳ báo cáo), KpiRow (delta so kỳ
trước), 2 TrendChart (vận hành + kết quả), và điểm rủi ro theo lớp.**

-   Tham số --- khoiId (lấy mọi lớp trong khối 1 lần, vì Lead Dashboard
    tính aggregateKhoi trên toàn bộ snapshot của khối chứ không phải
    từng lớp riêng lẻ). Có thể thêm since= sau này để giới hạn cửa sổ
    thời gian; ở quy mô hiện tại (\~1500 dòng/năm) chưa cần.

-   Response --- ClassSnapshot\[\] thô, chưa aggregate, mỗi dòng = 1 lớp
    x 1 tuần.

-   Quy tắc nghiệp vụ bắt buộc --- khi một lớp chưa có HV active hoặc
    chưa thi bài nào, các field liên quan (attendanceAvg, passChuanRate,
    passMemRate\...) phải vắng mặt hoặc null, KHÔNG được trả 0. Nếu
    server trả 0 thay vì thiếu dữ liệu, aggregateKhoi phía client sẽ
    tính sai và kéo tụt số trung bình của cả khối một cách âm thầm ---
    đây là lỗi dễ mắc nhất trong cả bộ API này.

-   Ghi chú --- không lọc theo kỳ báo cáo ở server. Việc cắt theo period
    (listPeriods, latestSnapshotPerClass, cửa sổ 13 tuần) ở lại phía
    client vì logic đã có test và khá tinh vi.

## GET /label-events

**Mục tiêu --- hai nơi dùng: (1) dòng lý do chuyển nhãn khi GV mở rộng
một học viên trong StudentTable, (2) input cho labelFlowInPeriod và
labelFlowDelta ở KPI net momentum của Lead Dashboard.**

-   Tham số --- ?classId= (chế độ 1, StudentTable, 1 lớp) hoặc ?khoiId=
    (chế độ 2, Lead Dashboard, cả khối theo kỳ).

-   Response --- LabelChangeLog\[\].

-   Quy tắc --- read-only tuyệt đối. Log này do label engine (n8n) sinh
    ra mỗi khi tính lại nhãn; không có thao tác nào của GV/Lead ghi vào
    bảng này, nên không có endpoint POST tương ứng.

-   Ghi chú --- severity (recovery/warning/serious/critical) và
    direction phải do server tính từ fromLabel/toLabel/stepCount, giữ
    nguyên logic đã mô tả trong types.ts. Đừng để frontend suy lại.

## GET /contact-logs

**Mục tiêu --- ba chỗ dùng: dấu tick xanh đã liên hệ trên StudentTable,
số đếm remaining/totals ở 3 nút tắt đầu teacher view, và cột Độ phủ liên
hệ % trên Master Table của Lead Dashboard.**

-   Tham số --- ?classId= (teacher view, 1 lớp) VÀ ?khoiId= (Lead
    Dashboard). Master Table gọi coverage cho từng dòng lớp; nếu chỉ có
    ?classId= thì UI sẽ vô tình thành N request cho N lớp mỗi lần Lead
    mở dashboard, nên bắt buộc có chế độ lấy cả khối 1 lần.

-   Response --- ContactLog\[\].

-   Quy tắc nghiệp vụ cốt lõi --- mỗi dòng gắn với checkpoint. Khi lớp
    thi bài mới, checkpoint đổi, episode cũ (gắn checkpoint cũ) hết hiệu
    lực và cảnh báo tự nổi lại mà không cần ai reset cờ thủ công. Nếu
    server filter/join sai theo checkpoint, toàn bộ cơ chế \"tick tự hết
    hạn\" này gãy.

# Nhóm API Ghi (POST)

## POST /contact-logs

**Mục tiêu --- ghi một lượt GV xác nhận đã nhắn Zalo, ứng với nút Đã
nhắn trong ZaloRemindModal / ContactTickButton. Đây là thao tác ghi DUY
NHẤT của toàn bộ teacher view --- nghiệp vụ đã chốt Zalo là kênh duy
nhất, không còn gọi phụ huynh.**

-   Body --- NewContact { studentId, classId, teacherId, channel: zalo,
    trigger, checkpoint }.

-   Response --- 201 + ContactLog vừa tạo (contactId, createdAt do
    server sinh). Client hiện tại không cần dùng lại contactId sau khi
    tạo --- undo match theo 3 khoá khác, không theo id.

-   Câu hỏi mở, chưa có câu trả lời trong code hiện tại --- append-only
    tuyệt đối là chủ đích (client không dedupe khi ghi), nhưng nếu GV
    bấm 2 lần liên tiếp thì server có nên idempotent theo (studentId,
    classId, trigger, checkpoint) hay chấp nhận 2 dòng trùng như bản
    localStorage bây giờ? Cần chốt, không tự suy.

## POST /contact-logs/undo

**Mục tiêu --- gỡ đúng 1 tick vừa bấm nhầm, nút hoàn tác cạnh nút Đã
nhắn.**

-   Body --- { studentId, trigger, checkpoint }. Không có classId ---
    khớp đúng chữ ký removeLog(logs, studentId, trigger, checkpoint)
    hiện tại.

-   Quy tắc nghiệp vụ bắt buộc --- chỉ xoá đúng dòng ở checkpoint hiện
    tại, tuyệt đối không đụng log ở các checkpoint khác: hoàn tác một
    tick vừa bấm không được phép xoá lịch sử liên hệ của những mốc test
    trước.

-   Khác biệt cần cân nhắc so với bản prototype --- bản localStorage
    hiện tại xoá thật (filter khỏi mảng). Nếu chuyển sang backend thật
    và muốn giữ audit trail (ai bấm tick, ai bấm nhầm, lúc nào), nên cân
    nhắc soft-delete (đánh dấu undone_at) thay vì DELETE cứng, để không
    mất dấu vết thao tác của GV.

# Cố tình chưa viết (YAGNI)

Hai nhóm dữ liệu tồn tại trong repo nhưng không nằm trong danh sách trên
--- cố ý, không phải bỏ sót.

-   MOCK_HISTORICAL_CLASSES / MOCK_HISTORICAL_SNAPSHOTS --- generator có
    sinh (dùng làm nền cho tính năng percentile trong tương lai) nhưng
    đã grep xác nhận không component nào đang đọc. Chưa cần endpoint tới
    khi có màn hình dùng thật.

-   GET /reviews, POST /reviews/{id}/decision (Pass mềm) ---
    ReviewCenter.tsx vẫn orphaned, không được mount vào App.tsx. Chỉ cần
    build khi quyết định gắn lại màn này; lúc đó response shape cứ giữ
    nguyên PendingReviewEnriched đã có sẵn field workflow.status /
    teacherDecision / teacherComment.

# Bảng tổng hợp endpoint

Toàn bộ 8 endpoint ở trên, xếp cạnh nhau để rà soát nhanh trước khi bắt
tay implement.

  ----------------------------------------------------------------------------------
  **Endpoint**               **Mục tiêu**           **Scope**   **Ghi chú**
  -------------------------- ---------------------- ----------- --------------------
  **GET /me**                Xác định danh tính,    Mọi user    Nền tảng của mọi
                             vai trò, phạm vi lớp               authorization khác

  **GET /classes**           Class-switcher,        Theo /me    Mặc định chỉ
                             sidebar, Lead                      status=on_going
                             Dashboard                          

  **GET                      Roster 1 lớp:          Theo /me    Cần chốt: có gồm HV
  /classes/{id}/students**   StudentTable,                      on_hold/dropped?
                             ZaloRemindModal                    

  **GET /snapshots**         Trend chart + KPI      Theo /me    Trả null, không trả
                             delta của Lead                     0, khi thiếu mẫu
                             Dashboard                          

  **GET /label-events**      Lý do chuyển nhãn +    Theo /me    Read-only, do label
                             net momentum                       engine sinh ra

  **GET /contact-logs**      Tick đã liên hệ + độ   Theo /me    Hỗ trợ ?khoiId= để
                             phủ liên hệ                        tránh N+1 request

  **POST /contact-logs**     Ghi 1 lượt đã nhắn     teacher     Duy nhất API ghi của
                             Zalo                               teacher view

  **POST                     Gỡ tick nhầm ở đúng    teacher     Cân nhắc soft-delete
  /contact-logs/undo**       checkpoint                         để giữ audit trail
  ----------------------------------------------------------------------------------

# Bước tiếp theo

Tài liệu này mới trả lời câu hỏi API nào cần tồn tại. Trước khi
implement, ba việc sau cần làm trước, theo đúng thứ tự:

-   Chốt các câu hỏi nghiệp vụ còn treo trong tài liệu --- đặc biệt
    roster của GET /classes/{id}/students (mục 3) và chính sách
    idempotent của POST /contact-logs (mục 7).

-   Đo runtime n8n thật (Phase 0 trong research doc 2026-08-04) trước
    khi dựng schema Postgres --- batching, retry, idempotency hiện tại
    chưa có bằng chứng, chỉ có comment TODO trong contactStore.ts.

-   Dựng GET /me và GET /classes trước tiên --- mọi endpoint còn lại phụ
    thuộc vào scope mà hai endpoint này thiết lập.

*Liên hệ: đội kỹ thuật IZONE --- Izone-label-dashboard*
