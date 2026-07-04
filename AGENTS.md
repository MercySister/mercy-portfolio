# AGENTS.md

本文件适用于仓库根目录及所有子目录。自动化开发工具和后续维护者在修改代码前应先阅读本文件。

## 1. 项目目标

这是 Mercy Mu 的中英双语个人简历网站。维护工作的默认目标是：

- 保持简历内容准确；
- 保持现有票券 / 档案式视觉一致；
- 保持前端、API、数据库和生成类型同步；
- 保证项目可在 Replit 之外独立构建和部署。

## 2. 修改前必读

- `README.md`：安装、运行和环境变量；
- `PRD.md`：产品范围、现有行为和验收标准；
- `STYLE.md`：视觉语言、组件和响应式规范；
- `ARCHITECTURE.md`：系统边界、数据流和代码生成关系。

## 3. 工作原则

### 3.1 先明确再修改

- 明确用户要求、假设和可验证的完成标准。
- 存在多种合理解释时，不要静默选择影响范围更大的方案。
- 多步骤任务先给出简短计划，每一步都应对应验证方式。

### 3.2 保持简单

- 只实现明确要求的功能。
- 不为单次使用创建抽象层。
- 不增加未请求的配置项、依赖或功能。
- 能通过局部修改解决时，不进行全局重构。

### 3.3 保持改动可追溯

- 每个修改行都应能关联到当前任务。
- 不顺手格式化、重命名或清理无关文件。
- 只删除本次修改直接造成的无用代码。
- 发现无关问题时记录或说明，不擅自扩大范围。

### 3.4 完成必须可验证

- 代码任务至少执行相关类型检查或构建。
- Bug 修复应先确认可复现条件，再验证修复后的行为。
- 不以“代码已写完”替代运行结果。

## 4. 仓库规则

### 4.1 包管理与命令

- 只使用 `pnpm`，不要生成 `package-lock.json` 或 `yarn.lock`。
- 安装依赖：`pnpm install`。
- 完整构建：`pnpm run build`。
- 类型检查：`pnpm run typecheck`。
- API 代码生成：`pnpm run codegen`。
- 前端开发：`pnpm run dev:portfolio`。
- API 开发：`pnpm run dev:api`。

### 4.2 API 与生成代码

- `lib/api-spec/openapi.yaml` 是 API 契约的唯一来源。
- 修改接口时，先更新 OpenAPI，再修改服务端实现，然后运行 `pnpm run codegen`。
- 不手工编辑以下生成目录：
  - `lib/api-client-react/src/generated/`
  - `lib/api-zod/src/generated/`
- 前端通过生成的 React Query hooks 调用 `/api`。
- 服务端使用生成的 Zod schema 校验请求和响应。

### 4.3 前端与内容

- 未明确要求重新设计时，不改变现有视觉方向。
- 新增界面遵循 `STYLE.md`，优先复用已有样式类。
- 简历中英文内容应同步维护，不能只修改一个语言版本。
- 当前主要内容位于 `artifacts/portfolio/src/pages/home.tsx` 的翻译数据对象中。
- 不在前端引入新的长期状态库；现有局部状态、Context 和 React Query 已覆盖当前需求。
- 不把密钥、数据库地址或 SMTP 凭据写入前端或提交到仓库。

### 4.4 API 与数据库

- API 统一挂载于 `/api`。
- 数据库 schema 位于 `lib/db/src/schema/`。
- schema 变更后使用明确的 `DATABASE_URL` 在目标环境执行数据库同步。
- 不自动操作生产数据库，不在未授权情况下执行强制 schema push。
- 留言通知失败不应导致已成功入库的留言回滚，除非产品要求发生变化。

### 4.5 部署边界

- 前端是静态 SPA，生产构建位于 `artifacts/portfolio/dist/public`。
- API 是独立 Node.js 服务，构建入口为 `artifacts/api-server/dist/index.mjs`。
- 生产环境必须保证同域 `/api/*` 转发至 API 服务。
- 未知前端路由应回退到 `index.html`。
- 未得到明确授权时，不创建云资源、不修改 DNS、不部署、不发送外部消息。

## 5. 文件修改指引

| 修改类型 | 主要文件 | 必要验证 |
| --- | --- | --- |
| 简历文案 | `artifacts/portfolio/src/pages/home.tsx` | 中英文检查、`pnpm run typecheck` |
| 全局样式 | `artifacts/portfolio/src/index.css` | 响应式视觉检查、`pnpm run build` |
| 页面交互 | `artifacts/portfolio/src/pages/home.tsx` | 交互检查、类型检查、构建 |
| API 契约 | `lib/api-spec/openapi.yaml` | `pnpm run codegen`、完整构建 |
| API 路由 | `artifacts/api-server/src/routes/` | 类型检查、相关接口检查 |
| 数据结构 | `lib/db/src/schema/` | 类型检查、迁移计划、目标数据库验证 |
| 构建配置 | 根目录及各 package 配置 | `pnpm run build` |

## 6. 完成标准

除非任务另有要求，代码变更完成时应满足：

- 相关需求已实现，没有附加功能；
- 生成代码与 OpenAPI 同步；
- 无密钥或个人敏感配置被新增到仓库；
- `pnpm run build` 通过，或明确说明无法执行的外部条件；
- 最终说明包含修改范围、验证结果和剩余风险。

纯文档修改不要求重新构建，但必须检查文档结构、命令和路径是否与当前仓库一致。
