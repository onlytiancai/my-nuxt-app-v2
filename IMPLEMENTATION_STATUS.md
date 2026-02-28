# 用户端和管理端分离实现状态

**更新时间**: 2026-02-28

## 实现计划与状态检查

### 1. 数据库扩展 ✅ 已完成

#### 1.1 User 模型添加 role 字段
- [x] `prisma/schema.prisma`: 添加 `role String @default("USER")` 字段
- [x] 数据库迁移：`20260228032544_add_role_and_todo`
- [x] Prisma 客户端重新生成

#### 1.2 Todo 模型添加
- [x] `prisma/schema.prisma`: 添加 Todo 模型（id, title, completed, userId, createdAt, updatedAt, dueDate）
- [x] 数据库迁移已完成
- [x] 与 User 模型建立级联删除关系

#### 1.3 Post 模型扩展
- [x] 添加 `createdAt` 和 `updatedAt` 字段
- [x] 数据库迁移：`20260228063411_add_post_timestamps`

---

### 2. 类型定义 ✅ 已完成

#### 2.1 Auth 类型更新
- [x] `shared/types/auth.d.ts`: User 接口添加 `role?: 'USER' | 'ADMIN'` 字段

---

### 3. 认证系统修改 ✅ 已完成

#### 3.1 后端工具函数
- [x] `server/utils/db-auth.ts`: 添加 `isAdmin(userId: number): Promise<boolean>` 函数

#### 3.2 登录 API 更新
- [x] `server/api/auth/login.post.ts`: 在 session 中包含 `role` 字段
- [x] `server/api/auth/register.post.ts`: 在 session 中包含 `role` 字段
- [x] `server/routes/auth/github.get.ts`: OAuth 登录包含 `role` 字段
- [x] `server/routes/auth/google.get.ts`: OAuth 登录包含 `role` 字段

---

### 4. 后端 API 开发 ✅ 已完成

#### 4.1 管理员 API (`/api/admin/*`)
| 端点 | 文件 | 状态 |
|------|------|------|
| GET /api/admin/users | `server/api/admin/users.get.ts` | ✅ |
| GET /api/admin/users/[id] | `server/api/admin/users/[id].get.ts` | ✅ |
| PATCH /api/admin/users/[id] | `server/api/admin/users/[id].patch.ts` | ✅ |
| DELETE /api/admin/users/[id] | `server/api/admin/users/[id].delete.ts` | ✅ |
| GET /api/admin/posts | `server/api/admin/posts.get.ts` | ✅ |

功能说明：
- 用户列表支持分页和搜索
- 可以更新用户角色（USER ↔ ADMIN）
- 删除用户时级联删除相关数据
- 防止管理员删除自己的管理员权限

#### 4.2 用户 API (`/api/user/*`)
| 端点 | 文件 | 状态 |
|------|------|------|
| GET /api/user/todos | `server/api/user/todos.get.ts` | ✅ |
| POST /api/user/todos | `server/api/user/todos.post.ts` | ✅ |
| PATCH /api/user/todos/[id] | `server/api/user/todos/[id].patch.ts` | ✅ |
| DELETE /api/user/todos/[id] | `server/api/user/todos/[id].delete.ts` | ✅ |
| GET /api/user/posts | `server/api/user/posts.get.ts` | ✅ |
| POST /api/user/posts | `server/api/user/posts.post.ts` | ✅ |
| PATCH /api/user/posts/[id] | `server/api/user/posts/[id].patch.ts` | ✅ |
| DELETE /api/user/posts/[id] | `server/api/user/posts/[id].delete.ts` | ✅ |

功能说明：
- Todo 支持分页、过滤（已完成/未完成）
- Post 支持分页、过滤（已发布/草稿）
- 只能操作属于自己的数据（权限检查）

---

### 5. 前端页面结构 ✅ 已完成

#### 5.1 Dashboard 路由选择器
- [x] `app/pages/dashboard/index.vue`: 根据用户角色自动重定向

#### 5.2 管理端页面 (`/dashboard/admin/*`)
| 页面 | 文件 | 状态 |
|------|------|------|
| 管理后台首页 | `app/pages/dashboard/admin/index.vue` | ✅ |
| 用户管理 | `app/pages/dashboard/admin/users.vue` | ✅ |
| 帖子管理 | `app/pages/dashboard/admin/posts.vue` | ✅ |

功能说明：
- 用户管理：查看列表、搜索、修改角色、删除用户
- 帖子管理：查看所有帖子、搜索

#### 5.3 用户端页面 (`/dashboard/user/*`)
| 页面 | 文件 | 状态 |
|------|------|------|
| 用户后台首页 | `app/pages/dashboard/user/index.vue` | ✅ |
| 个人资料编辑 | `app/pages/dashboard/user/profile.vue` | ✅ |
| 待办事项管理 | `app/pages/dashboard/user/todos.vue` | ✅ |
| 帖子管理 | `app/pages/dashboard/user/posts.vue` | ✅ |
| 登录方式管理 | `app/pages/dashboard/user/connections.vue` | ✅ |

功能说明：
- 个人资料：修改密码、管理 OAuth 连接
- Todo: 创建、完成标记、删除、过滤
- Post: 创建、编辑、删除、过滤
- 登录方式：连接/断开 GitHub、Google，设置/修改密码

---

### 6. 种子数据 ✅ 已完成

- [x] `prisma/seed.ts`: 创建测试数据
  - 管理员账户：`admin@example.com` / `admin123`（角色：ADMIN）
  - 普通用户账户：`user@example.com` / `user123`（角色：USER）
  - 示例帖子（4 篇）
  - 示例 Todo（3 个）

---

### 7. 测试环境搭建 ✅ 已完成

#### 7.1 依赖安装
- [x] `vitest` - 单元测试框架
- [x] `@nuxt/test-utils` - Nuxt 测试工具
- [x] `@playwright/test` - E2E 测试框架
- [x] `@vitest/ui` - Vitest UI 报告
- [x] `tsx` - TypeScript 执行器

#### 7.2 配置文件
- [x] `vitest.config.ts` - Vitest 配置
- [x] `playwright.config.ts` - Playwright 配置
- [x] `package.json` - 添加测试脚本：
  ```json
  "scripts": {
    "db:seed": "tsx prisma/seed.ts",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
  ```

---

### 8. 单元测试 ✅ 已完成

| 测试文件 | 覆盖内容 | 状态 |
|----------|----------|------|
| `server/api/auth/login.post.test.ts` | 登录逻辑（无效凭证、参数验证） | ✅ |
| `server/api/auth/register.post.test.ts` | 注册逻辑（参数验证、重复邮箱） | ✅ |
| `server/api/admin/users.test.ts` | 管理员权限验证 | ✅ |
| `server/api/user/todos.test.ts` | Todo API 权限验证 | ✅ |

---

### 9. E2E 测试 ✅ 已完成

| 测试文件 | 覆盖内容 | 状态 |
|----------|----------|------|
| `e2e/auth.spec.ts` | 认证流程（注册、登录） | ✅ |
| `e2e/admin.spec.ts` | 管理员功能（用户管理、帖子管理） | ✅ |
| `e2e/user.spec.ts` | 普通用户功能（Todo、Post CRUD） | ✅ |
| `e2e/permissions.spec.ts` | 权限隔离（跨角色访问限制） | ✅ |

---

## 文件清单

### 后端 API 文件 (14 个)
```
server/api/
├── admin/
│   ├── users.get.ts
│   ├── posts.get.ts
│   └── users/
│       ├── [id].get.ts
│       ├── [id].patch.ts
│       └── [id].delete.ts
└── user/
    ├── todos.get.ts
    ├── todos.post.ts
    ├── todos/[id].patch.ts
    ├── todos/[id].delete.ts
    ├── posts.get.ts
    ├── posts.post.ts
    ├── posts/[id].patch.ts
    └── posts/[id].delete.ts
```

### 前端页面文件 (9 个)
```
app/pages/dashboard/
├── index.vue
├── admin/
│   ├── index.vue
│   ├── users.vue
│   └── posts.vue
└── user/
    ├── index.vue
    ├── profile.vue
    ├── todos.vue
    ├── posts.vue
    └── connections.vue
```

### 测试文件 (8 个)
```
# 单元测试
server/api/auth/login.post.test.ts
server/api/auth/register.post.test.ts
server/api/admin/users.test.ts
server/api/user/todos.test.ts

# E2E 测试
e2e/auth.spec.ts
e2e/admin.spec.ts
e2e/user.spec.ts
e2e/permissions.spec.ts
```

### 配置文件 (5 个)
```
prisma/schema.prisma
prisma/seed.ts
shared/types/auth.d.ts
vitest.config.ts
playwright.config.ts
```

---

## 验证步骤

### 1. 数据库验证
```bash
pnpm prisma migrate dev --name add_role_and_todo
pnpm db:seed
```

### 2. 管理员功能验证
- [x] 使用 admin@example.com / admin123 登录
- [x] 自动跳转到 /dashboard/admin
- [x] 访问 /dashboard/admin/users 查看用户列表
- [x] 修改用户角色（USER → ADMIN）
- [x] 删除用户

### 3. 普通用户功能验证
- [x] 使用 user@example.com / user123 登录
- [x] 自动跳转到 /dashboard/user
- [x] 访问 /dashboard/user/todos 测试 Todo CRUD
- [x] 访问 /dashboard/user/posts 测试 Post CRUD

### 4. 权限隔离验证
- [x] 普通用户访问 /dashboard/admin 会重定向到 /dashboard/user
- [x] 普通用户调用 /api/admin/users 返回 403

### 5. 测试运行验证
```bash
pnpm test        # 单元测试
pnpm test:e2e    # E2E 测试
```

---

## 总结

**整体实现进度：100%**

所有计划的功能均已实现并通过验证：
- ✅ 数据库模型扩展（User.role, Todo 模型，Post 时间戳）
- ✅ 类型定义更新
- ✅ 认证系统修改（登录/注册/OAuth 包含 role）
- ✅ 管理员 API（5 个端点）
- ✅ 用户 API（8 个端点）
- ✅ 管理端页面（3 个页面）
- ✅ 用户端页面（5 个页面）
- ✅ 种子数据
- ✅ 测试环境
- ✅ 单元测试（4 个文件）
- ✅ E2E 测试（4 个文件）
