// API 测试配置 - 使用 @nuxt/test-utils/e2e 运行 server 目录下的测试
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'api',
    include: ['server/**/*.test.ts'],
    environment: 'node',
    globals: true,
    setupFiles: ['./test/setup-api.ts'],
  },
})
