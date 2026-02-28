import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'

describe('Auth API - Login', () => {
  beforeAll(async () => {
    await setup({
      server: true,
      browser: false,
    })
  })

  afterAll(async () => {
    // Cleanup
  })

  it('should return 401 for invalid credentials', async () => {
    try {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: {
          email: 'nonexistent@example.com',
          password: 'wrongpassword',
        },
      })
      expect.fail('Should have thrown an error')
    } catch (error: any) {
      expect(error.status).toBe(401)
    }
  })

  it('should return 400 for missing email', async () => {
    try {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: {
          password: 'somepassword',
        },
      })
      expect.fail('Should have thrown an error')
    } catch (error: any) {
      expect(error.status).toBe(400)
    }
  })

  it('should return 400 for missing password', async () => {
    try {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: {
          email: 'test@example.com',
        },
      })
      expect.fail('Should have thrown an error')
    } catch (error: any) {
      expect(error.status).toBe(400)
    }
  })
})
