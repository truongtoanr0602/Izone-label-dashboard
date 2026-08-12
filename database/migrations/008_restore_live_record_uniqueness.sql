-- Khôi phục ràng buộc "1 dòng / HV / lớp / ngày" cho DỮ LIỆU LIVE.
--
-- Migration 007 drop uq_student_record và thay bằng
-- uq_student_stage (student_id, class_id, snapshot_stage). Trong Postgres,
-- UNIQUE coi mỗi NULL là một giá trị KHÁC NHAU, nên với các dòng live
-- (snapshot_stage IS NULL) constraint đó không chặn gì cả. Hạt của dữ liệu
-- live hiện chỉ sạch nhờ ingestion cẩn thận, không nhờ database.
--
-- Partial unique index chỉ áp lên dòng live, không đụng dòng stage 1..8.

CREATE UNIQUE INDEX IF NOT EXISTS uq_student_record_live
  ON izone.student_daily_records (student_id, class_id, record_date)
  WHERE snapshot_stage IS NULL;
