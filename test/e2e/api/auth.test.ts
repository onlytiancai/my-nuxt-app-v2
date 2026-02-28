/**
 * 认证 API 测试
 * 测试注册、登录、登出、密码修改等功能
 *
 * 参考：https://nuxt.com/docs/getting-started/testing
 */
import { describe, it, expect } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'

describe('认证 API', async () => {
  // 按照 Nuxt 官方文档，setup() 应该在 describe 块中使用 await 调用
  await setup({
    server: true,
    browser: false,
    setupTimeout: 120000,
    teardownTimeout: 30000,
    build: true,
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
      expect(res.user.role).toBe('USER')  // 角色是大写的
    })

    it('邮箱已存在时注册失败', async () => {
      const email = 'test_duplicate@example.com'
      const password = 'testpassword123'

      // 先注册一次
      try {
        await $fetch('/api/auth/register', {
          method: 'POST',
          body: {
            name: 'First User',
            email,
            password,
            confirmPassword: password,
          },
        })
      } catch {
        // 忽略已存在错误
      }

      // 再次注册应该失败
      try {
        await $fetch('/api/auth/register', {
          method: 'POST',
          body: {
            name: 'Second User',
            email,
            password,
            confirmPassword: password,
          },
        })
        // 如果没有抛出错误，测试应该失败
        expect.fail('Expected registration to fail for duplicate email')
      } catch (error: any) {
        // 检查是否是 409 或包含邮箱错误信息
        expect([400, 409]).toContain(error.statusCode)
      }
    })

    it('密码过短时注册失败', async () => {
      const timestamp = Date.now()
      const email = `test_short_${timestamp}@example.com`

      try {
        await $fetch('/api/auth/register', {
          method: 'POST',
          body: {
            name: 'Test User',
            email,
            password: '123',
            confirmPassword: '123',
          },
        })
        expect.fail('Expected registration to fail for short password')
      } catch (error: any) {
        expect([400, 422]).toContain(error.statusCode)
      }
    })

    it('缺少必填字段时注册失败', async () => {
      try {
        await $fetch('/api/auth/register', {
          method: 'POST',
          body: {
            name: 'Test User',
          },
        })
        expect.fail('Expected registration to fail for missing fields')
      } catch (error: any) {
        expect([400, 422]).toContain(error.statusCode)
      }
    })

    it('两次密码不一致时注册失败', async () => {
      const timestamp = Date.now()
      const email = `test_mismatch_${timestamp}@example.com`

      try {
        await $fetch('/api/auth/register', {
          method: 'POST',
          body: {
            name: 'Test User',
            email,
            password: 'password123',
            confirmPassword: 'password456',
          },
        })
        expect.fail('Expected registration to fail for password mismatch')
      } catch (error: any) {
        expect([400, 422]).toContain(error.statusCode)
      }
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
      try {
        await $fetch('/api/auth/login', {
          method: 'POST',
          body: {
            email: 'nonexistent@example.com',
            password: 'wrongpassword',
          },
        })
        expect.fail('Expected login to fail for invalid credentials')
      } catch (error: any) {
        expect([401, 422]).toContain(error.statusCode)
      }
    })

    it('缺少必填字段时登录失败', async () => {
      try {
        await $fetch('/api/auth/login', {
          method: 'POST',
          body: {
            email: 'test@example.com',
          },
        })
        expect.fail('Expected login to fail for missing fields')
      } catch (error: any) {
        expect([400, 422]).toContain(error.statusCode)
      }
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

      // 先注册用户
      await $fetch('/api/auth/register', {
        method: 'POST',
        body: {
          name: 'Test ChangePwd User',
          email,
          password: oldPassword,
          confirmPassword: oldPassword,
        },
      }).catch(() => {})

      // 登录获取会话
      const loginRes = await $fetch('/api/auth/login', {
        method: 'POST',
        body: {
          email,
          password: oldPassword,
        },
      })

      // 从响应获取 Cookie
      const setCookie = loginRes.headers?.['set-cookie']
        ? Array.isArray(loginRes.headers['set-cookie'])
          ? loginRes.headers['set-cookie'].join('; ')
          : loginRes.headers['set-cookie']
        : ''

      // 修改密码
      const res = await $fetch('/api/auth/password', {
        method: 'POST',
        headers: {
          cookie: setCookie,
        },
        body: {
          oldPassword,
          newPassword,
        },
      })

      expect(res).toBeDefined()
    })
  })
})
