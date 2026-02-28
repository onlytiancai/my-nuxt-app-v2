# 测试文档

本目录包含项目的所有测试代码和配置文件。

## 测试结构

按照 [Nuxt 官方文档](https://nuxt.com/docs/getting-started/testing) 推荐的测试结构：

```
test/
├── e2e/                  # E2E 测试（使用 @nuxt/test-utils/e2e）
│   └── api/              # API 端点测试
│       ├── auth.test.ts  # 认证 API 测试
│       ├── admin.test.ts # 管理员 API 测试
│       └── user.test.ts  # 用户资源 API 测试
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

# 使用 UI 界面运行测试
pnpm test:ui
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

## 配置说明

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
      // E2E 测试
      {
        test: {
          name: 'e2e',
          include: ['test/e2e/api/**/*.test.ts'],
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
