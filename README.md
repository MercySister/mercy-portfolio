# Mercy Portfolio

个人简历网站，包含 React/Vite 前端、Express API、PostgreSQL 数据库，以及可选的留言邮件通知。

## 环境要求

- Node.js 22
- pnpm 11
- PostgreSQL

## 安装与构建

```bash
pnpm install
pnpm run build
```

`pnpm run build` 会先根据 `lib/api-spec/openapi.yaml` 生成前后端共享的 API 代码，再执行类型检查和生产构建。

构建产物：

- 前端：`artifacts/portfolio/dist/public`
- API：`artifacts/api-server/dist/index.mjs`

## 本地开发

先准备数据库并创建表：

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/mercy_portfolio pnpm --filter @workspace/db run push
```

启动 API：

```bash
PORT=8080 DATABASE_URL=postgresql://user:password@localhost:5432/mercy_portfolio pnpm run dev:api
```

另开一个终端启动前端：

```bash
PORT=5173 BASE_PATH=/ API_PROXY_TARGET=http://localhost:8080 pnpm run dev:portfolio
```

访问 `http://localhost:5173`。开发服务器会将 `/api` 请求代理到本地 API。

## 生产环境变量

API 必需：

- `PORT`
- `DATABASE_URL`

留言邮件通知可选：

- `SMTP_USER`
- `SMTP_PASS`
- `NOTIFY_EMAIL`（未设置时使用 `SMTP_USER`）

前端默认按域名根路径构建。只有部署到子路径时才需要设置 `BASE_PATH`。

生产环境需要让域名的 `/api/*` 请求转发到 API 服务，其余请求由前端静态文件处理，并将未知页面路径回退到 `index.html`。
