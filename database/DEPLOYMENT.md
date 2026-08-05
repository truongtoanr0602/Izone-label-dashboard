![1785918310455](image/DEPLOYMENT/1785918310455.png)

# Kế Hoạch Deploy VPS (Production)

Tài liệu này hướng dẫn cách deploy hệ thống database Izone Dashboard lên VPS Production (IP: `160.187.146.127`).

## Yêu cầu chuẩn bị

- Truy cập SSH vào VPS bằng user có quyền sudo.
- VPS đã được cài đặt **Docker** và **Docker Compose**.

---

## Các bước Deploy

### Bước 1: Cấu hình Firewall (UFW) - BẢO MẬT QUAN TRỌNG

Chúng ta sẽ KHÔNG mở port 5432 (Postgres) ra ngoài Internet để tránh bị tấn công brute-force. Chỉ mở port cho SSH và Web/API.

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Cho phép SSH
sudo ufw allow 22/tcp

# Cho phép HTTP/HTTPS (nếu sau này chạy API/Frontend trên cùng VPS)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Bật firewall
sudo ufw enable
```

*Lưu ý:* Nếu bạn cần truy cập Database trực tiếp từ máy local (qua DBeaver), hãy sử dụng **SSH Tunnel** thay vì mở port 5432.

### Bước 2: Clone/Copy source code lên VPS

Copy thư mục `database/` từ máy local lên VPS. Bạn có thể dùng `scp`, `rsync`, hoặc push lên Git rồi pull về VPS.

```bash
scp -r ./database user@160.187.146.127:~/izone-database
```

### Bước 3: Cấu hình biến môi trường

Trên VPS, tạo file `.env` từ `.env.example`:

```bash
cd ~/izone-database
cp .env.example .env
nano .env
```

Đổi mật khẩu `DB_PASSWORD` và `PGADMIN_PASSWORD` thành mật khẩu mạnh, an toàn cho production.

### Bước 4: Khởi chạy Database bằng Docker Compose

Thư mục `migrations/` chứa các file SQL (`001_schema.sql`, `002_seed_data.sql`). Khi container postgres chạy lần đầu tiên, nó sẽ tự động chạy các file `.sql` này để khởi tạo database.

```bash
docker-compose up -d
```

Kiểm tra trạng thái các container:

```bash
docker-compose ps
```

### Bước 5: Truy cập pgAdmin (Tùy chọn)

Nếu bạn giữ service pgadmin trong docker-compose, nó sẽ chạy ở port 5050. Tuy nhiên, vì firewall không mở port 5050, bạn cần tạo SSH Tunnel từ máy local để truy cập:

Chạy lệnh này ở máy local:

```bash
ssh -L 5050:localhost:5050 user@160.187.146.127
```

Sau đó mở trình duyệt ở local: `http://localhost:5050`
Đăng nhập bằng email và password cấu hình trong file `.env`.

---

## Chiến lược Backup (Khuyến nghị)

Nên thiết lập cronjob chạy hàng ngày để backup dữ liệu bằng `pg_dump`.

Tạo file script `backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/path/to/backup"
DATE=$(date +%Y-%m-%d)
docker exec izone_postgres pg_dump -U postgres -d izone_dashboard -F c -f /tmp/db_$DATE.dump
docker cp izone_postgres:/tmp/db_$DATE.dump $BACKUP_DIR/
docker exec izone_postgres rm /tmp/db_$DATE.dump
```

Thêm vào crontab để chạy lúc 2h sáng:

```bash
0 2 * * * /bin/bash /path/to/backup.sh
```
