console.log(`🔵 NODE_ENV: ${process.env.NODE_ENV}`);
import { v4 as uuidv4 } from 'uuid';
(global as { SERVER_UUID?: string }).SERVER_UUID = uuidv4();
import dotenv from 'dotenv';
import path, { join } from 'path';

// ✅ 프로젝트 루트에서 .env 파일 로드

const dev = process.env.NODE_ENV?.includes('dev');
const envFile = dev ? '.env.development' : 'dist/nest/.env.production'; // ⬅️ 요렇게 명시적으로 경로 지정해보자
dotenv.config({ path: path.resolve(process.cwd(), envFile) });
console.log('✅ .env 파일 로드 완료');

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import express, { Router } from 'express';
import next from 'next';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
// import path, { join } from "path";
import fs from 'fs';
import https from 'https';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from '@/globalException';
import type { NextServer } from 'next/dist/server/next';
// ✅ 서버 실행
const PORT = process.env.PORT || 4000;
function getAllNextPages(dir: string, baseUrl = ''): string[] {
  let pages: string[] = [];

  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    const relativePath = path.join(baseUrl, file).replace(/\\/g, '/');

    if (fs.statSync(filePath).isDirectory()) {
      // ✅ 폴더이면 재귀적으로 탐색
      pages = pages.concat(getAllNextPages(filePath, relativePath));
    } else if (file === 'layout.tsx') {
      // ✅ layout.tsx는 제외
      return;
    } else if (file === 'page.tsx') {
      // ✅ page.tsx만 라우트로 등록
      let route = relativePath.replace('/page.tsx', '');
      if (route === '') route = '/'; // 루트(index) 페이지
      pages.push(route);
    }
  });

  return pages;
}

async function bootstrap() {
  try {
    const server = express();
    console.log('🟢 Express 서버 생성 완료');
    // ✅ Next.js 앱 초기화 (dev 모드 포함)
    // console.log(`🟡 현재 __dirname: ${__dirname}`);
    console.log('빌드후경로확인용', join(process.cwd(), 'dist/nest'));
    const nextApp: NextServer = next({
      dev: dev,
      dir: dev ? join(process.cwd(), 'src/nextjs') : join(process.cwd(), 'dist/nest'), // ✅ Next 실행 경로를 dist/next로 변경
    });

    await nextApp.prepare();
    const nextHandler = nextApp.getRequestHandler();
    console.log('🟢 Next.js 준비 완료');

    // ✅ Express 미들웨어 적용
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));
    server.use(cookieParser());

    /** static 경로 설정 */
    // server.use(express.static(path.join(__dirname, '../', 'public')));
    // server.use(express.static(path.join(process.cwd(), "public"))); // ✅ 정적 파일 제공
    // ✅ static 경로 설정 (dev/prod 분기)
    const publicPath = dev
      ? path.join(process.cwd(), 'public')
      : path.join(process.cwd(), 'dist/nest/public');

    console.log('✅ static 경로 확인:', publicPath);
    server.use(express.static(publicPath));

    server.use(morgan('dev'));
    server.set('trust proxy', true); // ✅ 요거 추가!

    // ✅ NestJS를 Express 미들웨어로 등록
    const nestRouter = Router();

    const nestApp = await NestFactory.create<NestExpressApplication>(
      AppModule,
      new ExpressAdapter(nestRouter),
    );

    nestApp.useGlobalFilters(new GlobalExceptionFilter());
    // nestApp.use(cookieParser());

    // ✅ CORS 설정
    if (dev) {
      nestApp.enableCors({
        origin: ['https://localhost:4000'], // ✅ Next.js와 동일한 포트 사용
        credentials: true, // ✅ 쿠키 기반 인증 활성화
        exposedHeaders: ['Set-Cookie'],
      });
    } else {
      nestApp.enableCors({
        origin: ['https://dev-auth.checkreading.com', 'https://auth.checkreading.com'], // ✅ Next.js와 동일한 포트 사용
        credentials: true, // ✅ 쿠키 기반 인증 활성화
        exposedHeaders: ['Set-Cookie'],
      });
    }
    console.log('🟢 CORS 설정 완료');

    // Swagger 설정 (dev 환경에서만 활성화)
    if (dev) {
      const config = new DocumentBuilder()
        .setTitle('OAuth 2.0 API')
        .setDescription('OAuth 2.0 인증 서버를 위한 API 문서')
        .setVersion('1.0')
        .addTag('auth')
        .build();

      const document = SwaggerModule.createDocument(nestApp, config);
      SwaggerModule.setup('/api-docs', nestApp, document);
      fs.writeFileSync('./swagger-spec.json', JSON.stringify(document, null, 2));
      //덮어쓰기로 해줘라!
      console.log('🟢 Swagger 활성화 완료 (dev 환경)');
    } else {
      console.log('⚪ Swagger는 dev 환경에서만 활성화됩니다.');
    }

    console.log('@@@@@@@@@@@@@nestApp init 전');
    await nestApp.init();
    console.log('🟢 Nest.js 준비 완료');

    server.get('/_next/*', (req, res) => {
      return nextHandler(req, res);
    });

    // ✅ Next.js 페이지 목록을 가져와서 동적 라우팅 설정
    const pagesDir = path.join(process.cwd(), 'src/nextjs/app/(pages)');
    const pageRoutes: string[] = dev
      ? getAllNextPages(pagesDir)
      : (JSON.parse(fs.readFileSync(path.join(__dirname, 'pageList.json'), 'utf-8')) as string[]);

    // console.log("pageRoutes", pageRoutes);
    for (const route of pageRoutes) {
      console.log(`🟡 Next.js 페이지 라우트 등록: ${route}`);
      server.get('/' + route, (req, res) => {
        return nextHandler(req, res); // ✅ Promise 명시적으로 무시
      });
    }
    // pageRoutes.forEach((route) => {
    //   console.log(`🟡 Next.js 페이지 라우트 등록: ${route}`);
    //   server.get('/' + route, (req, res) => {
    //     void nextHandler(req, res);
    //   });
    // });
    //page들은 nextjs 로 보냄

    server.all('*', (req, res, next) => {
      // console.log("허허허")
      console.log('요청 URL →', req.url);
      // return nextHandler(req, res);
      return nestRouter(req, res, next);
    });
    //모든 그외에 nestjs 로 보냄

    if (dev) {
      if (!process.env.SSL_KEY_PATH || !process.env.SSL_CERT_PATH) {
        throw new Error('SSL_KEY_PATH or SSL_CERT_PATH is not set in environment variables.');
      }
      const sslOptions = {
        key: fs.readFileSync(process.env.SSL_KEY_PATH),
        cert: fs.readFileSync(process.env.SSL_CERT_PATH),
      };
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      const httpsServer = https.createServer(sslOptions, server);
      console.log('🟢 개발 환경에서 HTTPS 적용됨');

      httpsServer.listen(PORT, () => {
        console.log(`🔵 Server UUID: ${global.SERVER_UUID}`);
        console.log(`🚀 Application is running on: https://localhost:${PORT}`);
      });
      //개발의 경우
    } else {
      server.listen(PORT);
      console.log(`🔵 Server UUID: ${global.SERVER_UUID}`);
      console.log(`🚀 Application is running on: http://localhost:${PORT}`);
      //운영의 경우
    }

    process.on('uncaughtException', error => {
      console.error('❌ Uncaught Exception 발생:', error);
    });

    process.on('unhandledRejection', reason => {
      console.error('❌ Unhandled Rejection 발생:', reason);
    });
  } catch (error) {
    console.error('nest JS 서버 부팅 중 오류 발생', error);
  }
}

bootstrap().catch(err => {
  console.error('bootstrap 실패', err);
});
