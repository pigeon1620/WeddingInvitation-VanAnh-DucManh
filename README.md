# Wedding Webapp Example

Webapp thiệp cưới tĩnh, có thể chạy local trực tiếp hoặc publish bằng GitHub Pages.

## Cách sửa nội dung

Hầu hết dữ liệu cần đổi nằm trong:

```text
assets/js/config.js
```

Bạn có thể sửa trực tiếp các phần sau:

- `couple.brideName`: tên cô dâu
- `couple.groomName`: tên chú rể
- `dates.weddingDate`: ngày giờ dùng cho countdown
- `dates.coverDate` và `dates.displayDate`: ngày hiển thị trên giao diện
- `images`: ảnh bìa, ảnh cặp đôi, ảnh lời chúc, ảnh cảm ơn
- `story`: các mốc câu chuyện
- `events`: thông tin buổi lễ, địa chỉ, link Google Maps, ảnh bản đồ
- `album`: danh sách ảnh album
- `bank`: thông tin ngân hàng

Ví dụ đổi link bản đồ:

```js
events: [
  {
    title: "Lễ thành hôn - Nhà trai",
    time: "10:00, 20/12/2026",
    address: "123 Đường Hạnh Phúc, Quận 1, TP.HCM",
    mapUrl: "https://maps.google.com/...",
    image: "assets/images/map1.svg",
    imageAlt: "Ảnh nhà trai"
  }
]
```

## Cách sửa ảnh

Đặt ảnh vào:

```text
assets/images/
```

Sau đó sửa đường dẫn trong `assets/js/config.js`.

Ví dụ:

```js
images: {
  cover: "assets/images/cover.jpg",
  couple: "assets/images/couple.jpg",
  gift: "assets/images/gift.jpg",
  thanks: "assets/images/thanks.jpg"
}
```

Ảnh có thể là SVG, JPG, PNG hoặc WebP. Nên dùng đường dẫn tương đối bắt đầu bằng `assets/images/...` để chạy tốt trên GitHub Pages.

## Cách chạy local

Cách đơn giản nhất:

1. Mở file `index.html` bằng Chrome, Edge hoặc Safari.
2. Sửa `assets/js/config.js`.
3. Reload trình duyệt để xem thay đổi.

Nếu muốn test gần giống GitHub Pages hơn, có thể chạy local server:

```powershell
python -m http.server 8000
```

Sau đó mở:

```text
http://localhost:8000
```

## Publish bằng GitHub Pages

1. Push toàn bộ project lên GitHub.
2. Vào repository trên GitHub.
3. Mở `Settings` -> `Pages`.
4. Chọn source là branch `main`, folder `/ (root)`.
5. Lưu lại và chờ GitHub tạo URL.

URL thường có dạng:

```text
https://<username>.github.io/<repository-name>/
```

## Ghi chú RSVP

RSVP hiện lưu bằng `localStorage`, nghĩa là dữ liệu chỉ nằm trên trình duyệt của từng khách. Nếu cần nhận danh sách xác nhận tập trung, nên chuyển form RSVP sang Google Forms, Formspree, Supabase hoặc Firebase.

## Kiểm tra helper cấu hình

Project có một test nhỏ cho helper cấu hình, chạy bằng Windows Script Host:

```powershell
cscript //nologo tests\config-utils.test.js
```
