// E2E API 测试配置 - 使用 @nuxt/test-utils/e2e
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/e2e/api/**/*.test.ts'],
    testTimeout: 120000,
    hookTimeout: 120000,
    setupFiles: ['./test/e2e/setup.ts'],
  },
})
