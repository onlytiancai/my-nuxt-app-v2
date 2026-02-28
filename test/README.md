# 测试文档

本目录包含项目的所有测试代码和配置文件。

## 测试结构

按照 [Nuxt 官方文档](https://nuxt.com/docs/getting-started/testing) 推荐的测试结构：

```
test/
├── e2e/                  # E2E 测试（使用 @nuxt/test-utils/e2e）
│   ├── api/              # API 端点测试（Playwright + $fetch）
│   │   ├── auth.test.ts  # 认证 API 测试
│   │   ├── admin.test.ts # 管理员 API 测试
│   │   └── user.test.ts  # 用户资源 API 测试
│   └── browser/          # 浏览器 E2E 测试（Playwright 浏览器自动化）
│       └── auth.test.ts  # 浏览器认证流程测试
├── nuxt/                 # Nuxt 运行时测试（组件、composables）
│   ├── components/
│   │   ├── login.test.ts
│   │   ├── register.test.ts
│   │   └── todos.test.ts
│   └── composables/
└── unit/                 # 纯单元测试（Node 环境）
    └── utils/
        └── helpers.test.ts
```

## 测试命令

```bash
# 运行所有测试
pnpm test

# 运行单元测试（unit + nuxt，不运行 E2E）
pnpm test:unit

# 运行 Nuxt 组件测试
pnpm test:nuxt

# 运行 E2E API 测试（需要构建 Nuxt，约 30-60 秒）
pnpm test:e2e

# 运行浏览器 E2E 测试（需要构建 Nuxt + Playwright）
pnpm test:e2e-browser

# 使用 UI 界面运行测试
pnpm test:ui

# 运行特定测试文件
pnpm vitest test/e2e/api/auth.test.ts

# 监听模式运行测试
pnpm vitest --watch

# 运行匹配的测试（按名称过滤）
pnpm vitest -t "登录"
```

## 测试类型说明

### 单元测试 (Unit Tests)

位置：`test/unit/`

- 纯函数测试
- 工具函数测试
- 不依赖 Nuxt 运行时
- 运行环境：Node.js

### Nuxt 组件测试 (Nuxt Component Tests)

位置：`test/nuxt/`

- Vue 组件测试
- Composables 测试
- 使用 `mountSuspended` 挂载组件
- 使用 `registerEndpoint` 模拟 API
- 运行环境：Nuxt 运行时环境（happy-dom）

### E2E API 测试

位置：`test/e2e/api/`

- API 端点测试
- 使用 `@nuxt/test-utils/e2e` 的 `$fetch` 和 `setup`
- **重要**：`setup()` 必须在 `describe` 块顶部使用 `await` 调用
- **认证**：使用 `globalThis.fetch` 登录获取 Cookie，然后在后续请求中通过 `cookie` 头传递
- **权限测试**：可以测试不同角色（USER、ADMIN）的权限隔离

### E2E 浏览器测试

位置：`test/e2e/browser/`

- 浏览器自动化测试（使用 Playwright）
- 使用 `createPage` 创建浏览器页面
- 使用 `url()` 生成正确的测试 URL
- 模拟真实用户交互（点击、输入、导航）
- **注意**：`setup()` 需要在 `describe` 块顶部使用 `await` 调用

## 测试账户

- 管理员：`admin@example.com` / `admin123`
- 普通用户：`user@example.com` / `user123`

## 编写测试

### 单元测试示例

```typescript
import { describe, it, expect } from 'vitest'

describe('工具函数', () => {
  it('应该返回正确结果', () => {
    const result = someFunction('input')
    expect(result).toBe('expected')
  })
})
```

### Nuxt 组件测试示例

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import MyComponent from '~/components/MyComponent.vue'

describe('我的组件', () => {
  beforeEach(() => {
    registerEndpoint('/api/data', {
      method: 'POST',
      handler: () => ({ data: 'mocked' })
    })
  })

  it('渲染正确', async () => {
    const component = await mountSuspended(MyComponent)
    expect(component.html()).toContain('expected text')
  })
})
```

### E2E API 测试示例

**重要**：按照 Nuxt 官方文档，`setup()` 必须在 `describe` 块顶部使用 `await` 调用：

```typescript
import { describe, it, expect, beforeAll } from 'vitest'
import { $fetch, setup, useTestContext } from '@nuxt/test-utils/e2e'

describe('我的 API', async () => {
  await setup({
    server: true,
    browser: false,
    setupTimeout: 120000,
    build: true,
  })

  let sessionCookie: string = ''

  // 登录获取会话 Cookie
  beforeAll(async () => {
    const ctx = useTestContext()
    const baseUrl = ctx.url || 'http://127.0.0.1:3000'

    const response = await globalThis.fetch(`${baseUrl}api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123',
      }),
    })

    const setCookie = response.headers.get('set-cookie')
    if (setCookie) {
      const match = setCookie.match(/nuxt-session=[^;]+/)
      if (match) {
        sessionCookie = match[0]
      }
    }
  })

  it('应该返回数据', async () => {
    const res = await $fetch('/api/endpoint', {
      headers: { cookie: sessionCookie },
    })
    expect(res.data).toBeDefined()
  })
})
```

**错误示例**（不要这样做）：

```typescript
import { describe, it, expect, beforeAll } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'

describe('我的 API', () => {
  // ❌ 错误：在 beforeAll 中调用 setup()
  beforeAll(async () => {
    await setup({ ... })
  })
})
```

### E2E 浏览器测试示例

使用 Playwright 进行浏览器自动化测试：

```typescript
import { describe, it, expect } from 'vitest'
import { createPage, setup, url } from '@nuxt/test-utils/e2e'

describe('浏览器 E2E 测试', async () => {
  // setup() 必须在 describe 顶部使用 await 调用
  await setup({
    server: true,
    browser: true,
    setupTimeout: 120000,
    build: true,
    browserOptions: {
      type: 'chromium',
    },
  })

  it('登录页面渲染', async () => {
    const page = await createPage(url('/login'))

    // 等待页面加载
    await page.waitForSelector('form', { timeout: 10000 })

    // 填写表单
    await page.fill('input[type="email"]', 'admin@example.com')
    await page.fill('input[type="password"]', 'admin123')

    // 提交表单
    await page.click('button[type="submit"]')

    // 等待导航
    await page.waitForLoadState('networkidle', { timeout: 15000 })

    // 验证跳转
    expect(page.url()).toContain('/dashboard')
  })

  it('UI 组件交互测试', async () => {
    const page = await createPage(url('/register'))
    await page.waitForSelector('form')

    // UCheckbox 组件使用 [role="checkbox"] 选择器
    await page.click('[role="checkbox"]')

    // 验证 checkbox 状态
    const checkbox = await page.$('[role="checkbox"]')
    expect(checkbox).toBeDefined()
  })
})
```

**注意事项**：
- 使用 `url('/path')` 生成正确的测试 URL（不要直接拼接字符串）
- `createPage` 返回 Playwright Page 对象
- UCheckbox 等 UI 组件使用 `role` 属性而非传统 HTML 选择器
- 浏览器测试较慢，建议设置合理的超时时间


### vitest.config.ts

主配置文件，使用 Vitest 多项目配置：

```typescript
import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineConfig({
  test: {
    projects: [
      // 单元测试
      {
        test: {
          name: 'unit',
          include: ['test/unit/**/*.test.ts'],
          environment: 'node',
        },
      },
      // E2E API 测试
      {
        test: {
          name: 'e2e-api',
          include: ['test/e2e/api/**/*.test.ts'],
          environment: 'node',
        },
      },
      // E2E 浏览器测试（Playwright）
      {
        test: {
          name: 'e2e-browser',
          include: ['test/e2e/browser/**/*.test.ts'],
          environment: 'node',
        },
      },
      // Nuxt 组件测试
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['test/nuxt/**/*.test.ts'],
          environment: 'nuxt',
        },
      }),
    ],
  },
})
```

### vitest.e2e.config.ts

E2E 测试专用配置（独立运行 E2E 测试时使用）。

## 注意事项

### E2E 测试运行较慢的原因

E2E 测试首次运行时需要：
1. 构建 Nuxt 应用（约 30-60 秒）
2. 启动测试服务器
3. 等待服务器就绪

这是正常现象。后续测试运行会复用已启动的服务器。

### Cookie 认证

由于 `nuxt-auth-utils` 使用加密 Cookie 存储会话，E2E 测试需要：
1. 使用 `globalThis.fetch` 登录（因为 `$fetch` 不暴露响应头）
2. 从 `set-cookie` 响应头提取 `nuxt-session` Cookie
3. 在后续请求中通过 `cookie` 头传递会话

**完整示例**：
```typescript
beforeAll(async () => {
  const ctx = useTestContext()
  const baseUrl = ctx.url || 'http://127.0.0.1:3000'

  const response = await globalThis.fetch(`${baseUrl}api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@example.com', password: 'admin123' }),
  })

  const setCookie = response.headers.get('set-cookie')
  if (setCookie) {
    const match = setCookie.match(/nuxt-session=[^;]+/)
    if (match) sessionCookie = match[0]
  }
})

// 使用时
const res = await $fetch('/api/endpoint', {
  headers: { cookie: sessionCookie },
})
```

### 角色值（Role）

用户角色是大写的字符串：
- `USER` - 普通用户
- `ADMIN` - 管理员

**不要写成小写**：
```typescript
// 正确
expect(user.role).toBe('USER')

// 错误
expect(user.role).toBe('user') ❌
```

### API 响应结构

认证 API 返回的响应结构：
- 登录：`{ user: {...}, message: '...' }`
- 注册：`{ user: {...}, message: '...' }`
- 用户资源：直接返回数据对象（如 `{ id: 1, title: '...' }`）

### 分离 E2E 和组件测试

`@nuxt/test-utils/runtime` 和 `@nuxt/test-utils/e2e` 不能在同一文件中混用。如果需要同时使用：

- 使用 `.nuxt.spec.ts` 或 `.nuxt.test.ts` 扩展名运行组件测试
- 使用 `.e2e.spec.ts` 或 `.e2e.test.ts` 扩展名运行 E2E 测试

或在文件中使用 `// @vitest-environment nuxt` 注释指定环境。

## 参考文档

- [Nuxt Testing](https://nuxt.com/docs/getting-started/testing)
- [@nuxt/test-utils](https://github.com/nuxt/test-utils)
- [Vitest](https://vitest.dev/)
- [nuxt-auth-utils](https://github.com/atinux/nuxt-auth-utils)
