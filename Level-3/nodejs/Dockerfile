# Sử dụng hình ảnh gốc node
FROM node:18

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json (nếu có) vào thư mục làm việc
COPY app/package.json .

# Cài đặt các gói phụ thuộc
RUN npm install express
RUN npm install node-forge
RUN npm install buff
RUN npm install body-parser

# Sao chép toàn bộ mã nguồn ứng dụng vào thư mục làm việc
COPY app .

# Mở cổng 3000 để truy cập ứng dụng
EXPOSE 80

# Khởi chạy ứng dụng Node.js
CMD [ "node", "index.js" ]
