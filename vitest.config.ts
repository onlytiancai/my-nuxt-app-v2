// Vitest 多项目测试配置
// 参考：https://nuxt.com/docs/getting-started/testing
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineConfig({
  test: {
    projects: [
      // 纯单元测试（Node 环境）
      {
        test: {
          name: 'unit',
          include: ['test/unit/**/*.test.ts'],
          environment: 'node',
        },
      },
      // Nuxt 运行时测试（组件、composables）
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['test/nuxt/**/*.test.ts'],
        },
      }),
    ],
  },
})
