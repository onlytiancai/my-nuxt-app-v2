import { describe, expect, it } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'

describe('E2E Tests', async () => {
  await setup({
    server: true,
    build: true,
  })

  it('should render the home page', async () => {
    const html = await $fetch('/')
    expect(html).toContain('Nuxt')
  })
})
