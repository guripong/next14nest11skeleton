//src/nextjs/next.config.js
/** @type {import('next').NextConfig} */
const { version } = require('../../package.json'); // 루트 기준 경로
const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  // experimental: {
  //   appDir: true, // ✅ App Router 활성화 (기본값이지만 명시적으로 설정)
  // },
  // distDir:".next",
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.readerseye.com',
        pathname: '/images/**',
      },
    ],
    domains: ['cdn.readerseye.com'], // ✅ 허용할 외부 이미지 도메인 추가
  },
  // trailingSlash:false,
  output: 'standalone', // ✅ NestJS에서 실행할 수 있도록 standalone 모드 사용
  // distDir:"../../.next"
  distDir: isDev ? '../../.next' : '../../dist/nest/.next',
  // ✅ Next.js가 `src/nextjs/` 내부에서 실행되도록 설정
  // ✅ CSS 최적화 활성화
  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig;
