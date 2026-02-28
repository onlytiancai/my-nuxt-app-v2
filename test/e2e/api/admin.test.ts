/**
 * 管理员 API 测试
 * 测试用户管理、帖子管理等功能
 *
 * 参考：https://nuxt.com/docs/getting-started/testing
 */
import { describe, it, expect, beforeAll } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'

describe('管理员 API', async () => {
  await setup({
    server: true,
    browser: false,
    setupTimeout: 120000,
    teardownTimeout: 30000,
    build: true,
  })

  let testUserId: string | number
  let adminCookie: string = ''

  // 先登录管理员账户并获取 Cookie
  beforeAll(async () => {
    let capturedCookie = ''

    // 使用原生 fetch 获取 Cookie
    const url = new URL('/api/auth/login', `http://127.0.0.1:${process.env.PORT || '3000'}`)
    const response = await globalThis.fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123',
      }),
    })

    // 从响应头获取 Cookie
    const setCookie = response.headers.get('set-cookie')
    if (setCookie) {
      // 提取 nuxt-session cookie
      const match = setCookie.match(/nuxt-session=[^;]+/)
      if (match) {
        capturedCookie = match[0]
      }
    }

    adminCookie = capturedCookie
    console.log('Admin Cookie:', adminCookie ? 'captured' : 'NOT CAPTURED')
  })

  describe('用户列表 API', () => {
    it('成功获取用户列表（管理员）', async () => {
      const res = await $fetch('/api/admin/users', {
        method: 'GET',
        headers: {
          cookie: adminCookie,
        },
      })

      expect(res.users).toBeDefined()
      expect(Array.isArray(res.users)).toBe(true)
      expect(res.pagination).toBeDefined()
      expect(res.pagination.page).toBe(1)
    })

    it('用户列表包含用户详细信息', async () => {
      const res = await $fetch('/api/admin/users', {
        method: 'GET',
        headers: {
          cookie: adminCookie,
        },
      })

      if (res.users.length > 0) {
        const user = res.users[0]
        expect(user.id).toBeDefined()
        expect(user.email).toBeDefined()
        expect(user.name).toBeDefined()
        expect(user.role).toBeDefined()
        expect(user.createdAt).toBeDefined()
      }
    })

    it('支持搜索用户', async () => {
      const res = await $fetch('/api/admin/users?search=admin', {
        method: 'GET',
        headers: {
          cookie: adminCookie,
        },
      })

      expect(res.users).toBeDefined()
      expect(Array.isArray(res.users)).toBe(true)
    })

    it('支持分页获取用户列表', async () => {
      const res = await $fetch('/api/admin/users?page=1&pageSize=5', {
        method: 'GET',
        headers: {
          cookie: adminCookie,
        },
      })

      expect(res.pagination.pageSize).toBe(5)
      expect(res.users.length).toBeLessThanOrEqual(5)
    })
  })

  describe('用户详情 API', () => {
    it('成功获取用户详情', async () => {
      const listRes = await $fetch('/api/admin/users', {
        method: 'GET',
        headers: {
          cookie: adminCookie,
        },
      })

      if (listRes.users.length > 0) {
        const userId = listRes.users[0].id
        const res = await $fetch(`/api/admin/users/${userId}`, {
          method: 'GET',
          headers: {
            cookie: adminCookie,
          },
        })

        expect(res.user).toBeDefined()
        expect(res.user.id).toBe(userId)
      }
    })

    it('获取不存在的用户详情返回 404', async () => {
      await expect(
        $fetch('/api/admin/users/999999', {
          method: 'GET',
          headers: {
            cookie: adminCookie,
          },
        })
      ).rejects.toMatchObject({
        statusCode: 404,
      })
    })
  })

  describe('用户更新 API', () => {
    it('成功更新用户信息', async () => {
      const timestamp = Date.now()
      const email = `test_update_${timestamp}@example.com`

      // 先创建一个测试用户
      try {
        await $fetch('/api/auth/register', {
          method: 'POST',
          body: {
            name: 'Test Update User',
            email,
            password: 'testpassword123',
            confirmPassword: 'testpassword123',
          },
        })
      } catch {
        // 用户可能已存在
      }

      // 获取用户 ID
      const listRes = await $fetch(`/api/admin/users?search=${email}`, {
        method: 'GET',
        headers: {
          cookie: adminCookie,
        },
      })

      if (listRes.users.length > 0) {
        const userId = listRes.users[0].id
        testUserId = userId

        const res = await $fetch(`/api/admin/users/${userId}`, {
          method: 'PATCH',
          headers: {
            cookie: adminCookie,
          },
          body: {
            name: 'Updated Name',
          },
        })

        expect(res.user).toBeDefined()
        expect(res.user.name).toBe('Updated Name')
      }
    })

    it('更新用户角色', async () => {
      if (testUserId) {
        const res = await $fetch(`/api/admin/users/${testUserId}`, {
          method: 'PATCH',
          headers: {
            cookie: adminCookie,
          },
          body: {
            role: 'admin',
          },
        })

        expect(res.user.role).toBe('admin')

        // 恢复用户角色
        await $fetch(`/api/admin/users/${testUserId}`, {
          method: 'PATCH',
          headers: {
            cookie: adminCookie,
          },
          body: {
            role: 'user',
          },
        })
      }
    })
  })

  describe('用户删除 API', () => {
    it('成功删除用户', async () => {
      const timestamp = Date.now()
      const email = `test_delete_${timestamp}@example.com`

      // 先创建一个测试用户
      try {
        await $fetch('/api/auth/register', {
          method: 'POST',
          body: {
            name: 'Test Delete User',
            email,
            password: 'testpassword123',
            confirmPassword: 'testpassword123',
          },
        })
      } catch {
        // 用户可能已存在
      }

      // 获取用户 ID
      const listRes = await $fetch(`/api/admin/users?search=${email}`, {
        method: 'GET',
        headers: {
          cookie: adminCookie,
        },
      })

      if (listRes.users.length > 0) {
        const userId = listRes.users[0].id

        const res = await $fetch(`/api/admin/users/${userId}`, {
          method: 'DELETE',
          headers: {
            cookie: adminCookie,
          },
        })

        expect(res).toBeDefined()
      }
    })
  })

  describe('帖子管理 API', () => {
    it('成功获取所有帖子列表', async () => {
      const res = await $fetch('/api/admin/posts', {
        method: 'GET',
        headers: {
          cookie: adminCookie,
        },
      })

      expect(res.posts).toBeDefined()
      expect(Array.isArray(res.posts)).toBe(true)
      expect(res.pagination).toBeDefined()
    })

    it('支持分页获取帖子列表', async () => {
      const res = await $fetch('/api/admin/posts?page=1&pageSize=5', {
        method: 'GET',
        headers: {
          cookie: adminCookie,
        },
      })

      expect(res.pagination.pageSize).toBe(5)
    })
  })
})
