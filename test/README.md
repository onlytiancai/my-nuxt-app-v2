# 测试文档

本目录包含项目的所有测试代码和配置文件。

## 测试结构

```
test/
├── e2e/                  # E2E 测试（使用 @nuxt/test-utils/e2e）
│   ├── api/              # API 端点测试
│   │   ├── auth.test.ts  # 认证 API 测试
│   │   ├── admin.test.ts # 管理员 API 测试
│   │   └── user.test.ts  # 用户资源 API 测试
│   ├── browser/          # 浏览器 E2E 测试
│   │   └── auth.test.ts  # 认证流程浏览器测试
│   └── setup.ts          # E2E 测试全局设置
├── nuxt/                 # Nuxt 运行时测试（组件、composables）
│   ├── components/
│   │   ├── login.test.ts
│   │   ├── register.test.ts
│   │   └── todos.test.ts
│   └── setup.ts          # Nuxt 测试设置
└── unit/                 # 纯单元测试（Node 环境）
    └── utils/
        └── helpers.test.ts
```

## 测试命令

```bash
# 运行所有测试（unit + nuxt）
pnpm test

# 运行单元测试
pnpm test:unit

# 运行 Nuxt 组件测试
pnpm test:nuxt

# 运行 E2E API 测试（需要启动 Nuxt 服务器）
pnpm test:e2e

# 运行浏览器 E2E 测试（使用 Playwright）
pnpm test:e2e:browser

# 使用 UI 界面运行测试
pnpm test:ui

# 运行所有测试（单元 + Nuxt + E2E）
pnpm test:all
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
- 运行环境：Nuxt 运行时环境

### E2E API 测试

位置：`test/e2e/api/`

- API 端点测试
- 使用 `@nuxt/test-utils/e2e` 的 `$fetch` 和 `setup`
- 自动启动 Nuxt 测试服务器
- 运行环境：Node.js

### 浏览器 E2E 测试

位置：`test/e2e/browser/`

- 完整浏览器端测试
- 使用 Playwright
- 测试真实用户交互流程

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
import { describe, it, expect } from 'vitest'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import MyComponent from '~/components/MyComponent.vue'

describe('我的组件', () => {
  beforeEach(() => {
    registerEndpoint('/api/data', {
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

```typescript
import { describe, it, expect } from 'vitest'
import { $fetch } from '@nuxt/test-utils/e2e'

describe('API 测试', () => {
  it('应该返回数据', async () => {
    const res = await $fetch('/api/endpoint')
    expect(res.data).toBeDefined()
  })
})
```

## 配置说明

### vitest.config.ts

主配置文件，用于单元测试和 Nuxt 组件测试：
- 配置多项目测试（unit、nuxt、e2e）
- 使用 `defineVitestProject` 配置 Nuxt 环境

### vitest.e2e.config.ts

E2E 测试专用配置：
- 使用 `node` 环境
- 包含 `test/e2e` 目录
- 设置 setup 文件启动 Nuxt 服务器
- 设置更长的超时时间

### playwright.config.ts

Playwright 浏览器测试配置：
- 配置测试目录为 `test/e2e/browser`
- 使用 Chromium 浏览器

## 参考文档

- [Nuxt Testing](https://nuxt.com/docs/getting-started/testing)
- [@nuxt/test-utils](https://github.com/nuxt/test-utils)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
