import { describe, it, expect, beforeAll } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'

describe('User API - Todos', () => {
  beforeAll(async () => {
    await setup({
      server: true,
      browser: false,
    })
  })

  it('should return 401 when not logged in', async () => {
    try {
      await $fetch('/api/user/todos')
      expect.fail('Should have thrown an error')
    } catch (error: any) {
      expect(error.status).toBe(401)
    }
  })

  it('should return 400 for creating todo with empty title', async () => {
    try {
      await $fetch('/api/user/todos', {
        method: 'POST',
        body: {
          title: '',
        },
      })
      expect.fail('Should have thrown an error')
    } catch (error: any) {
      expect(error.status).toBe(400)
    }
  })
})
