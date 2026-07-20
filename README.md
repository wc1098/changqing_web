# 东方视野影业官网

基于 Next.js、Payload CMS 与 PostgreSQL 的官网开发框架。

## 本地启动

环境要求：Node.js 20.9+、pnpm 9+、Docker。

```powershell
docker compose -f database/docker-compose.yml up -d postgres
pnpm install
pnpm dev
```

启动后访问：

- Demo 首页：http://localhost:3000
- CMS 后台：http://localhost:3000/admin

首次进入 CMS 后台时，需要创建第一个管理员账号。

## 常用命令

```powershell
pnpm lint
pnpm build
pnpm generate:types
pnpm generate:importmap
docker compose -f database/docker-compose.yml down
```

PostgreSQL 数据保存在本地 `database/data` 目录中，普通的 `docker compose down` 不会删除数据。

## 当前范围

- Payload CMS 管理后台
- PostgreSQL 17 数据库
- 英文、中文、阿拉伯语、土耳其语内容配置
- 阿拉伯语 RTL 后台支持
- 东方视野品牌 Demo 首页

作品库、新闻、客户账号和视频鉴权等业务模型将在后续开发阶段逐步加入。
