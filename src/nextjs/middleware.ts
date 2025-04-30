//src/nextjs/middleware.ts
// import { getCookieDomain } from '@/common/utils/cookies';
// import { generateCsrfToken } from '@/common/utils/csrf';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// async function a(){
//     return new Promise(function(resolve){
//         setTimeout(function(){
//             resolve(true);
//         },4000);

//     })
// }

export async function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.next();
  }

  await Promise.resolve(); // async라서 일단 린트통과할려고 추가

  //로그인 아닌경우 기본적으로 넘겨버림림
  const response = NextResponse.next();
  //del_rsid 쿠키값있으면
  // rsid 쿠키 삭제 추가
  // const host = req.nextUrl.hostname; // 요청된 도메인 확인
  // console.log("host 확인:", host);
  // const cookieDomain = getCookieDomain(host);

  // // ✅ `del_rsid` 쿠키가 존재하면 `rsid` 쿠키 삭제
  // const delRsid = req.nextUrl.searchParams.get('del_rsid');
  // if (delRsid) {
  //   console.log('🔴 `del_rsid` 파라미터 감지됨! `rsid` 쿠키 삭제 처리.');
  //   // response.cookies.delete("rsid");
  //   response.cookies.set('rsid', '', {
  //     maxAge: 0, // 즉시 삭제
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV === 'production',
  //     sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  //     domain: cookieDomain,
  //     path: '/',
  //   });
  // }

  // console.log('@@@@@@@@@@@@@@@@@cookieDomain', cookieDomain);

  // // ✅ HMAC 서명된 CSRF 토큰 생성
  // const csrfToken = await generateCsrfToken();
  // // ✅ `nestjs`와 동일한 쿠키 설정 적용
  // response.cookies.set('csrf_token', csrfToken, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === 'production' ? true : false, // HTTPS 환경일 때만 Secure 적용
  //   sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // localhost에서는 'Lax'
  //   domain: cookieDomain, // 도메인 설정 추가
  //   path: '/',
  //   maxAge: 3600,
  // });

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
