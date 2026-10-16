# HÀNH TRÌNH KHÁM PHÁ ĐỀN THỜ NGUYỄN XÍ
> **Di tích quốc gia đặc biệt – xã Đông Lộc, tỉnh Nghệ An**  
> (Quyết định số 2280/QĐ-TTg ngày 31/12/2020 của Thủ tướng Chính phủ)

---

## 1. GIỚI THIỆU DỰ ÁN

Ứng dụng học tập trực tuyến **"Hành Trình Khám Phá Đền Thờ Nguyễn Xí"** được xây dựng nhằm giúp người học khám phá lịch sử, nhân vật lịch sử, kiến trúc cổ, giá trị văn hóa và ý nghĩa giáo dục của di tích thông qua việc đọc tư liệu chuẩn xác, tham quan không gian thực tế ảo 360°, giải câu hỏi tương tác 6 dạng và tham gia Đấu trường trí tuệ.

### Các Phân Hệ Chính:
1. **Tìm hiểu di tích**: 7 chủ đề lịch sử biên soạn cô đọng, kèm sơ đồ tư duy tương tác và trích dẫn nguồn Cục Di sản văn hóa.
2. **Tham quan 360°**: Mở không gian thực tế ảo chính thức của VNPT Nghệ An (`https://vr3d.com.vn/vnpt-na/8/dennguyenxi/`), có sổ tay quan sát và ghi nhận hoàn thành (+3 điểm).
3. **Câu hỏi tương tác**: Ngân hàng 32 câu hỏi chuẩn lịch sử với đầy đủ 6 dạng (Trắc nghiệm đơn, Trắc nghiệm nhiều lựa chọn, Sắp xếp thứ tự thời gian, Điền từ còn thiếu, Kéo thả từ vào câu, Ghép cặp đôi).
4. **Đấu trường trí tuệ**: 5 vòng thi tính giờ hào hùng, hiệu ứng âm thanh cổ truyền, pháo hoa ăn mừng và huy hiệu vinh danh *Hộ Thần Di Tích Quốc Gia*.
5. **Bảng xếp hạng toàn quốc**: Đồng bộ dữ liệu trực tiếp từ máy chủ, xếp hạng theo điểm số, độ chính xác và thời gian học tập chủ động, hiển thị tên viết tắt an toàn.

---

## 2. KIẾN TRÚC HỆ THỐNG

```
Frontend (React 19 + TypeScript + Vite + Tailwind CSS)
            │
            ▼  (Gọi API nội bộ /api/*)
Vercel Serverless Functions / Node Express (server.ts)
  • Kiểm tra câu trả lời dựa trên đáp án chuẩn bí mật phía máy chủ
  • Kiểm tra số lần thử (tối đa 2 lần: Lần 1 = +10đ, Lần 2 = +5đ)
  • Chống cộng điểm trùng bằng mã giao dịch duy nhất (Idempotency)
  • Ghi nhận thời gian học thực tế qua Heartbeat định kỳ 30 giây
            │
            ▼  (Xác thực qua SHARED_SECRET)
Google Apps Script Web App (google-apps-script/Code.gs)
  • Đồng bộ LockService chống xung đột ghi đồng thời
            │
            ▼
Google Sheets (Cơ sở dữ liệu đám mây 6 Sheets)
```

---

## 3. HƯỚNG DẪN THIẾT LẬP GOOGLE SHEETS & GOOGLE APPS SCRIPT

### Bước 1: Tạo Google Spreadsheet
1. Truy cập [Google Sheets](https://sheets.new) và tạo một trang tính mới.
2. Đặt tên trang tính: **`HeThong_HocTap_DenTho_NguyenXi`**.
3. Sao chép **Spreadsheet ID** từ thanh địa chỉ trình duyệt:
   `https://docs.google.com/spreadsheets/d/`**`[SPREADSHEET_ID_CUA_BAN]`**`/edit`.

### Bước 2: Dán mã nguồn Google Apps Script
1. Trên Google Sheets, chọn menu **Tiện ích mở rộng (Extensions)** → **Apps Script**.
2. Xóa nội dung mặc định và dán toàn bộ mã nguồn từ tệp **`google-apps-script/Code.gs`** trong dự án vào trình soạn thảo.
3. Nhấn nút **Lưu (Save)**.

### Bước 3: Cấu hình Khóa bí mật (Script Properties)
1. Trong màn hình Apps Script, chọn biểu tượng **Cài đặt dự án (Project Settings - hình bánh răng)** ở thanh bên trái.
2. Cuộn xuống phần **Thuộc tính tập lệnh (Script Properties)** và nhấn **Thêm thuộc tính tập lệnh**:
   - Thuộc tính 1:
     * **Property**: `SPREADSHEET_ID`
     * **Value**: Dán mã Spreadsheet ID đã lấy ở Bước 1.
   - Thuộc tính 2:
     * **Property**: `SHARED_SECRET`
     * **Value**: Nhập chuỗi bí mật của bạn (ví dụ: `nguyen_xi_heritage_secret_key_2026`).
3. Nhấn **Lưu các thuộc tính tập lệnh**.

### Bước 4: Triển khai Web App (Deploy)
1. Ở góc trên bên phải màn hình Apps Script, nhấn nút **Triển khai (Deploy)** → **Triển khai mới (New deployment)**.
2. Chọn loại: **Ứng dụng web (Web app)**.
3. Điền cấu hình bắt buộc:
   - **Mô tả**: *Phiên bản Backend 1.0 Đền thờ Nguyễn Xí*
   - **Thực thi dưới dạng (Execute as)**: **`Tôi (Me - email của bạn)`**
   - **Ai có quyền truy cập (Who has access)**: **`Bất kỳ ai (Anyone)`** *(Quan trọng để Vercel API có thể gửi dữ liệu)*
4. Nhấn **Triển khai (Deploy)**. Cấp quyền truy cập cho tài khoản Google nếu được yêu cầu.
5. Sao chép **URL ứng dụng web (Web app URL)** (có dạng `https://script.google.com/macros/s/.../exec`).

### Bước 5: Tự động khởi tạo 6 Sheets
Trong trình soạn thảo Apps Script, tại thanh công cụ chọn hàm **`initSpreadsheet`** và nhấn nút **Chạy (Run)**. Hệ thống sẽ tự động tạo đủ 6 Sheet:
- `Students`: Lưu thông tin học sinh và tên hiển thị an toàn.
- `Sessions`: Lưu phiên làm việc và thời gian học chủ động.
- `Attempts`: Lưu từng lượt nộp bài, câu hỏi và điểm số.
- `ActivityEvents`: Lưu hoạt động hoàn thành chủ đề, tham quan 360°, đấu trường.
- `Scores`: Lưu tổng điểm và xếp hạng đã xác thực.
- `Config`: Lưu tham số cấu hình.

---

## 4. CẤU HÌNH BIẾN MÔI TRƯỜNG & CHẠY DỰ ÁN

### 1. Trên môi trường phát triển (Local / AI Studio)
Tạo tệp `.env` dựa trên `.env.example`:
```env
APPS_SCRIPT_URL="https://script.google.com/macros/s/AKfycbx.../exec"
APPS_SCRIPT_SECRET="nguyen_xi_heritage_secret_key_2026"
```

Cài đặt gói và khởi chạy:
```bash
npm install
npm run dev
```
Ứng dụng sẽ chạy tại: `http://localhost:3000`.

### 2. Triển khai lên Vercel
1. Đẩy mã nguồn lên kho lưu trữ GitHub/GitLab.
2. Đăng nhập Vercel và chọn **Import Project**.
3. Trong phần **Environment Variables**, cấu hình 2 biến:
   - `APPS_SCRIPT_URL`: URL Web App đã tạo ở Bước 4.
   - `APPS_SCRIPT_SECRET`: Khóa bí mật đã tạo ở Bước 3.
4. Nhấn **Deploy**. Vercel sẽ tự động build frontend và mount các Serverless Functions trong thư mục `/api`.

---

## 5. QUY CHẾ ĐIỂM THƯỞNG VÀ BẢO MẬT

- **Hoàn thành 1 chủ đề tìm hiểu**: +2 điểm (chỉ tính một lần cho mỗi chủ đề).
- **Hoàn thành nhiệm vụ tham quan 360°**: +3 điểm (ghi nhận một lần duy nhất).
- **Trả lời đúng ngay lần đầu**: +10 điểm.
- **Trả lời đúng ở lần thứ hai**: +5 điểm.
- **Trả lời sai cả hai lần**: 0 điểm, tự động mở đáp án chuẩn và lời giải thích.
- **Vượt qua mỗi vòng Đấu trường**: +5 điểm.
- **Chinh phục cả 5 vòng Đấu trường**: +10 điểm vinh danh.
- **Mã giao dịch chống trùng**: Mỗi thao tác gửi kèm `transactionId`, ngăn chặn việc spam nút bấm hoặc reload làm sai lệch điểm số.

---

## 6. NGUỒN TƯ LIỆU THAM KHẢO CHÍNH THỨC
- **Cục Di sản văn hóa – Bộ Văn hóa, Thể thao và Du lịch**: [Lăng mộ và Đền thờ Nguyễn Xí, tỉnh Nghệ An](https://dsvh.gov.vn/lang-mo-va-den-tho-nguyen-xi-tinh-nghe-an-3309)
- **Cổng thông tin Du lịch Nghệ An**: [Điểm tham quan Lăng mộ và Đền thờ Nguyễn Xí](https://visitnghean.gov.vn/diem-tham-quan/lang-mo-va-den-tho-nguyen-xi)
- **Lễ hội truyền thống Đền thờ Nguyễn Xí**: [Lễ hội Đền thờ Nguyễn Xí](https://visitnghean.gov.vn/su-kien/le-hoi-den-tho-nguyen-xi.html)
- **Không gian VR3D thực tế ảo**: [VNPT Nghệ An Tour 360 Đền Nguyễn Xí](https://vr3d.com.vn/vnpt-na/8/dennguyenxi/)
