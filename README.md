### 🇰🇷 [README (한국어 버전)](./READMEKR.md)

# 🛡️ NestJS 11 + Next.js 14 Fullstack Skeleton

> A fullstack monorepo boilerplate powered by **NestJS 11** and **Next.js 14 (App Router)**  
> Everything runs on **the same Express server** — unified port, seamless SSR + API support.

---

## ⚙️ Basic Configuration

- **Node.js Version**: `20.17.0`
- **Package Manager**: `npm` (v9+)

---

## 🛠️ Features

- ✅ **Next.js App Router** fully integrated with NestJS
- ✅ **Unified server** on a single port using Express as the base
- ✅ **API-first architecture** — NestJS handles all backend logic
- ✅ **CSR/SSR rendering** supported by Next.js
- ✅ **Pre-configured Husky + lint-staged + Prettier**
- ✅ Local HTTPS support via self-signed certs (`cert/localhost/`)
- ✅ Auto-generates API route documentation with `npm run doc`

---

## 🚀 Folder Structure (Simplified)

```
📂 src/
├── nextjs/       # Next.js App Router
├── modules/      # NestJS feature modules
├── common/       # Shared DTOs, types, exceptions
├── main.ts       # Unified bootstrap
```

> 💡 The app is **Express-first** — NestJS and Next.js are both mounted on top of Express.

---

## 🧩 Development Setup

```bash
# Install dependencies
npm install

# Start the server in development mode
npm run start:dev
```

> ℹ️ Make sure to define your port in `.env.development`:
>
> ```env
> PORT=4000
> ```

---

## 🧪 HTTPS Setup (optional but recommended)

You can use a **self-signed SSL certificate** stored in:

```
cert/localhost/cert.crt
cert/localhost/cert.key
```

Once you install the `cert.crt` file on your OS as a **trusted root certificate**,  
you can access your local server via:

```
https://localhost:4000
```

> ✅ This avoids "insecure site" warnings and allows for local cookie/auth testing under HTTPS.

---

## 📚 API Documentation

To generate a route summary based on your current routing structure:

```bash
npm run doc
```

Then see the output here:  
👉 [`docs/api-summary.md`](./docs/api-summary.md)

---

## 🧠 VSCode Developer Tips

For clean import paths:

```json
// Preferences → Open Settings (JSON)
"typescript.preferences.importModuleSpecifier": "non-relative"
```

Also install this extension:

- [Prettier - Code Formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

> ✅ `.vscode/settings.json` is already included to auto-format on save.

---

## 🔐 Git Hooks

```bash
# If hooks are not working:
git config core.hooksPath .husky
```

---

## ✨ Scripts Summary

| Command             | Description                         |
| ------------------- | ----------------------------------- |
| `npm run start:dev` | Start dev server with HTTPS + watch |
| `npm run build`     | Production build (Nest + Next)      |
| `npm run format`    | Prettier format all code            |
| `npm run lint`      | ESLint + Prettier check             |
| `npm run doc`       | Generate API summary doc            |

---

## 🧾 License

UNLICENSED — For internal or private use only.
