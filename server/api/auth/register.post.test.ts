import { describe, it, expect, beforeAll } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'

describe('Auth API - Register', () => {
  beforeAll(async () => {
    await setup({
      server: true,
      browser: false,
    })
  })

  it('should return 400 for missing email', async () => {
    try {
      await $fetch('/api/auth/register', {
        method: 'POST',
        body: {
          password: 'password123',
        },
      })
      expect.fail('Should have thrown an error')
    } catch (error: any) {
      expect(error.status).toBe(400)
    }
  })

  it('should return 400 for missing password', async () => {
    try {
      await $fetch('/api/auth/register', {
        method: 'POST',
        body: {
          email: 'newuser@example.com',
        },
      })
      expect.fail('Should have thrown an error')
    } catch (error: any) {
      expect(error.status).toBe(400)
    }
  })

  it('should return 400 for short password', async () => {
    try {
      await $fetch('/api/auth/register', {
        method: 'POST',
        body: {
          email: 'newuser@example.com',
          password: '123',
        },
      })
      expect.fail('Should have thrown an error')
    } catch (error: any) {
      expect(error.status).toBe(400)
    }
  })

  it('should return 400 for duplicate email', async () => {
    // First register
    try {
      await $fetch('/api/auth/register', {
        method: 'POST',
        body: {
          email: 'duplicate@example.com',
          password: 'password123',
          name: 'First User',
        },
      })
    } catch (error: any) {
      // Ignore if already exists
    }

    // Try to register again with same email
    try {
      await $fetch('/api/auth/register', {
        method: 'POST',
        body: {
          email: 'duplicate@example.com',
          password: 'password123',
          name: 'Second User',
        },
      })
      expect.fail('Should have thrown an error')
    } catch (error: any) {
      expect(error.status).toBe(400)
      expect(error.data?.message).toContain('邮箱已存在')
    }
  })
})
