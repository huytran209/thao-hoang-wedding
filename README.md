# Thảo Hoàng — bản thử CMS

Nhánh `preview/cms-poc` dùng kiểm tra quản trị nội dung trước khi xây dựng toàn bộ website. Chưa có cấu hình triển khai công khai. Lưu CMS trên nhánh này chỉ chạy kiểm tra build.

## Dùng thử
1. Đăng nhập https://app.pagescms.org bằng tài khoản GitHub của chủ kho.
2. Chỉ cấp quyền cho kho `huytran209/thao-hoang-wedding` nếu có lựa chọn.
3. Chọn kho và nhánh `preview/cms-poc`.
4. Thử thay ảnh máy tính/điện thoại trong **Ảnh đầu trang**, lưu.
5. Thêm một ảnh trong **Thư viện ảnh thử nghiệm**, bật hiển thị rồi lưu; sau đó xóa mục vừa thử (không xóa file ảnh gốc).
6. Sửa số điện thoại trong **Thông tin liên hệ**, lưu; khôi phục số chính thức khi kiểm tra xong.
7. Kiểm tra Actions có build mới thành công. Bản website trực tuyến chưa được kiểm chứng cho đến khi có phê duyệt triển khai.

Ảnh hiện để trống có chủ đích; chỉ dùng ảnh chụp thật có quyền sử dụng. Logo chính thức đang chờ người dùng cung cấp. Không dùng ảnh AI hay video.

## Chạy trên máy
`npm ci`, sau đó `npm run dev` hoặc `npm run build`.

## Tình trạng nghiệm thu
- Đăng nhập CMS: CHƯA KIỂM THỬ
- Thay Hero / thêm và xóa Gallery / sửa điện thoại: CHƯA KIỂM THỬ
- CMS commit kích hoạt Actions: CHƯA KIỂM THỬ
- Triển khai và xác minh trên website: CHƯA THỰC HIỆN

Không đưa dữ liệu thử nghiệm vào nhánh chính. Website chính thức chỉ triển khai sau khi duyệt thiết kế, nội dung và kiểm thử CMS.
