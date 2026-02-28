/**
 * 认证 API 测试
 * 测试注册、登录、登出、密码修改等功能
 *
 * 注意：E2E 测试需要启动 Nuxt 服务器
 * 运行：pnpm test:e2e
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'

describe('认证 API', () => {
  beforeAll(async () => {
    await setup({
      server: true,
      browser: false,
      setupTimeout: 120000,
      teardownTimeout: 30000,
      build: true,
    })
  })

  describe('注册 API', () => {
    it('成功注册新用户', async () => {
      const timestamp = Date.now()
      const email = `test_register_${timestamp}@example.com`
      const password = 'testpassword123'
      const name = `Test User ${timestamp}`

      const res = await $fetch('/api/auth/register', {
        method: 'POST',
        body: {
          name,
          email,
          password,
          confirmPassword: password,
        },
      })

      expect(res.user).toBeDefined()
      expect(res.user.email).toBe(email)
      expect(res.user.name).toBe(name)
      expect(res.user.role).toBe('user')
    })

    it('邮箱已存在时注册失败', async () => {
      const email = 'test_duplicate@example.com'
      const password = 'testpassword123'

      // 先注册一次
      await $fetch('/api/auth/register', {
        method: 'POST',
        body: {
          name: 'First User',
          email,
          password,
          confirmPassword: password,
        },
      }).catch(() => {})

      // 再次注册应该失败
      await expect(
        $fetch('/api/auth/register', {
          method: 'POST',
          body: {
            name: 'Second User',
            email,
            password,
            confirmPassword: password,
          },
        })
      ).rejects.toMatchObject({
        statusCode: 409,
        message: expect.stringContaining('邮箱'),
      })
    })

    it('密码过短时注册失败', async () => {
      const timestamp = Date.now()
      const email = `test_short_${timestamp}@example.com`

      await expect(
        $fetch('/api/auth/register', {
          method: 'POST',
          body: {
            name: 'Test User',
            email,
            password: '123',
            confirmPassword: '123',
          },
        })
      ).rejects.toMatchObject({
        statusCode: 400,
        message: expect.stringContaining('密码'),
      })
    })

    it('缺少必填字段时注册失败', async () => {
      await expect(
        $fetch('/api/auth/register', {
          method: 'POST',
          body: {
            name: 'Test User',
          },
        })
      ).rejects.toMatchObject({
        statusCode: 400,
      })
    })

    it('两次密码不一致时注册失败', async () => {
      const timestamp = Date.now()
      const email = `test_mismatch_${timestamp}@example.com`

      await expect(
        $fetch('/api/auth/register', {
          method: 'POST',
          body: {
            name: 'Test User',
            email,
            password: 'password123',
            confirmPassword: 'password456',
          },
        })
      ).rejects.toMatchObject({
        statusCode: 400,
        message: expect.stringContaining('密码'),
      })
    })
  })

  describe('登录 API', () => {
    it('成功登录', async () => {
      const timestamp = Date.now()
      const email = `test_login_${timestamp}@example.com`
      const password = 'testpassword123'

      await $fetch('/api/auth/register', {
        method: 'POST',
        body: {
          name: 'Test Login User',
          email,
          password,
          confirmPassword: password,
        },
      }).catch(() => {})

      const res = await $fetch('/api/auth/login', {
        method: 'POST',
        body: {
          email,
          password,
        },
      })

      expect(res.user).toBeDefined()
      expect(res.user.email).toBe(email)
    })

    it('无效凭据登录失败', async () => {
      await expect(
        $fetch('/api/auth/login', {
          method: 'POST',
          body: {
            email: 'nonexistent@example.com',
            password: 'wrongpassword',
          },
        })
      ).rejects.toMatchObject({
        statusCode: 401,
      })
    })

    it('缺少必填字段时登录失败', async () => {
      await expect(
        $fetch('/api/auth/login', {
          method: 'POST',
          body: {
            email: 'test@example.com',
          },
        })
      ).rejects.toMatchObject({
        statusCode: 400,
      })
    })
  })

  describe('登出 API', () => {
    it('成功登出', async () => {
      const res = await $fetch('/api/auth/logout', {
        method: 'POST',
      })
      expect(res).toBeDefined()
    })
  })

  describe('密码修改 API', () => {
    it('成功修改密码', async () => {
      const timestamp = Date.now()
      const email = `test_changepw_${timestamp}@example.com`
      const oldPassword = 'oldpassword123'
      const newPassword = 'newpassword123'

      await $fetch('/api/auth/register', {
        method: 'POST',
        body: {
          name: 'Test ChangePwd User',
          email,
          password: oldPassword,
          confirmPassword: oldPassword,
        },
      }).catch(() => {})

      const res = await $fetch('/api/auth/password', {
        method: 'POST',
        body: {
          oldPassword,
          newPassword,
        },
      })

      expect(res).toBeDefined()
    })
  })
})
