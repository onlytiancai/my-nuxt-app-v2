import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    globals: true,
    include: ['**/*.test.{ts,js}'],
    exclude: ['**/e2e/**', '**/*.e2e.test.{ts,js}', '**/node_modules/**'],
  },
})
