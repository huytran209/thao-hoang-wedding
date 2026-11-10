# Dịch vụ Tiệc Cưới Thảo Hoàng

Website tiếng Việt dùng Astro, TypeScript và Pages CMS. Bản xem thử dùng nhánh `development`. Bản thử CMS cũ nằm ở `preview/cms-poc`.

## Xem website trên máy tính

Cài Node.js 24 LTS kèm npm. Mở PowerShell trong thư mục dự án, rồi chạy từng lệnh:

```powershell
npm ci
npm run dev
```

Mở [bản xem thử trên máy](http://127.0.0.1:4321/thao-hoang-wedding/). Dừng bằng Ctrl+C. Để kiểm tra bản xuất tĩnh, chạy `npm run build`, sau đó `npm run preview` và mở địa chỉ hiện trong PowerShell.

## Sửa nội dung bằng Pages CMS

1. Sau khi bản mới được phép đưa lên GitHub, mở [Pages CMS](https://app.pagescms.org/) và đăng nhập bằng tài khoản GitHub được cấp quyền với kho. Nếu được hỏi phạm vi cài đặt, chỉ chọn kho `huytran209/thao-hoang-wedding`.
2. Chọn kho rồi kiểm tra tên nhánh là `development` trước mỗi lần lưu. Các lần lưu tạo commit trên nhánh đã chọn. Kho GitHub hiện công khai, nên chỉ tải nội dung đã được phép công bố.
3. Mở **Thông tin liên hệ** để cập nhật số, logo, địa chỉ, Messenger và bản đồ. Số điện thoại dùng 10 chữ số, bắt đầu bằng 0. Messenger dùng liên kết HTTPS của m.me hoặc messenger.com. Bản đồ dùng liên kết HTTPS của Google Maps.
4. Mở **Giới thiệu, dịch vụ, thực đơn và hỏi đáp**. Thêm từng dịch vụ, từng thực đơn và từng món. Dùng nội dung, món ăn và giá đã được xác nhận.
5. Sau khi lưu, mở **GitHub → Actions → Kiểm tra website** và kiểm tra lần chạy gần nhất. Nếu xanh, phần **Artifacts → website-preview** có bản xuất để kiểm tra. Nếu đỏ, mở bước build và đọc thông báo về dữ liệu hoặc đường dẫn ảnh cần sửa.

## Quản lý ảnh thật

- **Ảnh đầu trang** cho phép chọn ảnh ngang trên máy tính và ảnh dọc trên điện thoại. Nếu chỉ có một ảnh, website dùng ảnh đó cho cả hai. Điền mô tả ảnh và chỉnh điểm lấy nét bằng hai giá trị phần trăm như `50% 40%`.
- **Thư viện ảnh** cho phép thêm ảnh, đặt tên, mô tả và thứ tự. Bật **Hiển thị trên website** sau khi xem lại. Để tạm ẩn ảnh, tắt công tắc. Để giữ ảnh gốc cho lần sau, giữ file trong mục Media.
- Dùng JPG, JPEG, PNG hoặc WebP. Giữ file gốc riêng, xuất bản sao WebP đã nén, xóa dữ liệu vị trí GPS nếu có và chỉ tải ảnh đã có quyền sử dụng. Thử khoảng 1600 px cạnh dài cho ảnh đầu trang và 1000–1200 px cho ảnh thư viện. Kiểm tra ảnh và số liên hệ trên điện thoại sau khi lưu.

## Kiểm tra trước khi công bố

- Duyệt chữ, logo, ảnh thật, thực đơn, số liên hệ và các liên kết. Thử điều hướng, bàn phím, mở câu hỏi, xem ảnh và bấm Gọi/Zalo/Messenger trên thiết bị thật.
- Thử lưu trên CMS ở `development`, xác nhận lần build mới chạy và hoàn nguyên dữ liệu dùng thử.
- Khi đã được duyệt, mở pull request từ `development` vào `main` và kiểm tra Actions. Gộp sau khi chủ kho đồng ý.
- Sau khi có phê duyệt xuất bản, dùng quy trình trong [hướng dẫn Astro cho GitHub Pages](https://docs.astro.build/en/guides/deploy/github/). Trong Settings → Pages, chọn GitHub Actions. Tạo workflow triển khai theo tài liệu, ưu tiên kích hoạt thủ công từ `main` cho lần phát hành đầu tiên. Dùng Node 24. Trong bước build chính thức, đặt `PUBLIC_SITE_INDEXABLE: 'true'` để công cụ tìm kiếm có thể lập chỉ mục.
- Cấu hình địa chỉ hiện tại dành cho `https://huytran209.github.io/thao-hoang-wedding/`. Sau khi xuất bản, mở địa chỉ đó và thử lại ảnh, menu, thông tin liên hệ và liên kết trên điện thoại. Nếu đổi sang tên miền riêng, cập nhật `site` và `base` trong `astro.config.mjs` trước khi build lại.

Workflow trong dự án hiện chỉ kiểm tra build. Hướng dẫn cấu hình danh sách và trường dữ liệu nằm trong [tài liệu Pages CMS](https://pagescms.org/docs/configuration/content/).
