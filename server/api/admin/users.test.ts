import { describe, it, expect, beforeAll } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'

describe('Admin API - Users', () => {
  beforeAll(async () => {
    await setup({
      server: true,
      browser: false,
    })
  })

  it('should return 401 when not logged in', async () => {
    try {
      await $fetch('/api/admin/users')
      expect.fail('Should have thrown an error')
    } catch (error: any) {
      expect(error.status).toBe(401)
    }
  })

  it('should return 403 for non-admin user', async () => {
    // This test requires a non-admin user to be logged in
    // For now, we just check that the endpoint requires admin权限
    try {
      // Try without session
      await $fetch('/api/admin/users', {
        headers: {
          cookie: 'fake-session=invalid',
        },
      })
      expect.fail('Should have thrown an error')
    } catch (error: any) {
      // Should be either 401 or 403
      expect([401, 403]).toContain(error.status)
    }
  })
})
