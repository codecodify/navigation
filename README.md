# 个人导航网站

一个简洁美观的个人网站导航工具，支持分组管理、黑暗模式和管理后台。

## 技术栈

### 核心框架
- **Next.js** 16.2.1 - React 全栈框架
  - https://nextjs.org
- **React** - UI 库
  - https://react.dev

### 数据库
- **Turso** - 边缘 SQLite 数据库
  - https://turso.tech
- **Prisma** 7.5.0 - TypeScript ORM
  - https://prisma.io

### UI 组件
- **Tailwind CSS** 4.x - CSS 框架
  - https://tailwindcss.com
- **shadcn/ui** - 基于 Radix UI 的组件库
  - https://ui.shadcn.com
- **Lucide React** - 图标库
  - https://lucide.dev
- **next-themes** - 主题管理
  - https://github.com/pacocoursey/next-themes

### 开发工具
- **TypeScript** - 类型安全
  - https://www.typescriptlang.org
- **Vercel** - 部署平台
  - https://vercel.com
- **Turso CLI** - Turso 数据库命令行工具
  - https://docs.turso.tech/reference/turso-cli

### 适配器
- **@libsql/client** - libSQL 客户端
  - https://github.com/tursodatabase/libsql
- **@prisma/adapter-libsql** - Prisma Turso 适配器
  - https://github.com/prisma/prisma

## 项目结构

```
navigation/
├── src/
│   ├── app/
│   │   ├── page.tsx           # 前台首页
│   │   ├── layout.tsx         # 根布局
│   │   ├── admin/
│   │   │   ├── page.tsx       # 管理后台
│   │   │   └── login/
│   │   │       └── page.tsx   # 登录页
│   │   └── api/
│   │       ├── categories/     # 分类 API
│   │       ├── links/          # 链接 API
│   │       └── auth/           # 认证 API
│   ├── components/
│   │   ├── ui/                # shadcn/ui 组件
│   │   ├── LinkCard.tsx       # 链接卡片
│   │   ├── CategorySection.tsx # 分组区块
│   │   └── ThemeToggle.tsx    # 主题切换
│   ├── lib/
│   │   ├── db.ts              # Prisma 客户端
│   │   ├── auth.ts            # 认证逻辑
│   │   └── utils.ts           # 工具函数
│   └── generated/
│       └── prisma/            # Prisma 生成代码
├── prisma/
│   ├── schema.prisma          # 数据库 schema
│   └── dev.db                 # 本地 SQLite 数据库
└── .env                       # 环境变量
```

## 功能特性

- ✅ 分组展示网站链接
- ✅ 链接卡片显示图标和描述
- ✅ 响应式布局（桌面/平板/手机）
- ✅ 浅色/深色模式切换
- ✅ 管理后台（密码保护）
- ✅ 分类增删改
- ✅ 链接增删改
- ✅ Turso 边缘数据库

## 快速开始

### 安装依赖

```bash
npm install
```

### 配置环境变量

创建 `.env` 文件：

```env
DATABASE_URL="https://your-database.turso.io"
TURSO_AUTH_TOKEN="your-auth-token"
ADMIN_PASSWORD="your-password"
```

### 本地开发

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
npm start
```

## 部署到 Vercel

### 1. 安装 Vercel CLI

```bash
npm install -g vercel
```

### 2. 登录 Vercel

```bash
vercel login
```

### 3. 添加环境变量

```bash
vercel env add DATABASE_URL production
vercel env add TURSO_AUTH_TOKEN production
vercel env add ADMIN_PASSWORD production
```

### 4. 部署

```bash
vercel --prod
```

## 数据库配置

### Turso 数据库

1. 访问 https://app.turso.tech 注册账号
2. 创建新数据库
3. 获取数据库 URL 和 Auth Token
4. 在 Vercel 中配置环境变量

### 本地 SQLite 开发

```bash
# 安装 Turso CLI (macOS)
brew install turso-cli

# 登录
turso auth login

# 创建本地数据库
turso db create navigation

# 打开 shell
turso db shell navigation
```

## 管理后台

- 地址：`/admin`
- 默认密码：`admin123`

请在部署后及时修改密码！

## API 接口

### 分类

- `GET /api/categories` - 获取所有分类
- `POST /api/categories` - 创建分类
- `PUT /api/categories/[id]` - 更新分类
- `DELETE /api/categories/[id]` - 删除分类

### 链接

- `GET /api/links` - 获取所有链接
- `POST /api/links` - 创建链接
- `PUT /api/links/[id]` - 更新链接
- `DELETE /api/links/[id]` - 删除链接

### 认证

- `POST /api/auth/login` - 登录
- `POST /api/auth/logout` - 登出
- `GET /api/auth/check` - 检查登录状态

## 许可证

MIT
