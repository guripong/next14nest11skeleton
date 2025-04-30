# 🛡️ NestJS 11 + Next.js 14 Skeleton

> 같은포트 사용으로 편리
> NestJS 위에 Next.js 14가 얹혀진 구조로  
> 👉 프론트는 Next.js에서 페이지 제공하고, 그 외 모든 API는 Nest.js에서 처리합니다.

```
         🔵 Client (브라우저 요청)
                    │
                    ▼
          ┌───────────────────────┐
          │      Express.js       │  ← 단일 서버 진입점
          └───────────────────────┘
                    │
         ┌──────────┴──────────┐
         ▼                     ▼
 ┌─────────────────┐     ┌─────────────────┐
 │   Next.js 14    │     │    NestJS 11    │
 │   (App Router)  │     │   (API Layer)   │
 └─────────────────┘     └─────────────────┘
         │                     │
         ▼                     ▼
     📄 SSR/CSR 페이지       🔧 API 처리
     (ex. /login)           (ex. /api/user)
```

> 💡 Next.js에 등록된 페이지는 Next로,  
> 그 외 모든 요청은 NestJS가 처리합니다.  
> 하나의 포트로 구동되며 HTTPS도 지원됩니다.

---

---

## ⚙️ Basic Configuration

- **Node.js Version**: `20.17.0`
- **VSCode 상대경로 자동 import 설정**

  1. `Cmd + Shift + P` → `Preferences: Open Settings (JSON)`
  2. 아래 설정 추가:

  ```json
  "typescript.preferences.importModuleSpecifier": "non-relative"
  ```

- **Recommended VSCode Extensions**
  1. [Prettier - Code Formatter (설치링크)](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
     > 설치 후, 저장할 때 자동 포맷이 되도록 `.vscode/settings.json`이 포함되어 있습니다.
- **Husky 설정 (수동으로 hook 경로가 필요할 경우)**

```bash
git config core.hooksPath .husky
```

- **구동방법**

```
npm run start:dev #개발실행 .env.xx 파일에 포트지정
npm run doc # api라우팅에 따른 문서 생성
```

### ✅ [Backend] Nest.js API 문서 요약

📘 간략한 전체 API 목록은 아래 문서를 참고하세요.  
👉 [📚 `docs/api-summary.md`](./docs/api-summary.md)

---
