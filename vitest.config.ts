import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    include: ['**/*.test.{ts,js}'],
    exclude: ['**/e2e/**', '**/*.e2e.test.{ts,js}'],
  },
})
