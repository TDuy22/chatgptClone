# Bước 1: Build ứng dụng
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Bước 2: Serve ứng dụng với Nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
# Nếu bạn có file cấu hình nginx riêng
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]