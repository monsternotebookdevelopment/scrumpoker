# monster-poker/Dockerfile

# --- Build Aşaması ---
FROM node:18-alpine AS build-stage
WORKDIR /app

# ARG VITE_API_URL <-- Bu satır olmamalı veya yorumlu olmalı
# ENV VITE_API_URL=$VITE_API_URL <-- Bu satır olmamalı veya yorumlu olmalı

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Production Aşaması ---
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]