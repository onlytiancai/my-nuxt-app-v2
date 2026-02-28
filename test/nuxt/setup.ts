/**
 * Nuxt 测试设置文件
 * 初始化 Nuxt 运行时环境
 */
import { vi } from 'vitest'

// Mock Nuxt 全局对象
vi.mock('#app', () => ({
  useNuxtApp: () => ({
    $fetch: globalThis.$fetch,
  }),
}))

// 重置所有 mocks 在每个测试之前
beforeEach(() => {
  vi.clearAllMocks()
})
