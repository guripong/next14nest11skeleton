# ================================
# 1. Build Stage
# ================================
FROM node:20-alpine AS builder

WORKDIR /app

# 의존성 설치
COPY package*.json ./
RUN npm ci

# 소스 복사
COPY . .

# Nest + Next build
RUN npm run buildDocker

# ================================
# 2. Production Stage
# ================================
FROM node:20-alpine

# 필요한 모듈만 다시 설치 (프로덕션)
WORKDIR /app
# 환경변수 미리 설정
ENV NODE_ENV=production
COPY package*.json ./
#RUN npm install --omit=dev
COPY --from=builder /app/node_modules ./node_modules

# dist, public, .env.production 파일 복사
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./dist/nest/public
COPY --from=builder /app/.env.production ./dist/nest/.env.production
COPY --from=builder /app/src/pageList.json ./dist/nest/src/pageList.json

# ✅ 불필요한 nextjs 빌드 산출물 제거
RUN rm -rf ./dist/nest/src/nextjs

# expose port
# export NODE_ENV=production
EXPOSE 4000

# NestJS 실행 (main.js 기준)
CMD ["node", "dist/nest/src/main.js"]
