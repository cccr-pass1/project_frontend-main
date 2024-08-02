# Node.js 기반 이미지 선택
FROM node:14

# 작업 디렉토리 설정
WORKDIR /app

# 필요한 사용자와 그룹 추가
RUN groupadd -r app && useradd -r -g app app

# 패키지 파일 복사 및 의존성 설치
COPY package*.json ./
RUN npm cache clean --force
RUN rm -rf node_modules
RUN npm install

# 애플리케이션 소스 복사
COPY . .

# 소유권 변경
#RUN chown -R app:app /app

# 사용자 변경 (권장)
#USER app



# 애플리케이션 빌드
RUN npm run build

# 빌드 결과물을 서버에서 제공 (예: Nginx)
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
