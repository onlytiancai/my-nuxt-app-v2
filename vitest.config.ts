// Vitest 配置 - 用于单元测试和 Nuxt 组件测试
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./app', import.meta.url)),
      '@': fileURLToPath(new URL('./app', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['test/unit/**/*.test.ts', 'test/nuxt/**/*.test.ts'],
    exclude: ['test/e2e/**/*.test.ts', 'node_modules/**'],
    setupFiles: ['./test/nuxt/setup.ts'],
  },
})
